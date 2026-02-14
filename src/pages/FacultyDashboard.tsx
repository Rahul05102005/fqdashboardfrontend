import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import TrendChart from '@/components/dashboard/TrendChart';
import RadarMetrics from '@/components/dashboard/RadarMetrics';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import { useAuth } from '@/context/AuthContext';
import { mockFaculty, mockFeedbacks, mockMetrics, mockSemesterTrends } from '@/data/mockData';
import { Star, MessageSquare, TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getPerformanceBadge } from '@/data/mockData';
import { cn } from '@/lib/utils';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get current faculty data (mock: using first faculty member)
  const currentFaculty = mockFaculty.find(f => f.userId === user?.id) || mockFaculty[0];
  const currentMetrics = mockMetrics.find(m => m.facultyId === currentFaculty.id) || mockMetrics[0];
  const facultyFeedbacks = mockFeedbacks.filter(f => f.facultyId === currentFaculty.id);

  const performance = getPerformanceBadge(currentFaculty.averageRating);

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
    value: t.averageRating,
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
        {/* Welcome Header */}
        <div className="dashboard-card gradient-primary text-primary-foreground">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold">
                {currentFaculty.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold md:text-2xl">
                  Welcome, {currentFaculty.name.split(' ')[0]}!
                </h1>
                <p className="text-primary-foreground/80">
                  {currentFaculty.designation} • {currentFaculty.department}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{currentFaculty.averageRating.toFixed(1)}</p>
                <p className="text-sm text-primary-foreground/70">Overall Rating</p>
              </div>
              <Badge
                className={cn(
                  'px-4 py-1.5 text-sm',
                  performance.variant === 'success'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-warning/20 text-white border-warning/30'
                )}
              >
                {performance.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Average Rating"
            value={currentFaculty.averageRating.toFixed(1)}
            subtitle="Out of 5.0"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Total Feedbacks"
            value={currentFaculty.totalFeedbacks}
            subtitle="This academic year"
            icon={MessageSquare}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Quality Score"
            value={`${currentMetrics.overallScore}%`}
            subtitle="Institutional metric"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Courses"
            value={currentFaculty.coursesAssigned.length}
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
            feedbacks={facultyFeedbacks.length > 0 ? facultyFeedbacks : mockFeedbacks.slice(0, 3)}
            faculty={mockFaculty}
          />
          
          {/* Courses Card */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Assigned Courses</h3>
            <div className="space-y-3">
              {currentFaculty.coursesAssigned.map((courseCode) => (
                <div
                  key={courseCode}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {courseCode}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Course {courseCode}</p>
                      <p className="text-xs text-muted-foreground">Semester 1</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
