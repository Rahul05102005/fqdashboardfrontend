import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RadarMetrics from '@/components/dashboard/RadarMetrics';
import TrendChart from '@/components/dashboard/TrendChart';
import { useAuth } from '@/context/AuthContext';
import { mockMetrics, mockSemesterTrends } from '@/data/mockData';
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';
import { Award, Target, TrendingUp, BookOpen, Users, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

const FacultyMetrics: React.FC = () => {
  const { user } = useAuth();
  const { faculty } = useFacultyWithFeedback();
  const currentFaculty = faculty.find(f => f.userId === user?.id) || faculty[0];
  const currentMetrics = mockMetrics[0]; // metrics still from mock for now
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');

  const radarData = [
    { subject: 'Teaching', score: currentMetrics.teachingQualityScore, fullMark: 100 },
    { subject: 'Research', score: currentMetrics.researchContribution, fullMark: 100 },
    { subject: 'Syllabus', score: currentMetrics.syllabusCompletion, fullMark: 100 },
    { subject: 'Attendance', score: currentMetrics.attendanceCompliance, fullMark: 100 },
    { subject: 'Pass Rate', score: currentMetrics.studentPassRate, fullMark: 100 },
    { subject: 'Innovation', score: currentMetrics.innovativeTeaching, fullMark: 100 },
  ];

  const trendData = mockSemesterTrends.map(t => ({
    name: t.semester,
    value: t.qualityScore,
  }));

  const detailedMetrics = [
    { icon: BookOpen, label: 'Teaching Quality', value: currentMetrics.teachingQualityScore, description: 'Based on student feedback and peer evaluations' },
    { icon: Award, label: 'Research Contribution', value: currentMetrics.researchContribution, description: 'Publications, grants, and academic contributions' },
    { icon: Target, label: 'Syllabus Completion', value: currentMetrics.syllabusCompletion, description: 'Percentage of planned curriculum covered' },
    { icon: Clock, label: 'Attendance Compliance', value: currentMetrics.attendanceCompliance, description: 'Regular presence and punctuality record' },
    { icon: Users, label: 'Student Pass Rate', value: currentMetrics.studentPassRate, description: 'Percentage of students passing the course' },
    { icon: TrendingUp, label: 'Innovative Teaching', value: currentMetrics.innovativeTeaching, description: 'Use of modern pedagogical methods' },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 70) return { label: 'Average', variant: 'outline' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">Performance Metrics</h1>
            <p className="text-muted-foreground">Your instructional quality evaluation scores</p>
          </div>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.map(sem => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Overall Score Card */}
        <div className="dashboard-card gradient-primary text-primary-foreground">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold">Overall Quality Score</h2>
              <p className="text-primary-foreground/80">{selectedSemester} Evaluation</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-5xl font-bold">{currentMetrics.overallScore}%</p>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  {getScoreBadge(currentMetrics.overallScore).label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RadarMetrics data={radarData} title="Metric Breakdown" subtitle="Performance across all evaluation categories" />
          <TrendChart data={trendData} title="Score History" subtitle="Your quality score over past semesters" />
        </div>

        {/* Detailed Metrics */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Detailed Evaluation</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {detailedMetrics.map((metric) => {
              const badge = getScoreBadge(metric.value);
              return (
                <div key={metric.label} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{metric.label}</h4>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-semibold">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyMetrics;
