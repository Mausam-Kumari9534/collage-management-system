import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Calendar } from 'lucide-react';
import { CyberScene } from '@/components/three/CyberScene';

const StudentEnrollment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        city: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('students').insert({
                name: formData.name,
                age: parseInt(formData.age),
                city: formData.city,
                user_id: user.id,
            });

            if (error) throw error;

            toast({
                title: "Enrollment Successful",
                description: "Your student profile has been created.",
            });

            navigate('/dashboard/courses');

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <CyberScene />
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="cyber-card">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold text-gradient mb-2">
                                Student Enrollment
                            </h2>
                            <p className="text-muted-foreground">
                                Please complete your profile to access courses
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="cyber-input"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Age
                                </Label>
                                <Input
                                    id="age"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="cyber-input"
                                    placeholder="Enter your age"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="cyber-input"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="cyber-button w-full"
                            >
                                {loading ? 'Submitting...' : 'Complete Enrollment'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentEnrollment;
