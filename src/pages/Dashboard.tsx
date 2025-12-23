import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { role } = useAuth();
  const { students } = useStudents();
  const { courses } = useCourses();
  const { enrollments } = useEnrollments();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to NEXUS Student Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {role === 'admin' && (
            <StatsCard
              title="Total Students"
              value={students.length}
              icon={Users}
              color="cyan"
              trend="Managed records"
            />
          )}
          <StatsCard
            title="Available Courses"
            value={courses.length}
            icon={BookOpen}
            color="magenta"
            trend="Active courses"
          />
          {role === 'student' && (
            <StatsCard
              title="My Enrollments"
              value={enrollments.length}
              icon={GraduationCap}
              color="purple"
              trend="Courses enrolled"
            />
          )}
          <StatsCard
            title="System Status"
            value="Online"
            icon={TrendingUp}
            color="green"
            trend="All systems operational"
          />
        </div>

        <div className="mt-8 cyber-card">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">
            {role === 'admin' 
              ? 'Navigate to Students or Courses to manage records.'
              : 'Browse Courses to enroll or view My Courses for your enrollments.'}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
