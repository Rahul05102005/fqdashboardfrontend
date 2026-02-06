import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import DepartmentPieChart from '@/components/dashboard/DepartmentPieChart';
import { mockFaculty, mockDepartmentStats, mockSemesterTrends } from '@/data/mockData';
import { Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const Reports: React.FC = () => {
  const departmentChartData = mockDepartmentStats.map(d => ({
    name: d.department.split(' ')[0],
    rating: d.averageRating,
  }));

  const trendChartData = mockSemesterTrends.map(t => ({
    name: t.semester,
    value: t.averageRating,
    value2: t.qualityScore / 20,
  }));

  const handleExport = (type: string) => {
    toast.success(`${type} Export`, {
      description: `Your ${type} report is being generated.`,
    });
  };

  const reportTypes = [
    {
      title: 'Faculty Performance Report',
      description: 'Comprehensive analysis of faculty teaching quality',
      icon: FileText,
    },
    {
      title: 'Semester Summary Report',
      description: 'Aggregated metrics for the selected semester',
      icon: Calendar,
    },
    {
      title: 'Department Analysis',
      description: 'Department-wise performance comparison',
      icon: FileText,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate and export institutional reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2024-25">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reportTypes.map((report) => (
            <div
              key={report.title}
              className="dashboard-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => handleExport(report.title)}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PerformanceChart
            data={departmentChartData}
            title="Department Performance"
            subtitle="Average rating by department"
          />
          <TrendChart
            data={trendChartData}
            title="Historical Trends"
            subtitle="Rating and quality score over time"
            dataKey="value"
            dataKey2="value2"
          />
        </div>

        <DepartmentPieChart
          data={mockDepartmentStats}
          title="Faculty Distribution"
          subtitle="Number of faculty per department"
        />

        {/* Summary Table */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Department Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Faculty</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Avg Rating</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Feedbacks</th>
                </tr>
              </thead>
              <tbody>
                {mockDepartmentStats.map((dept) => (
                  <tr key={dept.department} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{dept.department}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{dept.facultyCount}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{dept.averageRating.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{dept.feedbackCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
