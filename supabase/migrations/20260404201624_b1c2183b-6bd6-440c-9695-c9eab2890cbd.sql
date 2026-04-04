
-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Auth upload files" ON storage.objects;
DROP POLICY IF EXISTS "Auth update uploads" ON storage.objects;
DROP POLICY IF EXISTS "Auth manage uploads" ON storage.objects;

-- Recreate scoped to admin only
CREATE POLICY "Admin upload files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'uploads'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admin update files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'uploads'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admin delete files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'uploads'
    AND public.has_role(auth.uid(), 'admin')
  );
