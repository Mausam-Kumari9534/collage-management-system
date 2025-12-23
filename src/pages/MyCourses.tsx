import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { CourseDetailsModal } from '@/components/dashboard/CourseDetailsModal';
import { useEnrollments } from '@/hooks/useEnrollments';

const MyCourses = () => {
  const { enrollments, loading, unenroll } = useEnrollments();
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string; description?: string | null } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">My Courses</h1>
          <p className="text-muted-foreground mt-1">Your enrolled courses</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : enrollments.length === 0 ? (
          <div className="cyber-card text-center py-12">
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                id={enrollment.course_id}
                title={enrollment.course?.title || 'Unknown Course'}
                description={enrollment.course?.description}
                isEnrolled={true}
                onUnenroll={() => unenroll(enrollment.id)}
                onView={() => setSelectedCourse({
                  id: enrollment.course_id,
                  title: enrollment.course?.title || 'Unknown Course',
                  description: enrollment.course?.description,
                })}
              />
            ))}
          </div>
        )}

        {selectedCourse && (
          <CourseDetailsModal
            isOpen={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
            course={selectedCourse}
            isAdmin={false}
          />
        )}
      </main>
    </div>
  );
};

export default MyCourses;
