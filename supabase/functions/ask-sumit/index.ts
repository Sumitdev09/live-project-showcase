import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

async function buildContext() {
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const [profileRes, projectsRes, expRes, eduRes, certRes, skillsRes] = await Promise.all([
    sb.from("profiles").select("*").limit(1).maybeSingle(),
    sb.from("projects").select("title,description,category,technologies,live_url,github_url,featured"),
    sb.from("experiences").select("company,position,start_date,end_date,is_current,location,description"),
    sb.from("education").select("institution,degree,field,start_year,end_year,description"),
    sb.from("certificates").select("title,issuer,issue_date,description"),
    sb.from("skill_categories").select("title,skills").order("sort_order"),
  ]);

  const p = profileRes.data || {};
  const lines: string[] = [];
  lines.push(`# About ${p.full_name || "Sumit"}`);
  if (p.title) lines.push(`Title: ${p.title}`);
  if (p.location) lines.push(`Location: ${p.location}`);
  if (p.bio) lines.push(`Bio: ${p.bio}`);
  if (p.email) lines.push(`Email: ${p.email}`);
  if (p.phone) lines.push(`Phone: ${p.phone}`);
  const links = [p.linkedin && `LinkedIn: ${p.linkedin}`, p.github && `GitHub: ${p.github}`, p.twitter && `Twitter: ${p.twitter}`, p.instagram && `Instagram: ${p.instagram}`, p.resume_url && `Resume: ${p.resume_url}`].filter(Boolean);
  if (links.length) lines.push(`Links:\n- ${links.join("\n- ")}`);

  if (skillsRes.data?.length) {
    lines.push(`\n## Skills`);
    for (const c of skillsRes.data) {
      const names = (c.skills || []).map((s: any) => s.name || s).join(", ");
      lines.push(`- ${c.title}: ${names}`);
    }
  }
  if (p.tools?.length) lines.push(`Tools: ${p.tools.join(", ")}`);

  if (expRes.data?.length) {
    lines.push(`\n## Experience`);
    for (const e of expRes.data) {
      const dates = `${e.start_date || ""} – ${e.is_current ? "Present" : (e.end_date || "")}`;
      lines.push(`- ${e.position} @ ${e.company} (${dates}, ${e.location || ""}): ${e.description || ""}`);
    }
  }

  if (eduRes.data?.length) {
    lines.push(`\n## Education`);
    for (const e of eduRes.data) {
      lines.push(`- ${e.degree || ""} ${e.field ? "in " + e.field : ""} @ ${e.institution} (${e.start_year || ""}–${e.end_year || ""}): ${e.description || ""}`);
    }
  }

  if (projectsRes.data?.length) {
    lines.push(`\n## Projects`);
    for (const pr of projectsRes.data) {
      const tech = (pr.technologies || []).join(", ");
      lines.push(`- ${pr.title} [${pr.category || ""}]${pr.featured ? " (featured)" : ""}: ${pr.description || ""} ${tech ? `Tech: ${tech}.` : ""} ${pr.live_url ? `Live: ${pr.live_url}.` : ""} ${pr.github_url ? `Code: ${pr.github_url}.` : ""}`);
    }
  }

  if (certRes.data?.length) {
    lines.push(`\n## Certificates`);
    for (const c of certRes.data) {
      lines.push(`- ${c.title} – ${c.issuer || ""} (${c.issue_date || ""}): ${c.description || ""}`);
    }
  }

  if (p.achievements?.length) {
    lines.push(`\n## Achievements`);
    for (const a of p.achievements) lines.push(`- ${a.title || ""}: ${a.description || ""}`);
  }

  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const context = await buildContext();
    const system = `You are "Ask Sumit" — a friendly, concise AI assistant that answers questions about Sumit Yadav for recruiters, clients, and visitors of his portfolio.

Speak in first-person about Sumit when natural ("Sumit has...", "He built..."). Be warm, professional, and brief (2–5 sentences unless the user asks for detail). Use markdown for lists/links when helpful.

Only use the information below. If you don't know something, say so honestly and suggest contacting Sumit directly via the Contact section or email. Never invent projects, dates, employers, or credentials.

If asked about hiring, availability, rates, or collaboration, encourage the user to use the contact form or email Sumit.

--- SUMIT'S PROFILE ---
${context}
--- END PROFILE ---`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      const status = aiRes.status;
      let msg = "AI request failed";
      if (status === 429) msg = "Rate limit reached, try again in a moment.";
      if (status === 402) msg = "AI credits exhausted. Please contact the site owner.";
      return new Response(JSON.stringify({ error: msg, detail: text }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(aiRes.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
