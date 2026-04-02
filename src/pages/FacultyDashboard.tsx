import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import TrendChart from '@/components/dashboard/TrendChart';
import RadarMetrics from '@/components/dashboard/RadarMetrics';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import { useAuth } from '@/context/AuthContext';
import { mockMetrics, mockSemesterTrends } from '@/data/mockData';
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
import { Star, MessageSquare, TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getPerformanceBadge } from '@/data/mockData';
import { cn } from '@/lib/utils';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { feedbacks: allFeedbacks } = useFeedbackStore();
  const { faculty: allFaculty } = useFacultyWithFeedback();
  
  // Get current faculty data (mock: using first faculty member)
  const currentFaculty = allFaculty.find(f => f.userId === user?.id) || allFaculty[0];
  const currentMetrics = mockMetrics.find(m => m.facultyId === currentFaculty?.id) || mockMetrics[0];
  const facultyFeedbacks = allFeedbacks.filter(f => {
    const fid = typeof f.facultyId === 'object' ? (f.facultyId as any)._id || (f.facultyId as any).id : f.facultyId;
    return fid === currentFaculty?.id || fid === currentFaculty?._id;
  });

  const performance = getPerformanceBadge(currentFaculty?.averageRating);

  // Prepare radar chart data
  const radarData = [
    { subject: 'Teaching', score: currentMetrics.teachingQualityScore, fullMark: 100 },
    { subject: 'Research', score: currentMetrics.researchContribution, fullMark: 100 },
    { subject: 'Syllabus', score: currentMetrics.syllabusCompletion, fullMark: 100 },
    { subject: 'Attendance', score: currentMetrics.attendanceCompliance, fullMark: 100 },
    { subject: 'Pass Rate', score: currentMetrics.studentPassRate, fullMark: 100 },
    { subject: 'Innovation', score: currentMetrics.innovativeTeaching, fullMark: 100 },
  ];

  // Prepare trend data
  const trendData = mockSemesterTrends.map(t => ({
    name: t.semester.split(' ')[0] + "'" + t.semester.split(' ')[1].slice(2),
    value: t?.averageRating,
  }));

  const metricsBreakdown = [
    { label: 'Teaching Quality', value: currentMetrics.teachingQualityScore, icon: BookOpen },
    { label: 'Research Contribution', value: currentMetrics.researchContribution, icon: Award },
    { label: 'Syllabus Completion', value: currentMetrics.syllabusCompletion, icon: Target },
    { label: 'Student Pass Rate', value: currentMetrics.studentPassRate, icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Faculty Profile Showcase */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border text-center h-full justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-2xl font-bold text-primary mb-4 border border-primary/20">
                {currentFaculty?.name ? currentFaculty.name.split(' ').map(n => n[0]).join('') : user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-foreground">{currentFaculty?.name || user?.name}</h2>
              <p className="text-sm text-primary font-medium">{currentFaculty?.designation || 'Faculty Member'}</p>
              <Badge variant="outline" className="mt-2 bg-primary/5">{currentFaculty?.department || 'General'}</Badge>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-card rounded-2xl border border-border p-6 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Welcome Back, Professor</h1>
                <p className="text-muted-foreground">Keep track of your instructional quality and student feedback engagement.</p>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-border">
                <div className="text-center px-4 border-r border-border">
                  <p className="text-xl font-bold text-foreground">{currentFaculty?.averageRating.toFixed(1)}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Avg Rating</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-xl font-bold text-foreground">{performance?.label}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Performance</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Qualification</p>
                <p className="text-sm font-medium">{currentFaculty?.qualification || 'PhD Computer Science'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Experience</p>
                <p className="text-sm font-medium">{currentFaculty?.experience || '12'} Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Specialization</p>
                <p className="text-sm font-medium truncate">{currentFaculty?.specialization[0] || 'AI / ML'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Status</p>
                <div className="flex items-center gap-1.5 capitalize text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  {currentFaculty?.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Average Rating"
            value={currentFaculty?.averageRating.toFixed(1)}
            subtitle="Out of 5.0"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Total Feedbacks"
            value={currentFaculty?.totalFeedbacks}
            subtitle="This academic year"
            icon={MessageSquare}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Quality Score"
            value={`${currentMetrics?.overallScore}%`}
            subtitle="Institutional metric"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Courses"
            value={currentFaculty?.coursesAssigned?.length}
            subtitle="Currently assigned"
            icon={BookOpen}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RadarMetrics
            data={radarData}
            title="Performance Metrics"
            subtitle="Comprehensive evaluation scores"
          />
          <TrendChart
            data={trendData}
            title="Rating History"
            subtitle="Your performance over semesters"
          />
        </div>

        {/* Metrics Breakdown */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {metricsBreakdown.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <metric.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{metric.label}</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentFeedback
            feedbacks={facultyFeedbacks.length > 0 ? facultyFeedbacks : allFeedbacks.slice(0, 3)}
            faculty={allFaculty}
          />
          
          {/* Courses Card */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Assigned Courses</h3>
            <div className="space-y-3">
              {currentFaculty?.coursesAssigned?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No courses assigned yet</p>
              ) : (
                currentFaculty?.coursesAssigned?.map((course: any, ind) => {
                  const isPopulated = typeof course === 'object' && course !== null;
                  const code = isPopulated ? course.code : (typeof course === 'string' ? '...' : 'Unknown');
                  const name = isPopulated ? course.name : (typeof course === 'string' ? `Course ${ind + 1}` : 'Unknown');
                  const semester = isPopulated ? `Semester ${course.semester || 1}` : 'Semester 1';

                  return (
                    <div
                      key={isPopulated ? (course._id || course.id) : (course + ind)}
                      className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-muted/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col min-w-0">
                          <p className="font-semibold text-foreground truncate">{name}</p>
                          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                            <span className="text-primary">{code}</span>
                            <span className="opacity-50">|</span>
                            <span>{semester}</span>
                          </p>
                        </div>

                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20 hover:bg-success/20">Active</Badge>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
