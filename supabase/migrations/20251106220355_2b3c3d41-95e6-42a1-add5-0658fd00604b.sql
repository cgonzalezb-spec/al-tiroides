-- Add thumbnail_url column to explanatory_videos table
ALTER TABLE explanatory_videos 
ADD COLUMN thumbnail_url text;

COMMENT ON COLUMN explanatory_videos.thumbnail_url IS 'URL de la miniatura del video (para videos externos o personalizados)';