-- Agregar campos para botón de navegación a sección en videos explicativos
ALTER TABLE explanatory_videos 
ADD COLUMN button_text TEXT,
ADD COLUMN button_section TEXT;

COMMENT ON COLUMN explanatory_videos.button_text IS 'Texto del botón de navegación (ej: "Ir a más detalles de fisiología")';
COMMENT ON COLUMN explanatory_videos.button_section IS 'ID de la sección a la que navega el botón (ej: "fisiologia")';

-- Actualizar función insert para incluir nuevos campos
CREATE OR REPLACE FUNCTION public.insert_explanatory_video(
  p_title TEXT,
  p_description TEXT,
  p_file_path TEXT,
  p_file_name TEXT,
  p_file_size BIGINT,
  p_uploaded_by UUID,
  p_thumbnail_url TEXT DEFAULT NULL,
  p_button_text TEXT DEFAULT NULL,
  p_button_section TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_video_id UUID;
BEGIN
  INSERT INTO explanatory_videos (
    title,
    description,
    file_path,
    file_name,
    file_size,
    uploaded_by,
    thumbnail_url,
    button_text,
    button_section
  ) VALUES (
    p_title,
    p_description,
    p_file_path,
    p_file_name,
    p_file_size,
    p_uploaded_by,
    p_thumbnail_url,
    p_button_text,
    p_button_section
  )
  RETURNING id INTO v_video_id;
  
  RETURN v_video_id;
END;
$$;

-- Actualizar función update para incluir nuevos campos
CREATE OR REPLACE FUNCTION public.update_explanatory_video(
  p_video_id UUID,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_file_path TEXT DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL,
  p_button_text TEXT DEFAULT NULL,
  p_button_section TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE explanatory_videos
  SET
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    file_path = COALESCE(p_file_path, file_path),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    button_text = p_button_text,
    button_section = p_button_section
  WHERE id = p_video_id;
  
  RETURN FOUND;
END;
$$;