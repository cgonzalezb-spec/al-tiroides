-- Create storage bucket for pharmacy logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pharmacy-logos',
  'pharmacy-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
);

-- Create table to store pharmacy logo references
CREATE TABLE IF NOT EXISTS public.pharmacy_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_name TEXT NOT NULL UNIQUE,
  logo_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on pharmacy_logos table
ALTER TABLE public.pharmacy_logos ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view pharmacy logos
CREATE POLICY "Anyone can view pharmacy logos"
ON public.pharmacy_logos
FOR SELECT
USING (true);

-- Only admins can insert pharmacy logos
CREATE POLICY "Admins can insert pharmacy logos"
ON public.pharmacy_logos
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update pharmacy logos
CREATE POLICY "Admins can update pharmacy logos"
ON public.pharmacy_logos
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete pharmacy logos
CREATE POLICY "Admins can delete pharmacy logos"
ON public.pharmacy_logos
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for pharmacy-logos bucket
-- Allow everyone to view logos
CREATE POLICY "Anyone can view pharmacy logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pharmacy-logos');

-- Only admins can upload logos
CREATE POLICY "Admins can upload pharmacy logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'pharmacy-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update logos
CREATE POLICY "Admins can update pharmacy logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'pharmacy-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete logos
CREATE POLICY "Admins can delete pharmacy logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'pharmacy-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create function to update pharmacy_logos timestamp
CREATE OR REPLACE FUNCTION public.update_pharmacy_logos_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pharmacy_logos_updated_at
BEFORE UPDATE ON public.pharmacy_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_pharmacy_logos_timestamp();