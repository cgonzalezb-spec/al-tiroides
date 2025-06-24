
-- Verificar que la tabla tips tenga la política correcta para acceso público
DROP POLICY IF EXISTS "Tips are viewable by everyone." ON public.tips;

-- Crear política que permita a todos ver los tips (sin autenticación requerida)
CREATE POLICY "Tips are viewable by everyone" 
  ON public.tips 
  FOR SELECT 
  USING (true);
