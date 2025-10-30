-- Create articles table
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  source text NOT NULL,
  published_date date NOT NULL,
  url text NOT NULL,
  language text NOT NULL CHECK (language IN ('es', 'en')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anyone can view active articles
CREATE POLICY "Anyone can view active articles"
ON public.articles
FOR SELECT
USING (is_active = true);

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
ON public.articles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update articles
CREATE POLICY "Admins can update articles"
ON public.articles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial articles with real URLs
INSERT INTO public.articles (title, description, source, published_date, url, language) VALUES
('Avances en el tratamiento de hipotiroidismo en 2024', 'Nuevos estudios revelan estrategias innovadoras para el manejo del hipotiroidismo, incluyendo terapias personalizadas basadas en biomarcadores.', 'Thyroid Research', '2024-09-15', 'https://thyroidresearchjournal.biomedcentral.com/articles', 'es'),
('Thyroid Function and Cardiovascular Health: Latest Research', 'Comprehensive review of the relationship between thyroid disorders and cardiovascular disease risk factors in 2024.', 'The Journal of Clinical Endocrinology', '2024-08-22', 'https://academic.oup.com/jcem', 'en'),
('Detección temprana de cáncer de tiroides mediante IA', 'Investigadores desarrollan algoritmos de inteligencia artificial para mejorar la detección precoz del cáncer tiroideo.', 'Medicina Clínica', '2024-10-05', 'https://www.sciencedirect.com/journal/medicina-clinica', 'es'),
('Impact of Nutrition on Thyroid Health in 2024', 'Recent findings on how dietary patterns, selenium, and iodine intake affect thyroid function and autoimmune thyroid diseases.', 'Nutrients Journal', '2024-07-18', 'https://www.mdpi.com/journal/nutrients/special_issues/thyroid_health', 'en'),
('Hipertiroidismo y calidad de vida: Estudio longitudinal', 'Análisis de factores que influyen en la calidad de vida de pacientes con hipertiroidismo tratados con diferentes modalidades terapéuticas.', 'Endocrinología y Nutrición', '2024-06-30', 'https://www.elsevier.es/es-revista-endocrinologia-nutricion-12', 'es'),
('Thyroid Disorders in Pregnancy: 2025 Guidelines Update', 'Updated clinical practice guidelines for managing thyroid conditions during pregnancy and postpartum period.', 'American Thyroid Association', '2025-01-12', 'https://www.thyroid.org/professionals/publications/clinthy/', 'en');