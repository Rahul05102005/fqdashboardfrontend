import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import { useAuth } from '@/context/AuthContext';
import { mockFaculty, mockFeedbacks } from '@/data/mockData';
import { MessageSquare, Star, Calendar, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
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

const FacultyFeedback: React.FC = () => {
  const { user } = useAuth();
  const currentFaculty = mockFaculty.find(f => f.userId === user?.id) || mockFaculty[0];
  const facultyFeedbacks = mockFeedbacks.filter(f => f.facultyId === currentFaculty.id);

  // If no specific feedbacks, use sample
  const displayFeedbacks = facultyFeedbacks.length > 0 ? facultyFeedbacks : mockFeedbacks;

  // Calculate category averages
  const categoryAverages = {
    teachingEffectiveness: 4.7,
    subjectKnowledge: 4.9,
    communication: 4.5,
    punctuality: 4.8,
    courseContent: 4.6,
    studentEngagement: 4.4,
    assessmentFairness: 4.5,
    overallSatisfaction: 4.6,
  };

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
          <Select defaultValue="Fall 2024">
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fall 2024">Fall 2024</SelectItem>
              <SelectItem value="Spring 2024">Spring 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Feedbacks"
            value={currentFaculty.totalFeedbacks}
            subtitle="All time"
            icon={MessageSquare}
          />
          <StatCard
            title="Average Rating"
            value={currentFaculty.averageRating.toFixed(1)}
            subtitle="Out of 5.0"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Positive Feedback"
            value="87%"
            subtitle="Rating 4+ stars"
            icon={ThumbsUp}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Improvement Areas"
            value="2"
            subtitle="Categories below 4.5"
            icon={TrendingUp}
          />
        </div>

        {/* Category Breakdown */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Category Ratings</h3>
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
