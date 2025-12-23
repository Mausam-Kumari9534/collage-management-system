-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public) VALUES ('course-videos', 'course-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('course-notes', 'course-notes', true);

-- Storage policies for course-videos
CREATE POLICY "Admins can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

-- Storage policies for course-notes
CREATE POLICY "Admins can upload course notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-notes' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course notes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-notes' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course notes"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-notes' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can view course notes"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-notes');

-- Create course_contents table
CREATE TABLE public.course_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'notes')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on course_contents
ALTER TABLE public.course_contents ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_contents
CREATE POLICY "Admins can manage course contents"
ON public.course_contents FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view course contents for enrolled courses"
ON public.course_contents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.course_id = course_contents.course_id
    AND enrollments.user_id = auth.uid()
  )
);

-- Create student_course_assignments table for specific student assignments
CREATE TABLE public.student_course_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL,
  UNIQUE(student_user_id, course_id)
);

-- Enable RLS on student_course_assignments
ALTER TABLE public.student_course_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_course_assignments
CREATE POLICY "Admins can manage student assignments"
ON public.student_course_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their assignments"
ON public.student_course_assignments FOR SELECT
USING (student_user_id = auth.uid());

-- Add trigger for updated_at on course_contents
CREATE TRIGGER update_course_contents_updated_at
BEFORE UPDATE ON public.course_contents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();