-- Eliminar las políticas existentes que causan el error
DROP POLICY IF EXISTS "Only admins can update about page content" ON public.about_page_content;
DROP POLICY IF EXISTS "Only admins can insert about page content" ON public.about_page_content;

-- Crear nuevas políticas que usen directamente el UUID del admin
CREATE POLICY "Only specific admin can update about page content" 
  ON public.about_page_content 
  FOR UPDATE 
  USING (auth.uid() = '33a8ad94-8bb9-4ba6-90f1-b8f0d77e8c76'::uuid);

CREATE POLICY "Only specific admin can insert about page content" 
  ON public.about_page_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = '33a8ad94-8bb9-4ba6-90f1-b8f0d77e8c76'::uuid);

-- Agregar política de UPSERT si no existe
CREATE POLICY "Only specific admin can upsert about page content" 
  ON public.about_page_content 
  FOR ALL
  USING (auth.uid() = '33a8ad94-8bb9-4ba6-90f1-b8f0d77e8c76'::uuid)
  WITH CHECK (auth.uid() = '33a8ad94-8bb9-4ba6-90f1-b8f0d77e8c76'::uuid);