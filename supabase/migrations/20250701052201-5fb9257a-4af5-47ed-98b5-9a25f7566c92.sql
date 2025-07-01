
-- Crear tabla para almacenar información de la página "Quiénes somos"
CREATE TABLE public.about_page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  content text,
  images jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insertar contenido inicial
INSERT INTO public.about_page_content (section_key, content) VALUES 
('description', 'Al-tiroides nace como una iniciativa para democratizar el acceso a información de calidad sobre la salud tiroidea.

Nuestro objetivo es crear un espacio donde pacientes, familiares y profesionales de la salud puedan encontrar recursos confiables, herramientas útiles y una comunidad de apoyo.

Creemos que la información es poder, y cuando se trata de salud, tener acceso a datos precisos y comprensibles puede marcar la diferencia en el bienestar de las personas.');

-- Habilitar Row Level Security
ALTER TABLE public.about_page_content ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer
CREATE POLICY "Anyone can view about page content" 
  ON public.about_page_content 
  FOR SELECT 
  USING (true);

-- Política para que solo administradores puedan actualizar
CREATE POLICY "Only admins can update about page content" 
  ON public.about_page_content 
  FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'cristobal804g@gmail.com'
  ));

-- Política para que solo administradores puedan insertar
CREATE POLICY "Only admins can insert about page content" 
  ON public.about_page_content 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'cristobal804g@gmail.com'
  ));
