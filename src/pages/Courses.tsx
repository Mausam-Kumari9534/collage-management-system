import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { CourseForm } from '@/components/dashboard/CourseForm';
import { CourseDetailsModal } from '@/components/dashboard/CourseDetailsModal';
import { useCourses, Course } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Courses = () => {
  const { courses, loading, createCourse, deleteCourse } = useCourses();
  const { enroll, isEnrolled, enrollments, unenroll } = useEnrollments();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getEnrollmentId = (courseId: string) => {
    return enrollments.find(e => e.course_id === courseId)?.id;
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? All content will be removed.')) {
      await deleteCourse(courseId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Courses</h1>
            <p className="text-muted-foreground mt-1">
              {role === 'admin' ? 'Manage courses' : 'Browse and enroll in courses'}
            </p>
          </div>
          {role === 'admin' && (
            <div className="flex gap-3">
              <Button onClick={() => setShowForm(true)} className="cyber-button">
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                isEnrolled={isEnrolled(course.id)}
                showActions={role === 'student'}
                showAdminActions={role === 'admin'}
                onEnroll={() => enroll(course.id)}
                onUnenroll={() => {
                  const enrollmentId = getEnrollmentId(course.id);
                  if (enrollmentId) unenroll(enrollmentId);
                }}
                onDelete={() => handleDeleteCourse(course.id)}
                onView={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <CourseForm
            onSubmit={async (data) => { await createCourse(data); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {selectedCourse && (
          <CourseDetailsModal
            isOpen={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
            course={selectedCourse}
            isAdmin={role === 'admin'}
          />
        )}
      </main>
    </div>
  );
};

export default Courses;
