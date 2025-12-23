import { Navigate, Outlet } from 'react-router-dom';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';

export const RequireProfile = () => {
    const { role } = useAuth();
    const { hasProfile, loading } = useStudentProfile();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary animate-pulse">Checking enrollment status...</div>
            </div>
        );
    }

    // Admins don't need a student profile to view student pages (though usually they view admin pages)
    if (role === 'admin') {
        return <Outlet />;
    }

    if (hasProfile === false) {
        return <Navigate to="/dashboard/enrollment" replace />;
    }

    return <Outlet />;
};
