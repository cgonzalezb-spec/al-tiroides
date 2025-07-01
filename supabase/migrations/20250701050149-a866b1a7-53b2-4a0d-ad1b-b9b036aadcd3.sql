
-- Create storage bucket for explanatory videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('explanatory-videos', 'explanatory-videos', true);

-- Create storage policies for the new bucket
CREATE POLICY "Public Access for explanatory videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'explanatory-videos');

CREATE POLICY "Authenticated users can upload explanatory videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'explanatory-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own explanatory videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'explanatory-videos' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own explanatory videos"  
  ON storage.objects FOR DELETE
  USING (bucket_id = 'explanatory-videos' AND auth.uid() = owner);

-- Create database functions to handle video operations
CREATE OR REPLACE FUNCTION get_explanatory_videos()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ev.id,
    ev.title,
    ev.description,
    ev.file_path,
    ev.file_name,
    ev.file_size,
    ev.created_at,
    ev.uploaded_by
  FROM explanatory_videos ev
  ORDER BY ev.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION insert_explanatory_video(
  p_title TEXT,
  p_description TEXT,
  p_file_path TEXT,
  p_file_name TEXT,
  p_file_size BIGINT,
  p_uploaded_by UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO explanatory_videos (title, description, file_path, file_name, file_size, uploaded_by)
  VALUES (p_title, p_description, p_file_path, p_file_name, p_file_size, p_uploaded_by)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_explanatory_video(p_video_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM explanatory_videos WHERE id = p_video_id;
  RETURN FOUND;
END;
$$;
