import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FacultyTable from '@/components/dashboard/FacultyTable';
import { mockFaculty, mockCourses } from '@/data/mockData';
import { FacultyProfile } from '@/types';
import { Search, Plus, Filter, Download } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const FacultyManagement: React.FC = () => {
  const [faculty, setFaculty] = useState<FacultyProfile[]>(mockFaculty);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyProfile | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || f.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(faculty.map(f => f.department))];

  const handleView = (f: FacultyProfile) => {
    setSelectedFaculty(f);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (f: FacultyProfile) => {
    toast.info('Edit functionality', {
      description: `Editing ${f.name}'s profile. Connect to Lovable Cloud for full CRUD operations.`,
    });
  };

  const handleExport = () => {
    toast.success('Export initiated', {
      description: 'Faculty data export has been started.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground lg:text-3xl">
              Faculty Management
            </h1>
            <p className="text-muted-foreground">
              Manage faculty profiles and view performance metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {filteredFaculty.length} of {faculty.length} faculty members</span>
          </div>
        </div>

        {/* Faculty Table */}
        <FacultyTable
          faculty={filteredFaculty}
          onView={handleView}
          onEdit={handleEdit}
        />

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Faculty Profile</DialogTitle>
              <DialogDescription>
                Detailed information about the faculty member
              </DialogDescription>
            </DialogHeader>
            {selectedFaculty && (
              <div className="space-y-6">
                {/* Profile Header */}
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

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedFaculty.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">{selectedFaculty.department}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Qualification</Label>
                    <p className="font-medium">{selectedFaculty.qualification}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Experience</Label>
                    <p className="font-medium">{selectedFaculty.experience} years</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Average Rating</Label>
                    <p className="font-medium">{selectedFaculty.averageRating.toFixed(2)} / 5.0</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Total Feedbacks</Label>
                    <p className="font-medium">{selectedFaculty.totalFeedbacks}</p>
                  </div>
                </div>

                {/* Specializations */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Specializations</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.specialization.map(spec => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Assigned Courses</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.coursesAssigned.map(course => (
                      <Badge key={course} variant="outline">{course}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FacultyManagement;
