import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  name: string;
  age: number;
  city: string;
  created_at: string;
  updated_at: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching students',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();

      if (error) throw error;
      
      setStudents(prev => [data, ...prev]);
      toast({
        title: 'Student created',
        description: `${student.name} has been added successfully.`,
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error creating student',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateStudent = async (id: string, updates: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setStudents(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: 'Student updated',
        description: 'Student information has been updated successfully.',
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error updating student',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStudents(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Student deleted',
        description: 'Student has been removed successfully.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error deleting student',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
