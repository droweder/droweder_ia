-- Create the bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('company_files', 'company_files', true)
ON CONFLICT (id) DO NOTHING;

-- Optional: Create basic storage policies for authenticated users
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING ( bucket_id = 'company_files' );

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'company_files' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects
FOR UPDATE USING ( bucket_id = 'company_files' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects
FOR DELETE USING ( bucket_id = 'company_files' AND auth.role() = 'authenticated' );
