import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface StudentAssignment {
  id: string;
  student_user_id: string;
  course_id: string;
  assigned_at: string;
  assigned_by: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  name: string | null;
}

export const useStudentAssignments = () => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, user_id, course_id, enrolled_at')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const mappedAssignments = (data || []).map((item: any) => ({
        id: item.id,
        student_user_id: item.user_id,
        course_id: item.course_id,
        assigned_at: item.enrolled_at,
        assigned_by: 'system' // database doesn't have assigned_by, use placeholder
      }));

      setAssignments(mappedAssignments);
    } catch (error: any) {
      toast({
        title: 'Error fetching assignments',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfiles = async () => {
    try {
      // Get all users with student role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');

      if (rolesError) throw rolesError;

      if (roles && roles.length > 0) {
        const userIds = roles.map(r => r.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, name')
          .in('id', userIds);

        if (profilesError) throw profilesError;
        setStudentProfiles(profiles || []);
      }
    } catch (error: any) {
      console.error('Error fetching student profiles:', error);
    }
  };

  const assignCourse = async (studentUserId: string, courseId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{
          user_id: studentUserId,
          course_id: courseId,
        }])
        .select()
        .single();

      if (error) throw error;

      const newAssignment: StudentAssignment = {
        id: data.id,
        student_user_id: data.user_id,
        course_id: data.course_id,
        assigned_at: data.enrolled_at,
        assigned_by: user.id
      };

      setAssignments(prev => [newAssignment, ...prev]);
      toast({
        title: 'Course assigned',
        description: 'Course has been assigned to the student.',
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error assigning course',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const unassignCourse = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast({
        title: 'Assignment removed',
        description: 'Course assignment has been removed.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error removing assignment',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const isAssigned = (studentUserId: string, courseId: string) => {
    return assignments.some(
      a => a.student_user_id === studentUserId && a.course_id === courseId
    );
  };

  const getAssignmentId = (studentUserId: string, courseId: string) => {
    return assignments.find(
      a => a.student_user_id === studentUserId && a.course_id === courseId
    )?.id;
  };

  useEffect(() => {
    fetchAssignments();
    fetchStudentProfiles();
  }, []);

  return {
    assignments,
    studentProfiles,
    loading,
    assignCourse,
    unassignCourse,
    isAssigned,
    getAssignmentId,
    refetch: fetchAssignments,
  };
};
