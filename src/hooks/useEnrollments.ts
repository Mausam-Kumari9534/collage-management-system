import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  course?: {
    id: string;
    title: string;
    description: string | null;
  };
}

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEnrollments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(id, title, description)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching enrollments',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (courseId: string) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{ user_id: user.id, course_id: courseId }])
        .select(`
          *,
          course:courses(id, title, description)
        `)
        .single();

      if (error) throw error;
      
      setEnrollments(prev => [data, ...prev]);
      toast({
        title: 'Enrolled successfully',
        description: `You have been enrolled in the course.`,
      });
      return { data, error: null };
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already enrolled',
          description: 'You are already enrolled in this course.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error enrolling',
          description: error.message,
          variant: 'destructive',
        });
      }
      return { data: null, error };
    }
  };

  const unenroll = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;
      
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      toast({
        title: 'Unenrolled',
        description: 'You have been unenrolled from the course.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error unenrolling',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  return {
    enrollments,
    loading,
    enroll,
    unenroll,
    isEnrolled,
    refetch: fetchEnrollments,
  };
};
