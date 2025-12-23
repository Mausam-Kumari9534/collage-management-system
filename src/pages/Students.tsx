import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DataTable } from '@/components/dashboard/DataTable';
import { StudentForm } from '@/components/dashboard/StudentForm';
import { useStudents, Student } from '@/hooks/useStudents';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Students = () => {
  const { students, loading, createStudent, updateStudent, deleteStudent } = useStudents();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'city', header: 'City' },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: Student) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setEditingStudent(student)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteStudent(student.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student records</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="cyber-button">
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </div>

        <div className="cyber-card">
          <DataTable data={students} columns={columns} loading={loading} emptyMessage="No students found" />
        </div>

        {(showForm || editingStudent) && (
          <StudentForm
            initialData={editingStudent || undefined}
            isEdit={!!editingStudent}
            onSubmit={async (data) => {
              if (editingStudent) {
                await updateStudent(editingStudent.id, data);
              } else {
                await createStudent(data);
              }
              setShowForm(false);
              setEditingStudent(null);
            }}
            onCancel={() => { setShowForm(false); setEditingStudent(null); }}
          />
        )}
      </main>
    </div>
  );
};

export default Students;
