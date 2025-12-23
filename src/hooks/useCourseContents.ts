import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseContent {
  id: string;
  course_id: string;
  content_type: 'video' | 'notes';
  title: string;
  file_url: string;
  file_name: string;
  created_at: string;
  updated_at: string;
}

export const useCourseContents = (courseId?: string) => {
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchContents = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_contents')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents((data || []) as CourseContent[]);
    } catch (error: any) {
      toast({
        title: 'Error fetching course contents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadContent = async (
    file: File,
    contentType: 'video' | 'notes',
    title: string
  ) => {
    if (!courseId) return { error: new Error('No course ID') };

    try {
      const bucket = contentType === 'video' ? 'course-videos' : 'course-notes';
      const filePath = `${courseId}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('course_contents')
        .insert([{
          course_id: courseId,
          content_type: contentType,
          title,
          file_url: publicUrl,
          file_name: file.name,
        }])
        .select()
        .single();

      if (error) throw error;

      setContents(prev => [data as CourseContent, ...prev]);
      toast({
        title: 'Content uploaded',
        description: `${title} has been uploaded successfully.`,
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error uploading content',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteContent = async (contentId: string, fileUrl: string, contentType: 'video' | 'notes') => {
    try {
      const bucket = contentType === 'video' ? 'course-videos' : 'course-notes';
      const filePath = fileUrl.split(`${bucket}/`)[1];
      
      if (filePath) {
        await supabase.storage.from(bucket).remove([filePath]);
      }

      const { error } = await supabase
        .from('course_contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContents(prev => prev.filter(c => c.id !== contentId));
      toast({
        title: 'Content deleted',
        description: 'Content has been removed successfully.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error deleting content',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchContents();
    }
  }, [courseId]);

  return {
    contents,
    loading,
    uploadContent,
    deleteContent,
    refetch: fetchContents,
  };
};
