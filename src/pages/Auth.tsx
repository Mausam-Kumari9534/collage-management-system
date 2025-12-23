import { CyberScene } from '@/components/three/CyberScene';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen relative">
      <CyberScene />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
