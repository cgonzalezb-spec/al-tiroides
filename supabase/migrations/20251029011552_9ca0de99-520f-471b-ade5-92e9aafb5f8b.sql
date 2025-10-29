-- Create pharmacy_links table for curated pharmacy URLs
CREATE TABLE IF NOT EXISTS public.pharmacy_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_name TEXT NOT NULL,
  pharmacy_name TEXT NOT NULL,
  presentation TEXT NOT NULL,
  price INTEGER NOT NULL,
  product_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pharmacy_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active pharmacy links"
  ON public.pharmacy_links
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert pharmacy links"
  ON public.pharmacy_links
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pharmacy links"
  ON public.pharmacy_links
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pharmacy links"
  ON public.pharmacy_links
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_pharmacy_links_medication ON public.pharmacy_links(medication_name);

-- Insert initial data for Levotiroxina
INSERT INTO public.pharmacy_links (medication_name, pharmacy_name, presentation, price, product_url) VALUES
('levotiroxina', 'Cruz Verde', 'Eutirox 100mcg x30', 8990, 'https://www.cruzverde.cl/buscador?q=eutirox'),
('levotiroxina', 'Salcobrand', 'Eutirox 100mcg x30', 9490, 'https://www.salcobrand.cl/search/?text=eutirox'),
('levotiroxina', 'Farmacias Ahumada', 'Levotiroxina 100mcg x30', 8790, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina'),
('levotiroxina', 'Farmacias del Dr. Simi', 'Levotiroxina 100mcg x30', 7990, 'https://www.farmaciasdelsimi.cl/farmacia/buscar?q=levotiroxina');

-- Insert initial data for Metimazol
INSERT INTO public.pharmacy_links (medication_name, pharmacy_name, presentation, price, product_url) VALUES
('metimazol', 'Cruz Verde', 'Tapazol 5mg x30', 14990, 'https://www.cruzverde.cl/buscador?q=tapazol'),
('metimazol', 'Salcobrand', 'Tapazol 5mg x30', 15490, 'https://www.salcobrand.cl/search/?text=tapazol'),
('metimazol', 'Farmacias Ahumada', 'Metimazol 5mg x30', 13990, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=metimazol'),
('metimazol', 'Farmacias del Dr. Simi', 'Metimazol 5mg x30', 12990, 'https://www.farmaciasdelsimi.cl/farmacia/buscar?q=metimazol');

-- Insert initial data for Propranolol
INSERT INTO public.pharmacy_links (medication_name, pharmacy_name, presentation, price, product_url) VALUES
('propranolol', 'Cruz Verde', 'Propranolol 40mg x30', 5990, 'https://www.cruzverde.cl/buscador?q=propranolol'),
('propranolol', 'Salcobrand', 'Propranolol 40mg x30', 6490, 'https://www.salcobrand.cl/search/?text=propranolol'),
('propranolol', 'Farmacias Ahumada', 'Propranolol 40mg x30', 4990, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=propranolol'),
('propranolol', 'Farmacias del Dr. Simi', 'Propranolol 40mg x30', 3990, 'https://www.farmaciasdelsimi.cl/farmacia/buscar?q=propranolol');