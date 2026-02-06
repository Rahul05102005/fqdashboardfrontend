import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login({ email, password });
    
    if (success) {
      toast.success('Welcome back!', {
        description: 'You have successfully logged in.',
      });
      // Redirect based on role (handled by ProtectedRoute)
      const storedUser = localStorage.getItem('dashboard_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'admin' ? '/admin' : '/faculty');
      }
    } else {
      setError('Invalid email or password');
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
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

      {/* Right Panel - Login Form */}
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
            <h2 className="text-2xl font-serif font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
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
                  autoComplete="current-password"
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

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Admin:</span> admin@university.edu / admin123</p>
              <p><span className="font-medium">Faculty:</span> faculty@university.edu / faculty123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
