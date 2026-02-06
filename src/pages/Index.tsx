import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Award,
} from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Comprehensive dashboards with real-time metrics and trend analysis.',
    },
    {
      icon: MessageSquare,
      title: 'Feedback Management',
      description: 'Collect and analyze student feedback with detailed category breakdowns.',
    },
    {
      icon: Users,
      title: 'Faculty Management',
      description: 'Complete faculty profiles with qualifications and course assignments.',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure authentication with Admin and Faculty role separation.',
    },
    {
      icon: TrendingUp,
      title: 'Trend Tracking',
      description: 'Semester-wise performance trends and historical comparisons.',
    },
    {
      icon: Award,
      title: 'Quality Metrics',
      description: 'Instructional quality scoring across multiple evaluation dimensions.',
    },
  ];

  const stats = [
    { value: '50+', label: 'Faculty Members' },
    { value: '10K+', label: 'Feedbacks Analyzed' },
    { value: '4.5', label: 'Avg. Rating' },
    { value: '12', label: 'Departments' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-serif font-bold text-foreground">Faculty IQ</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Quality Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTYgMGgtNnY2aDZ2LTZ6bTAgMHYtNmgtNnY2aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative container py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <Star className="h-4 w-4 fill-warning text-warning" />
              Trusted by leading academic institutions
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-white leading-tight sm:text-5xl lg:text-6xl animate-fade-in">
              Elevate Teaching Excellence with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Data-Driven Insights
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto animate-slide-up">
              A comprehensive analytics platform for evaluating, analyzing, and visualizing 
              faculty teaching performance. Make data-driven decisions to enhance academic quality.
            </p>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center"
              >
                <p className="text-3xl font-bold text-white lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Everything You Need for Academic Excellence
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive tools to evaluate, track, and improve teaching quality across your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:border-primary/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Ready to Transform Your Institution?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join leading universities in making data-driven decisions for academic excellence.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-serif font-semibold text-foreground">Faculty IQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Faculty Instructional Quality Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
