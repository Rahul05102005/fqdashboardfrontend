import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, user, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === 'admin' ? '/admin' : user.role === 'student' ? '/student' : '/faculty';
      navigate(path);
    }
  }, [isAuthenticated, user, navigate]);

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
        toast.success('Account created!');
      } else {
        setError('Signup failed. Email may already be in use.');
      }
    } else {
      const success = await login({ email, password, role });
      if (success) {
        toast.success(`Welcome back, ${role}!`);
      } else {
        setError(`Invalid credentials or incorrect role selected.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTYgMGgtNnY2aDZ2LTZ6bTAgMHYtNmgtNnY2aDZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
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
          </div>
        </div>
      </div>

      {/* Right Panel - Login/Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground">
              {isSignUp ? 'Join Faculty IQ' : 'Academic Portal'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isSignUp ? 'Create your account to get started' : 'Sign in to access your research and metrics'}
            </p>
          </div>

          <div className="space-y-6">
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1">
                <TabsTrigger value="student" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Student</TabsTrigger>
                <TabsTrigger value="faculty" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Faculty</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-slide-up">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Dr. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold mt-2" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connecting...
                  </div>
                ) : isSignUp ? (
                  <span className="flex items-center gap-2 tracking-wide"><UserPlus className="h-5 w-5" /> Sign up as {role}</span>
                ) : (
                  <span className="flex items-center gap-2 tracking-wide"><LogIn className="h-5 w-5" /> Sign in as {role}</span>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an academic account? Register now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
