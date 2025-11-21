-- Eliminar la función existente
DROP FUNCTION IF EXISTS public.get_explanatory_videos();

-- Recrear la función con button_text y button_section
CREATE FUNCTION public.get_explanatory_videos()
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID,
  thumbnail_url TEXT,
  button_text TEXT,
  button_section TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    ev.uploaded_by,
    ev.thumbnail_url,
    ev.button_text,
    ev.button_section
  FROM explanatory_videos ev
  ORDER BY ev.created_at DESC;
END;
$$;