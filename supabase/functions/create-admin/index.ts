import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const email = 'admin@portfolio.com';
  const password = 'X#9kLm!Qr$7vZp';

  // Check if user exists
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const existing = users?.users?.find(u => u.email === email);

  if (existing) {
    return new Response(JSON.stringify({ message: 'Admin already exists', email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Admin created', email }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
