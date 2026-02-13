import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import DepartmentPieChart from '@/components/dashboard/DepartmentPieChart';
import FacultyTable from '@/components/dashboard/FacultyTable';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import {
  mockFaculty,
  mockFeedbacks,
  mockDepartmentStatsByYear,
  mockSemesterTrendsByYear,
  yearQualityScores,
  yearQualityTrends,
} from '@/data/mockData';
import { Users, MessageSquare, Star, TrendingUp, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [academicYear, setAcademicYear] = useState('2024-25');

  // Filter feedbacks by academic year
  const yearFeedbacks = useMemo(() => {
    return mockFeedbacks.filter(f => f.academicYear === academicYear);
  }, [academicYear]);

  // Get year-specific department stats and trends
  const departmentStats = mockDepartmentStatsByYear[academicYear] || mockDepartmentStatsByYear['2024-25'];
  const semesterTrends = mockSemesterTrendsByYear[academicYear] || mockSemesterTrendsByYear['2024-25'];
  const qualityScore = yearQualityScores[academicYear] || '89%';
  const qualityTrend = yearQualityTrends[academicYear] || { value: 5, isPositive: true };

  // Calculate statistics based on year-filtered feedbacks
  const totalFaculty = mockFaculty.length;
  const activeFaculty = mockFaculty.filter(f => f.status === 'active').length;
  const totalFeedbacks = yearFeedbacks.length > 0
    ? yearFeedbacks.length
    : mockFaculty.reduce((acc, f) => acc + f.totalFeedbacks, 0);

  const averageRating = useMemo(() => {
    if (yearFeedbacks.length === 0) {
      return (mockFaculty.reduce((acc, f) => acc + f.averageRating, 0) / totalFaculty).toFixed(2);
    }
    const avgPerFeedback = yearFeedbacks.map(f => {
      const vals = Object.values(f.ratings);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    return (avgPerFeedback.reduce((a, b) => a + b, 0) / avgPerFeedback.length).toFixed(2);
  }, [yearFeedbacks, totalFaculty]);

  const feedbackTrend = useMemo(() => {
    if (academicYear === '2024-25') return { value: 12, isPositive: true };
    if (academicYear === '2023-24') return { value: 6, isPositive: true };
    return { value: -3, isPositive: false };
  }, [academicYear]);

  // Filter faculty
  const filteredFaculty = useMemo(() => {
    return mockFaculty.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || f.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, departmentFilter]);

  // Prepare chart data from year-specific stats
  const departmentChartData = departmentStats.map(d => ({
    name: d.department.split(' ')[0],
    rating: d.averageRating,
  }));

  const trendChartData = semesterTrends.map(t => ({
    name: t.semester.split(' ')[0] + "'" + t.semester.split(' ')[1].slice(2),
    value: t.averageRating,
    value2: t.qualityScore / 20,
  }));

  const departments = [...new Set(mockFaculty.map(f => f.department))];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of faculty instructional quality metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Academic Year:</span>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Faculty"
            value={totalFaculty}
            subtitle={`${activeFaculty} active`}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Total Feedbacks"
            value={totalFeedbacks.toLocaleString()}
            subtitle={`Academic Year ${academicYear}`}
            icon={MessageSquare}
            trend={feedbackTrend}
          />
          <StatCard
            title="Average Rating"
            value={averageRating}
            subtitle="Out of 5.0"
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Quality Score"
            value={qualityScore}
            subtitle="Institutional average"
            icon={TrendingUp}
            trend={qualityTrend}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PerformanceChart
            data={departmentChartData}
            title="Department-wise Performance"
            subtitle={`Average rating by department (${academicYear})`}
          />
          <TrendChart
            data={trendChartData}
            title="Rating Trends"
            subtitle={`Semester-wise performance trends (${academicYear})`}
            dataKey="value"
            dataKey2="value2"
          />
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DepartmentPieChart
            data={departmentStats}
            title="Faculty Distribution"
            subtitle={`By department (${academicYear})`}
          />
          <RecentFeedback
            feedbacks={yearFeedbacks.length > 0 ? yearFeedbacks : mockFeedbacks}
            faculty={mockFaculty}
            className="lg:col-span-2"
          />
        </div>

        {/* Faculty Table */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              Faculty Overview
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <FacultyTable
            faculty={filteredFaculty}
            onView={(f) => console.log('View:', f)}
            onEdit={(f) => console.log('Edit:', f)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
