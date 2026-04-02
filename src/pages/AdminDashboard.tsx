import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import DepartmentPieChart from '@/components/dashboard/DepartmentPieChart';
import FacultyTable from '@/components/dashboard/FacultyTable';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import {
  mockDepartmentStatsByYear,
  mockSemesterTrendsByYear,
  yearQualityScores,
  yearQualityTrends,
} from '@/data/mockData';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
import { useAuth } from '@/context/AuthContext';
import { Users, MessageSquare, Star, TrendingUp, Search, Filter, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FacultyProfile } from '@/types';
import { toast } from 'sonner';
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const { faculty, updateFaculty, deleteFaculty, addFaculty: restoreFaculty } = useFacultyWithFeedback();
  const { feedbacks: allFeedbacks } = useFeedbackStore();

  // View dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyProfile | null>(null);

  // Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFaculty, setEditFaculty] = useState({
    id: '', name: '', email: '', department: '', designation: '',
    qualification: '', experience: '', specialization: '', coursesAssigned: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave',
  });

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState<FacultyProfile | null>(null);

  // Filter feedbacks by academic year
  const yearFeedbacks = useMemo(() => allFeedbacks.filter(f => f.academicYear === academicYear), [academicYear, allFeedbacks]);

  const departmentStats = mockDepartmentStatsByYear[academicYear] || mockDepartmentStatsByYear['2024-25'];
  const semesterTrends = mockSemesterTrendsByYear[academicYear] || mockSemesterTrendsByYear['2024-25'];
  const qualityScore = yearQualityScores[academicYear] || '89%';
  const qualityTrend = yearQualityTrends[academicYear] || { value: 5, isPositive: true };

  const totalFaculty = faculty.length;
  const activeFaculty = faculty.filter(f => f.status === 'active').length;
  const totalFeedbacks = yearFeedbacks.length > 0
    ? yearFeedbacks.length
    : faculty.reduce((acc, f) => acc + f.totalFeedbacks, 0);

  const averageRating = useMemo(() => {
    if (totalFaculty === 0) return '0.00';
    if (yearFeedbacks.length === 0) {
      return (faculty.reduce((acc, f) => acc + (f.averageRating || 0), 0) / totalFaculty).toFixed(2);
    }
    const avgPerFeedback = yearFeedbacks.map(f => {
      const vals = Object.values(f.ratings || {});
      if (vals.length === 0) return 0;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    return (avgPerFeedback.reduce((a, b) => a + b, 0) / (avgPerFeedback.length || 1)).toFixed(2);
  }, [yearFeedbacks, totalFaculty, faculty]);

  const feedbackTrend = useMemo(() => {
    if (academicYear === '2024-25') return { value: 12, isPositive: true };
    if (academicYear === '2023-24') return { value: 6, isPositive: true };
    return { value: -3, isPositive: false };
  }, [academicYear]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || f.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, departmentFilter, faculty]);

  const departmentChartData = departmentStats.map(d => ({
    name: d.department.split(' ')[0],
    rating: d.averageRating,
  }));

  const trendChartData = semesterTrends.map(t => ({
    name: t.semester,
    value: t.averageRating,
    value2: t.qualityScore / 20,
  }));

  const departments = [...new Set(faculty.map(f => f.department))];

  const handleView = (f: FacultyProfile) => {
    setSelectedFaculty(f);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (f: FacultyProfile) => {
    setEditFaculty({
      id: f.id, name: f.name, email: f.email, department: f.department,
      designation: f.designation, qualification: f.qualification,
      experience: String(f.experience), specialization: f.specialization.join(', '),
      coursesAssigned: f.coursesAssigned.join(', '), status: f.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editFaculty.name.trim()) { toast.error('Name is required'); return; }
    if (!editFaculty.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFaculty.email.trim())) { toast.error('Valid email is required'); return; }
    if (!editFaculty.department.trim()) { toast.error('Department is required'); return; }
    if (!editFaculty.designation.trim()) { toast.error('Designation is required'); return; }

    try {
      await updateFaculty(editFaculty.id, {
        name: editFaculty.name.trim(),
        email: editFaculty.email.trim(),
        department: editFaculty.department.trim(),
        designation: editFaculty.designation.trim(),
        qualification: editFaculty.qualification.trim() || 'Not specified',
        experience: parseInt(editFaculty.experience) || 0,
        specialization: editFaculty.specialization ? editFaculty.specialization.split(',').map(s => s.trim()).filter(Boolean) : [],
        status: editFaculty.status,
      });
      setIsEditDialogOpen(false);
      toast.success('Faculty updated successfully', { description: `${editFaculty.name.trim()}'s profile has been updated.` });
    } catch (error) {
      toast.error('Failed to update faculty');
    }
  };

  const handleDeleteClick = (f: FacultyProfile) => {
    setDeletingFaculty(f);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingFaculty) {
      const deleted = deletingFaculty;
      try {
        await deleteFaculty(deleted.id);
        toast.success('Faculty deleted', {
          description: `${deleted.name} has been removed.`,
        });
      } catch (error) {
        toast.error('Failed to delete faculty');
      }
    }
    setIsDeleteDialogOpen(false);
    setDeletingFaculty(null);
  };

  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Admin Profile Showcase */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 bg-primary/5 border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{user?.name}</h2>
                  <Badge variant="secondary" className="capitalize">{user?.role} Account</Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">University Admin</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 flex flex-col justify-center">
            <h1 className="text-3xl font-serif font-bold text-foreground">Institutional Overview</h1>
            <p className="text-muted-foreground max-w-xl">
              Welcome to the Faculty Instructional Quality Dashboard. You have full access to performance metrics, 
              faculty management, and institutional feedback analysis.
            </p>
          </div>
        </div>

        {/* Existing Header - simplified */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Global Metrics</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Academic Year:</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Faculty" value={totalFaculty} subtitle={`${activeFaculty} active`} icon={Users} variant="primary" />
          <StatCard title="Total Feedbacks" value={totalFeedbacks.toLocaleString()} subtitle={`Academic Year ${academicYear}`} icon={MessageSquare} trend={feedbackTrend} />
          <StatCard title="Average Rating" value={averageRating} subtitle="Out of 5.0" icon={Star} variant="success" />
          <StatCard title="Quality Score" value={qualityScore} subtitle="Institutional average" icon={TrendingUp} trend={qualityTrend} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PerformanceChart data={departmentChartData} title="Department-wise Performance" subtitle={`Average rating by department (${academicYear})`} />
          <TrendChart data={trendChartData} title="Rating Trends" subtitle={`Semester-wise performance trends (${academicYear})`} dataKey="value" dataKey2="value2" />
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DepartmentPieChart data={departmentStats} title="Faculty Distribution" subtitle={`By department (${academicYear})`} />
          <RecentFeedback feedbacks={yearFeedbacks.length > 0 ? yearFeedbacks : allFeedbacks} faculty={faculty} className="lg:col-span-2" />
        </div>

        {/* Faculty Table */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-serif font-semibold text-foreground">Faculty Overview</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search faculty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full sm:w-64" />
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
          <FacultyTable faculty={filteredFaculty} onView={handleView} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </div>

        {/* View Faculty Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Faculty Profile</DialogTitle>
              <DialogDescription>Detailed information about the faculty member</DialogDescription>
            </DialogHeader>
            {selectedFaculty && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {selectedFaculty.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedFaculty.name}</h3>
                    <p className="text-muted-foreground">{selectedFaculty.designation}</p>
                    <Badge variant={selectedFaculty.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {selectedFaculty.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1"><Label className="text-muted-foreground">Email</Label><p className="font-medium">{selectedFaculty.email}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Department</Label><p className="font-medium">{selectedFaculty.department}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Qualification</Label><p className="font-medium">{selectedFaculty.qualification}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Experience</Label><p className="font-medium">{selectedFaculty.experience} years</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Average Rating</Label><p className="font-medium">{selectedFaculty.averageRating.toFixed(2)} / 5.0</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Total Feedbacks</Label><p className="font-medium">{selectedFaculty.totalFeedbacks}</p></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Specializations</Label>
                  <div className="flex flex-wrap gap-2">{selectedFaculty.specialization.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Assigned Courses</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.coursesAssigned.map((c: any) => (
                      <Badge key={typeof c === 'object' ? c._id : c} variant="outline">
                        {typeof c === 'object' ? c.code : c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Faculty Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Edit Faculty</DialogTitle>
              <DialogDescription>Update the faculty member's details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="dash-edit-name">Full Name *</Label><Input id="dash-edit-name" value={editFaculty.name} onChange={(e) => setEditFaculty(prev => ({ ...prev, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="dash-edit-email">Email *</Label><Input id="dash-edit-email" type="email" value={editFaculty.email} onChange={(e) => setEditFaculty(prev => ({ ...prev, email: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="dash-edit-department">Department *</Label><Input id="dash-edit-department" value={editFaculty.department} onChange={(e) => setEditFaculty(prev => ({ ...prev, department: e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label htmlFor="dash-edit-designation">Designation *</Label>
                  <Select value={editFaculty.designation} onValueChange={(val) => setEditFaculty(prev => ({ ...prev, designation: val }))}>
                    <SelectTrigger id="dash-edit-designation"><SelectValue placeholder="Select designation" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="dash-edit-qualification">Qualification</Label><Input id="dash-edit-qualification" value={editFaculty.qualification} onChange={(e) => setEditFaculty(prev => ({ ...prev, qualification: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="dash-edit-experience">Experience (years)</Label><Input id="dash-edit-experience" type="number" min="0" value={editFaculty.experience} onChange={(e) => setEditFaculty(prev => ({ ...prev, experience: e.target.value }))} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="dash-edit-specialization">Specializations (comma separated)</Label><Input id="dash-edit-specialization" value={editFaculty.specialization} onChange={(e) => setEditFaculty(prev => ({ ...prev, specialization: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="dash-edit-courses">Course IDs (comma separated)</Label><Input id="dash-edit-courses" value={editFaculty.coursesAssigned} onChange={(e) => setEditFaculty(prev => ({ ...prev, coursesAssigned: e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label htmlFor="dash-edit-status">Status</Label>
                  <Select value={editFaculty.status} onValueChange={(val) => setEditFaculty(prev => ({ ...prev, status: val as 'active' | 'inactive' | 'on-leave' }))}>
                    <SelectTrigger id="dash-edit-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Faculty</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deletingFaculty?.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
