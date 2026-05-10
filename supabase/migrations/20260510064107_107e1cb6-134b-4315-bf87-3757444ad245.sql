
CREATE TABLE public.reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('project','blog_post')),
  target_id uuid NOT NULL,
  emoji text NOT NULL CHECK (emoji IN ('clap','heart','fire','rocket','wow')),
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (target_type, target_id, emoji, visitor_id)
);

CREATE INDEX idx_reactions_target ON public.reactions (target_type, target_id);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reactions"
  ON public.reactions FOR SELECT
  TO public USING (true);

CREATE POLICY "Anyone can add a reaction"
  ON public.reactions FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "Anyone can remove their own reaction"
  ON public.reactions FOR DELETE
  TO public USING (true);

CREATE POLICY "Admin manage reactions"
  ON public.reactions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
