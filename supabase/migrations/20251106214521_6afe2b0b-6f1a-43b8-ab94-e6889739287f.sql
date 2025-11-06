-- Crear tabla para videos explicativos
CREATE TABLE IF NOT EXISTS public.explanatory_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE public.explanatory_videos ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver los videos
CREATE POLICY "Videos are viewable by everyone"
  ON public.explanatory_videos
  FOR SELECT
  USING (true);

-- Política para que usuarios autenticados puedan insertar videos
CREATE POLICY "Authenticated users can insert videos"
  ON public.explanatory_videos
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política para que solo el creador o admin pueda eliminar videos
CREATE POLICY "Users can delete their own videos"
  ON public.explanatory_videos
  FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_explanatory_videos_created_at 
  ON public.explanatory_videos(created_at DESC);