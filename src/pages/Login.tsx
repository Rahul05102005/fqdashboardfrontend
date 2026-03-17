import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      const success = await signup({ email, password, name, role });
      if (success) {
        toast.success('Account created!', { description: 'You are now logged in.' });
        const redirectPath = role === 'admin' ? '/admin' : role === 'student' ? '/student' : '/faculty';
        navigate(redirectPath);
      } else {
        setError('Signup failed. Email may already be in use.');
        toast.error('Signup failed');
      }
    } else {
      const success = await login({ email, password });
      if (success) {
        toast.success('Welcome back!', { description: 'You have successfully logged in.' });
        // Wait briefly for auth state to resolve, then redirect
        setTimeout(async () => {
          const { useAuth: _ } = await import('@/context/AuthContext');
          // Simple redirect based on stored profile
          const storedSession = await (await import('@/integrations/supabase/client')).supabase.auth.getUser();
          if (storedSession.data.user) {
            const { data: profile } = await (await import('@/integrations/supabase/client')).supabase
              .from('profiles')
              .select('role')
              .eq('id', storedSession.data.user.id)
              .single();
            if (profile) {
              const r = profile.role as UserRole;
              navigate(r === 'admin' ? '/admin' : r === 'student' ? '/student' : '/faculty');
            }
          }
        }, 500);
      } else {
        setError('Invalid email or password');
        toast.error('Login failed', { description: 'Please check your credentials and try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTYgMGgtNnY2aDZ2LTZ6bTAgMHYtNmgtNnY2aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">Faculty IQ</h1>
              <p className="text-white/70">Instructional Quality Dashboard</p>
            </div>
          </div>
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight">
              Elevate Teaching Excellence
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Comprehensive analytics platform for evaluating, analyzing, and visualizing
              faculty teaching performance. Make data-driven decisions to enhance academic quality.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-sm text-white/70">Faculty Members</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-white/70">Feedbacks Analyzed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login/Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Faculty IQ</h1>
              <p className="text-xs text-muted-foreground">Quality Dashboard</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isSignUp ? 'Sign up to access your dashboard' : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : isSignUp ? (
                <span className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Sign up</span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
