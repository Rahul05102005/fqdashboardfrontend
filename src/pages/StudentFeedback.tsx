import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useFacultyWithFeedback } from '@/hooks/useFacultyWithFeedback';
import { useFeedbackStore } from '@/hooks/useFeedbackStore';
import { useAuth } from '@/context/AuthContext';
import { Feedback, FeedbackRatings } from '@/types';
import { toast } from 'sonner';
import { Send, Star, CheckCircle2, Trash2 } from 'lucide-react';
import api from '@/lib/api';

const ratingCategories: { key: keyof FeedbackRatings; label: string }[] = [
  { key: 'teachingEffectiveness', label: 'Teaching Effectiveness' },
  { key: 'subjectKnowledge', label: 'Subject Knowledge' },
  { key: 'communication', label: 'Communication' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'courseContent', label: 'Course Content' },
  { key: 'studentEngagement', label: 'Student Engagement' },
  { key: 'assessmentFairness', label: 'Assessment Fairness' },
  { key: 'overallSatisfaction', label: 'Overall Satisfaction' },
];

const defaultRatings: FeedbackRatings = {
  teachingEffectiveness: 3,
  subjectKnowledge: 3,
  communication: 3,
  punctuality: 3,
  courseContent: 3,
  studentEngagement: 3,
  assessmentFairness: 3,
  overallSatisfaction: 3,
};

interface CourseRow { 
  id: string; 
  _id?: string;
  code: string; 
  name: string; 
  semester: number; 
  credits: number; 
  department: string; 
}

const StudentFeedback: React.FC = () => {
  const { user } = useAuth();
  const { faculty } = useFacultyWithFeedback();
  const { feedbacks, addFeedback, deleteFeedback } = useFeedbackStore();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [ratings, setRatings] = useState<FeedbackRatings>({ ...defaultRatings });
  const [comments, setComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        const data = response.data.map((c: any) => ({ ...c, id: c._id }));
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const activeFaculty = faculty.filter(f => f.status === 'active');
  const selectedFaculty = activeFaculty.find(f => f.id === selectedFacultyId);

  const displayCourses = selectedFaculty
    ? courses.filter(c => {
        const assignedIds = (selectedFaculty.coursesAssigned || []).map((ca: any) => 
          typeof ca === 'object' ? ca.id || ca._id : ca
        );
        const matchesAssigned = assignedIds.includes(c.id) || assignedIds.includes(c._id!);
        
        // Smarter department matching (handles "cse" vs "Computer Science")
        const fDept = (selectedFaculty.department || '').toLowerCase();
        const cDept = (c.department || '').toLowerCase();
        const matchesDepartment = fDept === cDept || 
                                 (fDept.length > 2 && cDept.includes(fDept)) || 
                                 (cDept.length > 2 && fDept.includes(cDept)) ||
                                 (fDept === 'cse' && cDept.includes('computer'));

        return matchesAssigned || matchesDepartment;
      })
    : [];


  const handleRatingChange = (key: keyof FeedbackRatings, value: number[]) => {
    setRatings(prev => ({ ...prev, [key]: value[0] }));
  };

  const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

  const handleSubmit = async () => {
    if (!selectedFacultyId || !selectedCourseId || !selectedSemester) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newFeedback = {
        facultyId: selectedFacultyId,
        courseId: selectedCourseId,
        semester: selectedSemester,
        academicYear: selectedYear,
        ratings: { ...ratings },
        comments: comments.trim() || undefined,
        isAnonymous,
      };

      await addFeedback(newFeedback);

      toast.success('Feedback submitted successfully!', {
        description: `Your feedback for ${selectedFaculty?.name} has been recorded.`,
      });

      // Reset form
      setSelectedFacultyId('');
      setSelectedCourseId('');
      setSelectedSemester('');
      setRatings({ ...defaultRatings });
      setComments('');
      setIsAnonymous(true);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show feedbacks submitted by current user
  const myRecentFeedbacks = feedbacks.slice(0, 5);

  const handleDeleteFeedback = async (fb: Feedback) => {
    try {
      await deleteFeedback(fb.id);
      toast.success('Feedback deleted');
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Give Feedback</h1>
          <p className="text-muted-foreground">Rate faculty members and help improve teaching quality</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>Select a faculty member and course, then rate across different categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Faculty Member *</Label>
                    <Select value={selectedFacultyId} onValueChange={(v) => { setSelectedFacultyId(v); setSelectedCourseId(''); }}>
                      <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                      <SelectContent>
                        {activeFaculty.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.name} — {f.department}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Course *</Label>
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={!selectedFacultyId}>
                      <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        {displayCourses.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <SelectItem key={s} value={`Semester ${s}`}>Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-5">
                  <Label className="text-base font-semibold">Ratings</Label>
                  {ratingCategories.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{label}</span>
                        <Badge variant="secondary">{ratings[key].toFixed(1)}</Badge>
                      </div>
                      <Slider min={1} max={5} step={0.1} value={[ratings[key]]} onValueChange={(v) => handleRatingChange(key, v)} className="w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Comments (Optional)</Label>
                  <Textarea placeholder="Share your experience..." value={comments} onChange={(e) => setComments(e.target.value)} rows={4} maxLength={500} />
                  <p className="text-xs text-muted-foreground">{comments.length}/500 characters</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Submit Anonymously</p>
                    <p className="text-sm text-muted-foreground">Your identity won't be revealed to faculty</p>
                  </div>
                  <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>
                <Button onClick={handleSubmit} className="w-full h-12 text-base" disabled={!selectedFacultyId || !selectedCourseId || !selectedSemester}>
                  {submitted ? (
                    <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Submitted!</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="h-5 w-5" /> Submit Feedback</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Rating Preview</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-6 w-6 ${s <= Math.round(averageRating) ? 'text-chart-5 fill-chart-5' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <p className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Recent Feedbacks</CardTitle></CardHeader>
              <CardContent>
                {myRecentFeedbacks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No feedbacks submitted yet</p>
                ) : (
                    <div className="space-y-3">
                    {myRecentFeedbacks.map(fb => {
                      // Safely get faculty name
                      const fid = fb.facultyId ? (typeof fb.facultyId === 'object' ? (fb.facultyId as any)._id || (fb.facultyId as any).id : fb.facultyId) : null;
                      const fac = faculty.find(f => f.id === fid || f._id === fid);
                      
                      // Safely get course code
                      const courseDisplay = typeof fb.courseId === 'object' && fb.courseId !== null 
                        ? (fb.courseId as any).code 
                        : (courses.find(c => c.id === fb.courseId || c._id === fb.courseId)?.code || fb.courseId);

                      const avg = Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 8;
                      return (
                        <div key={fb.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm text-foreground">{fac?.name || 'Unknown Faculty'}</p>
                              <p className="text-xs text-muted-foreground">{courseDisplay} · {fb.semester}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-warning fill-warning" />
                                <span className="text-xs font-medium">{avg.toFixed(1)}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteFeedback(fb)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentFeedback;
