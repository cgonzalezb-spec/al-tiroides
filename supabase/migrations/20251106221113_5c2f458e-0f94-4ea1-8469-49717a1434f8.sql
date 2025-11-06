-- Create function to update explanatory videos
CREATE OR REPLACE FUNCTION public.update_explanatory_video(
  p_video_id uuid,
  p_title text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_file_path text DEFAULT NULL,
  p_thumbnail_url text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE explanatory_videos
  SET 
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    file_path = COALESCE(p_file_path, file_path),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url)
  WHERE id = p_video_id;
  
  RETURN FOUND;
END;
$function$;