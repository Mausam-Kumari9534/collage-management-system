import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: ('admin' | 'student')[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/dashboard/students" element={<ProtectedRoute allowedRoles={['admin']}><Students /></ProtectedRoute>} />
    <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
    <Route path="/dashboard/my-courses" element={<ProtectedRoute allowedRoles={['student']}><MyCourses /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {

  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('courses').select('count', { count: 'exact', head: true });
        if (!error) {
          console.log("Supabase Connection Successful");
        } else {
          console.error("Supabase Connection Error:", error);
          toast({
            title: "Database Connection Issue",
            description: "Connected to server but encountered an error: " + error.message,
            variant: "destructive"
          });
        }
      } catch (err) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Supabase. Check your internet or .env keys.",
          variant: "destructive"
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
