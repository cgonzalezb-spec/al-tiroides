-- Fix authorization bypass in user_questions table
-- Drop the existing weak policy
DROP POLICY IF EXISTS "Authenticated users can respond to questions" ON public.user_questions;

-- Create new strict policy that only allows admins and health professionals to respond
CREATE POLICY "Only admins and health professionals can respond"
ON public.user_questions 
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'health_professional'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'health_professional'::app_role)
);