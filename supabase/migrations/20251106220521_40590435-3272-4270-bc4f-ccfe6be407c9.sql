-- Drop and recreate the functions to add thumbnail_url support
DROP FUNCTION IF EXISTS public.get_explanatory_videos();
DROP FUNCTION IF EXISTS public.insert_explanatory_video(text, text, text, text, bigint, uuid);

-- Recreate insert_explanatory_video with thumbnail_url parameter
CREATE OR REPLACE FUNCTION public.insert_explanatory_video(
  p_title text,
  p_description text,
  p_file_path text,
  p_file_name text,
  p_file_size bigint,
  p_uploaded_by uuid,
  p_thumbnail_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO explanatory_videos (title, description, file_path, file_name, file_size, uploaded_by, thumbnail_url)
  VALUES (p_title, p_description, p_file_path, p_file_name, p_file_size, p_uploaded_by, p_thumbnail_url)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$function$;

-- Recreate get_explanatory_videos to include thumbnail_url
CREATE OR REPLACE FUNCTION public.get_explanatory_videos()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  file_path text,
  file_name text,
  file_size bigint,
  created_at timestamp with time zone,
  uploaded_by uuid,
  thumbnail_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
    ev.uploaded_by,
    ev.thumbnail_url
  FROM explanatory_videos ev
  ORDER BY ev.created_at DESC;
END;
$function$;