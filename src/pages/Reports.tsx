import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import DepartmentPieChart from '@/components/dashboard/DepartmentPieChart';
import { mockDepartmentStatsByYear, mockSemesterTrendsByYear } from '@/data/mockData';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
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
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const { faculty } = useFacultyWithFeedback();
  const { feedbacks: allFeedbacks } = useFeedbackStore();

  const departmentStats = mockDepartmentStatsByYear[academicYear] || mockDepartmentStatsByYear['2024-25'];
  const semesterTrends = mockSemesterTrendsByYear[academicYear] || mockSemesterTrendsByYear['2024-25'];
  const yearFeedbacks = useMemo(() => allFeedbacks.filter(f => f.academicYear === academicYear), [academicYear, allFeedbacks]);

  const departmentChartData = departmentStats.map(d => ({
    name: d.department.split(' ')[0],
    rating: d.averageRating,
  }));

  const trendChartData = semesterTrends.map(t => ({
    name: t.semester,
    value: t.averageRating,
    value2: t.qualityScore / 20,
  }));

  const handleExport = (type: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(type, 14, 22);
    doc.setFontSize(11);
    doc.text(`Academic Year: ${academicYear}`, 14, 30);

    if (type === 'Faculty Performance Report') {
      const headers = [['Name', 'Department', 'Designation', 'Avg Rating', 'Feedbacks', 'Status']];
      const rows = faculty.map(f => [f.name, f.department, f.designation, f.averageRating.toFixed(2), String(f.totalFeedbacks), f.status]);
      autoTable(doc, { head: headers, body: rows, startY: 36 });
      doc.save(`Faculty_Performance_Report_${academicYear}.pdf`);
      toast.success('Faculty Performance Report downloaded as PDF');
    } else if (type === 'Semester Summary Report') {
      const headers = [['Semester', 'Average Rating', 'Feedback Count', 'Quality Score']];
      const rows = semesterTrends.map(t => [t.semester, t.averageRating.toFixed(2), String(t.feedbackCount), String(t.qualityScore)]);
      autoTable(doc, { head: headers, body: rows, startY: 36 });
      doc.save(`Semester_Summary_Report_${academicYear}.pdf`);
      toast.success('Semester Summary Report downloaded as PDF');
    } else if (type === 'Department Analysis') {
      const headers = [['Department', 'Faculty Count', 'Average Rating', 'Feedback Count']];
      const rows = departmentStats.map(d => [d.department, String(d.facultyCount), d.averageRating.toFixed(2), String(d.feedbackCount)]);
      autoTable(doc, { head: headers, body: rows, startY: 36 });
      doc.save(`Department_Analysis_${academicYear}.pdf`);
      toast.success('Department Analysis downloaded as PDF');
    }
  };

  const reportTypes = [
    { title: 'Faculty Performance Report', description: 'Comprehensive analysis of faculty teaching quality', icon: FileText },
    { title: 'Semester Summary Report', description: 'Aggregated metrics for the selected semester', icon: Calendar },
    { title: 'Department Analysis', description: 'Department-wise performance comparison', icon: FileText },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and export institutional reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reportTypes.map((report) => (
            <div key={report.title} className="dashboard-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => handleExport(report.title)}>
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
          <PerformanceChart data={departmentChartData} title="Department Performance" subtitle={`Average rating by department (${academicYear})`} />
          <TrendChart data={trendChartData} title="Historical Trends" subtitle={`Rating and quality score over time (${academicYear})`} dataKey="value" dataKey2="value2" />
        </div>

        <DepartmentPieChart data={departmentStats} title="Faculty Distribution" subtitle={`Number of faculty per department (${academicYear})`} />

        {/* Summary Table */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Department Summary — {academicYear}</h3>
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
                {departmentStats.map((dept) => (
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
