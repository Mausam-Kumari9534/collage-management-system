import { useNavigate } from 'react-router-dom';
// HMR Trigger
import { CyberScene } from '@/components/three/CyberScene';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { GraduationCap, Shield, Zap } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <CyberScene />
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex-grow flex flex-col items-center justify-center p-8 min-h-screen">
                    <div className="text-center max-w-3xl mx-auto animate-slide-up">
                        <h1 className="text-6xl md:text-7xl font-display font-bold text-gradient mb-6">
                            NEXUS
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Next-Generation Student Management System with Role-Based Access Control
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-sm text-primary">Secure RBAC</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                                <GraduationCap className="w-4 h-4 text-accent" />
                                <span className="text-sm text-accent">Course Enrollment</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
                                <Zap className="w-4 h-4 text-secondary" />
                                <span className="text-sm text-secondary">Real-time Updates</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/auth')}
                            className="cyber-button text-lg px-10 py-4"
                            data-id="hero-get-started"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Index;
