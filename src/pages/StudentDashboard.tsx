import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Users, Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { faculty } = useFacultyWithFeedback();
  const { feedbacks } = useFeedbackStore();

  const myFeedbacks = feedbacks.filter(f => f.submittedAt && !f.isAnonymous) ;
  const totalFacultyCount = faculty.length;
  const totalFeedbacksGiven = feedbacks.filter(fb => fb.id.startsWith('student_')).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Student Profile Showcase */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Welcome, {user?.name}</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
                  <Badge variant="outline" className="bg-background">Computer Science Department</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Academic Year</p>
                <p className="text-sm font-semibold">2024-2025</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Feedback Status</p>
                <p className="text-sm font-semibold text-success flex items-center gap-1 justify-center md:justify-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalFacultyCount}</p>
                <p className="text-sm text-muted-foreground">Total Faculty</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10">
                <MessageSquare className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalFeedbacksGiven}</p>
                <p className="text-sm text-muted-foreground">Feedbacks Given</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10">
                <Star className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {faculty.length > 0 ? (faculty.reduce((s, f) => s + f.averageRating, 0) / faculty.length).toFixed(1) : '0'}
                </p>
                <p className="text-sm text-muted-foreground">Avg Faculty Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
                <BookOpen className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{new Set(faculty.map(f => f.department)).size}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty list overview */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faculty.filter(f => f.status === 'active').map(f => (
                <div key={f.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {f.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{f.name}</p>
                      <p className="text-sm text-muted-foreground">{f.department} — {f.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-chart-5 fill-chart-5" />
                    <span className="font-medium text-foreground">{f.averageRating.toFixed(1)}</span>
                    <Badge variant="secondary" className="ml-2">{f.totalFeedbacks} reviews</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
