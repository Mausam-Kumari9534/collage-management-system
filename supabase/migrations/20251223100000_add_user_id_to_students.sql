ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure one student profile per user
CREATE UNIQUE INDEX students_user_id_key ON public.students(user_id);

-- Students RLS policies
CREATE POLICY "Students can view their own student record"
ON public.students FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can create their own student record"
ON public.students FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own student record"
ON public.students FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
