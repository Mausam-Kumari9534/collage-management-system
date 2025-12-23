import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching courses',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (course: { title: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
        .single();

      if (error) throw error;
      
      setCourses(prev => [data, ...prev]);
      toast({
        title: 'Course created',
        description: `${course.title} has been added successfully.`,
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error creating course',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateCourse = async (id: string, updates: { title?: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCourses(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: 'Course updated',
        description: 'Course information has been updated successfully.',
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error updating course',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCourses(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Course deleted',
        description: 'Course has been removed successfully.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error deleting course',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses,
  };
};
