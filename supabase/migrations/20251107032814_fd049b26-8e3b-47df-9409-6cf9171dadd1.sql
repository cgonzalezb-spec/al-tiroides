-- Drop existing INSERT policy for user_questions
DROP POLICY IF EXISTS "Anyone can submit questions" ON public.user_questions;

-- Create new policy that explicitly allows anonymous users to insert questions
CREATE POLICY "Anyone including anonymous can submit questions"
ON public.user_questions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Update SELECT policy to allow anonymous users to view questions too (optional but recommended)
DROP POLICY IF EXISTS "Authenticated users can view questions and responses" ON public.user_questions;

CREATE POLICY "Anyone can view questions and responses"
ON public.user_questions
FOR SELECT
TO anon, authenticated
USING (true);