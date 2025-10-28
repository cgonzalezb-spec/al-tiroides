-- Fix 1: Restrict user_questions SELECT to authenticated users only
-- Drop the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view questions and responses" ON public.user_questions;

-- Create new restricted SELECT policy
CREATE POLICY "Authenticated users can view questions and responses"
ON public.user_questions
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix 2: Create proper role-based access control system
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'health_professional', 'visitor');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Now create the admin management policy using the function
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update about_page_content policies to use role-based access instead of hardcoded UUID
DROP POLICY IF EXISTS "Only current admin can insert about page content" ON public.about_page_content;
DROP POLICY IF EXISTS "Only current admin can update about page content" ON public.about_page_content;
DROP POLICY IF EXISTS "Only current admin can upsert about page content" ON public.about_page_content;

CREATE POLICY "Admins can insert about page content"
ON public.about_page_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update about page content"
ON public.about_page_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete about page content"
ON public.about_page_content
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert the admin role for the existing admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a676066f-f64b-4f09-a1e7-31a6513a27fe', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;