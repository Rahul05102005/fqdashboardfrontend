import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/faculty', icon: Users, label: 'Faculty Management' },
    { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback Analysis' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const facultyNavItems = [
    { path: '/faculty', icon: LayoutDashboard, label: 'My Dashboard' },
    { path: '/faculty/feedback', icon: MessageSquare, label: 'My Feedback' },
    { path: '/faculty/metrics', icon: BarChart3, label: 'Performance Metrics' },
  ];

  const studentNavItems = [
    { path: '/student', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/feedback', icon: MessageSquare, label: 'Give Feedback' },
  ];

  const navItems = hasRole('admin') ? adminNavItems : hasRole('student') ? studentNavItems : facultyNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:block border-r border-border shrink-0">
        <div className="flex h-full flex-col bg-card">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Faculty IQ</h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Quality Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card in Sidebar */}
          <div className="p-4 mt-auto border-t border-border bg-muted/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-bold text-foreground uppercase tracking-tight">{user?.name}</p>
                <Badge variant="outline" className="text-[9px] h-4 px-1 capitalize bg-background">{user?.role}</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Desktop Top Header */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-8 lg:flex">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {navItems.find(item => item.path === location.pathname)?.label || location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{user?.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-border overflow-hidden ring-offset-background hover:ring-2 hover:ring-primary/20 transition-all">
                  <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary text-sm font-bold">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Faculty IQ</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-background lg:hidden animate-in fade-in slide-in-from-top-1 px-4 py-8">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
