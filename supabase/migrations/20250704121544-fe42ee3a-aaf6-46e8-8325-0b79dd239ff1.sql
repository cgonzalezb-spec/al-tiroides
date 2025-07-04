-- Eliminar las políticas existentes que usan el UUID incorrecto
DROP POLICY IF EXISTS "Only specific admin can update about page content" ON public.about_page_content;
DROP POLICY IF EXISTS "Only specific admin can insert about page content" ON public.about_page_content;
DROP POLICY IF EXISTS "Only specific admin can upsert about page content" ON public.about_page_content;

-- Crear nuevas políticas con el UUID correcto del usuario actual
CREATE POLICY "Only current admin can update about page content" 
  ON public.about_page_content 
  FOR UPDATE 
  USING (auth.uid() = 'a676066f-f64b-4f09-a1e7-31a6513a27fe'::uuid);

CREATE POLICY "Only current admin can insert about page content" 
  ON public.about_page_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = 'a676066f-f64b-4f09-a1e7-31a6513a27fe'::uuid);

CREATE POLICY "Only current admin can upsert about page content" 
  ON public.about_page_content 
  FOR ALL
  USING (auth.uid() = 'a676066f-f64b-4f09-a1e7-31a6513a27fe'::uuid)
  WITH CHECK (auth.uid() = 'a676066f-f64b-4f09-a1e7-31a6513a27fe'::uuid);