import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { User, Lock, Mail, Shield, GraduationCap, Key } from 'lucide-react';

const ADMIN_SECRET_PASSWORD = 'Mausam@9534';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'student']),
  adminPassword: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'admin' | 'student',
    adminPassword: '',
  });

  const { signUp, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
          setError(result.error.errors[0].message);
          setLoading(false);
          return;
        }

        // Check admin password if trying to sign up as admin
        if (formData.role === 'admin') {
          if (!formData.adminPassword) {
            setError('Admin secret password is required');
            setLoading(false);
            return;
          }
          if (formData.adminPassword !== ADMIN_SECRET_PASSWORD) {
            setError('Invalid admin secret password');
            setLoading(false);
            return;
          }
        }

        const { error } = await signUp(formData.email, formData.password, formData.name, formData.role);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(error.message);
          }
        } else {
          // Account created successfully
          await signOut(); // Prevent auto-login
          setIsSignUp(false);
          setSuccessMessage('Account created successfully! Please sign in with your credentials.');
          setFormData(prev => ({ ...prev, password: '', adminPassword: '' }));
        }
      } else {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
          setError(result.error.errors[0].message);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            setError('Invalid email or password.');
          } else {
            setError(error.message);
          }
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="cyber-card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gradient mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp ? 'Join the Student Management System' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
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
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="cyber-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="cyber-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-3">
                <Label className="text-foreground">Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student', adminPassword: '' })}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'student'
                      ? 'border-primary bg-primary/10 glow-cyan'
                      : 'border-border bg-muted/50 hover:border-primary/50'
                      }`}
                  >
                    <GraduationCap className={`w-6 h-6 ${formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'admin'
                      ? 'border-accent bg-accent/10 glow-magenta'
                      : 'border-border bg-muted/50 hover:border-accent/50'
                      }`}
                  >
                    <Shield className={`w-6 h-6 ${formData.role === 'admin' ? 'text-accent' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${formData.role === 'admin' ? 'text-accent' : 'text-muted-foreground'}`}>
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              {formData.role === 'admin' && (
                <div className="space-y-2 animate-slide-up">
                  <Label htmlFor="adminPassword" className="text-foreground flex items-center gap-2">
                    <Key className="w-4 h-4 text-accent" />
                    Admin Secret Password
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="cyber-input border-accent/50 focus:border-accent"
                    placeholder="Enter admin secret password"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact system administrator for the secret password
                  </p>
                </div>
              )}
            </>
          )}


          {successMessage && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="cyber-button w-full"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccessMessage(null);
              setFormData({ ...formData, adminPassword: '' });
            }}
            className="text-primary hover:text-primary/80 transition-colors text-sm"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
