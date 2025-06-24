
-- Crear tabla para almacenar las preguntas de usuarios
CREATE TABLE public.user_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  question TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_date TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id)
);

-- Habilitar Row Level Security
ALTER TABLE public.user_questions ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda enviar preguntas (INSERT)
CREATE POLICY "Anyone can submit questions" 
  ON public.user_questions 
  FOR INSERT 
  WITH CHECK (true);

-- Política para que cualquiera pueda ver las preguntas y respuestas (SELECT)
CREATE POLICY "Anyone can view questions and responses" 
  ON public.user_questions 
  FOR SELECT 
  USING (true);

-- Política para que solo usuarios autenticados puedan responder (UPDATE)
CREATE POLICY "Authenticated users can respond to questions" 
  ON public.user_questions 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
