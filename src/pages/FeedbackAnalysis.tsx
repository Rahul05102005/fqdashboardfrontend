import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockFaculty, mockFeedbacks, mockCourses } from '@/data/mockData';
import { Feedback } from '@/types';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import { MessageSquare, Star, TrendingUp, Filter, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import StatCard from '@/components/dashboard/StatCard';

const FeedbackAnalysis: React.FC = () => {
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate overall stats
  const totalFeedbacks = mockFeedbacks.length;
  const avgRating = (mockFeedbacks.reduce((acc, f) => {
    const ratings = Object.values(f.ratings);
    return acc + ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }, 0) / totalFeedbacks).toFixed(2);

  // Prepare chart data
  const facultyRatings = mockFaculty.map(f => ({
    name: f.name.split(' ').slice(-1)[0],
    rating: f.averageRating,
  }));

  const categoryRatings = [
    { name: 'Teaching', value: 4.6 },
    { name: 'Knowledge', value: 4.8 },
    { name: 'Communication', value: 4.5 },
    { name: 'Punctuality', value: 4.7 },
    { name: 'Content', value: 4.4 },
    { name: 'Engagement', value: 4.3 },
  ];

  const filteredFeedbacks = mockFeedbacks.filter(f => {
    const matchesSemester = semesterFilter === 'all' || f.semester === semesterFilter;
    const matchesFaculty = facultyFilter === 'all' || f.facultyId === facultyFilter;
    const faculty = mockFaculty.find(fac => fac.id === f.facultyId);
    const matchesSearch = !searchQuery || 
      faculty?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.comments?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSemester && matchesFaculty && matchesSearch;
  });

  const getFacultyName = (facultyId: string) => {
    return mockFaculty.find(f => f.id === facultyId)?.name || 'Unknown';
  };

  const getAverageRating = (ratings: Feedback['ratings']) => {
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">
            Feedback Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze student feedback and identify trends
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Feedbacks"
            value={totalFeedbacks}
            subtitle="This semester"
            icon={MessageSquare}
          />
          <StatCard
            title="Average Rating"
            value={avgRating}
            subtitle="Across all categories"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Response Rate"
            value="78%"
            subtitle="Student participation"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PerformanceChart
            data={facultyRatings}
            title="Faculty Ratings Comparison"
            subtitle="Average rating per faculty member"
          />
          <TrendChart
            data={categoryRatings}
            title="Category-wise Ratings"
            subtitle="Average scores by feedback category"
          />
        </div>

        {/* Filters */}
        <div className="dashboard-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search feedbacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculty</SelectItem>
                  {mockFaculty.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-foreground">
            Recent Feedbacks ({filteredFeedbacks.length})
          </h2>
          <div className="grid gap-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="dashboard-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">
                        {getFacultyName(feedback.facultyId)}
                      </span>
                      <Badge variant="outline">{feedback.courseId}</Badge>
                      <Badge variant="secondary">{feedback.semester}</Badge>
                    </div>
                    {feedback.comments && (
                      <p className="text-muted-foreground">"{feedback.comments}"</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted on {format(new Date(feedback.submittedAt), 'MMM dd, yyyy')}
                      {feedback.isAnonymous && ' • Anonymous'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold text-foreground">
                      {getAverageRating(feedback.ratings)}
                    </span>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(feedback.ratings).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="text-center rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="font-semibold text-foreground">{value.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysis;
