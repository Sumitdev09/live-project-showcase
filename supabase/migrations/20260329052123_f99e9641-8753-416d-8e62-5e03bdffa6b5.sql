ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

CREATE POLICY "Auth manage uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads');

CREATE POLICY "Auth update uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads');