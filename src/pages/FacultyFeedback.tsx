import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import { useAuth } from '@/context/AuthContext';
import { mockFaculty, monthlyCategoryAverages } from '@/data/mockData';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
import { MessageSquare, Star, Calendar, ThumbsUp, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

const MONTHS_2024 = [
  'January 2024', 'February 2024', 'March 2024', 'April 2024',
  'May 2024', 'June 2024', 'July 2024', 'August 2024',
  'September 2024', 'October 2024', 'November 2024', 'December 2024',
];

const FacultyFeedback: React.FC = () => {
  const { user } = useAuth();
  const { feedbacks: allFeedbacks } = useFeedbackStore();
  const currentFaculty = mockFaculty.find(f => f.userId === user?.id) || mockFaculty[0];
  const [selectedMonth, setSelectedMonth] = useState('December 2024');

  // Parse selected month to filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    const [monthName, year] = selectedMonth.split(' ');
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const yearNum = parseInt(year);

    const facultyFeedbacks = allFeedbacks.filter(f => f.facultyId === currentFaculty.id);
    const feedbacksToFilter = facultyFeedbacks.length > 0 ? facultyFeedbacks : allFeedbacks;

    return feedbacksToFilter.filter(f => {
      const d = new Date(f.submittedAt);
      return d.getMonth() === monthIndex && d.getFullYear() === yearNum;
    });
  }, [selectedMonth, currentFaculty.id, allFeedbacks]);

  // Use all faculty feedbacks if filtered returns empty for stats display
  const allFacultyFeedbacks = useMemo(() => {
    const fb = allFeedbacks.filter(f => f.facultyId === currentFaculty.id);
    return fb.length > 0 ? fb : allFeedbacks;
  }, [currentFaculty.id, allFeedbacks]);

  const displayFeedbacks = filteredFeedbacks.length > 0 ? filteredFeedbacks : allFacultyFeedbacks;

  // Get category averages for selected month
  const categoryAverages = monthlyCategoryAverages[selectedMonth] || {
    teachingEffectiveness: 4.7,
    subjectKnowledge: 4.9,
    communication: 4.5,
    punctuality: 4.8,
    courseContent: 4.6,
    studentEngagement: 4.4,
    assessmentFairness: 4.5,
    overallSatisfaction: 4.6,
  };

  // Calculate dynamic stats based on month
  const feedbackCount = filteredFeedbacks.length;
  const avgRating = useMemo(() => {
    const vals = Object.values(categoryAverages);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [categoryAverages]);

  const positivePct = useMemo(() => {
    const aboveFour = Object.values(categoryAverages).filter(v => v >= 4.0).length;
    return Math.round((aboveFour / Object.values(categoryAverages).length) * 100);
  }, [categoryAverages]);

  const improvementAreas = useMemo(() => {
    return Object.values(categoryAverages).filter(v => v < 4.5).length;
  }, [categoryAverages]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">
              My Feedback
            </h1>
            <p className="text-muted-foreground">
              View and analyze student feedback on your courses
            </p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS_2024.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Feedbacks"
            value={feedbackCount > 0 ? feedbackCount : currentFaculty.totalFeedbacks}
            subtitle={feedbackCount > 0 ? selectedMonth : 'All time'}
            icon={MessageSquare}
          />
          <StatCard
            title="Average Rating"
            value={avgRating}
            subtitle="Out of 5.0"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Positive Feedback"
            value={`${positivePct}%`}
            subtitle="Rating 4+ stars"
            icon={ThumbsUp}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Improvement Areas"
            value={improvementAreas}
            subtitle="Categories below 4.5"
            icon={TrendingUp}
          />
        </div>

        {/* Category Breakdown */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Category Ratings — {selectedMonth}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(categoryAverages).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{value.toFixed(1)}</span>
                    <Badge variant={value >= 4.5 ? 'default' : 'secondary'} className="text-xs">
                      {value >= 4.5 ? 'Excellent' : value >= 4.0 ? 'Good' : 'Average'}
                    </Badge>
                  </div>
                </div>
                <Progress value={value * 20} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <RecentFeedback
          feedbacks={displayFeedbacks}
          faculty={mockFaculty}
        />
      </div>
    </DashboardLayout>
  );
};

export default FacultyFeedback;
