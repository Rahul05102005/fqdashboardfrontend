// Mock Data for Faculty Instructional Quality Dashboard
import { FacultyProfile, Feedback, InstructionalMetric, Course, DepartmentStats, SemesterTrend } from '@/types';

export const mockFaculty: FacultyProfile[] = [
  {
    id: 'f1',
    userId: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: 12,
    specialization: ['Machine Learning', 'Data Structures', 'Algorithms'],
    joiningDate: '2012-08-15',
    status: 'active',
    coursesAssigned: ['CS101', 'CS301', 'CS401'],
    averageRating: 4.6,
    totalFeedbacks: 156,
  },
  {
    id: 'f2',
    userId: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Software Engineering',
    experience: 6,
    specialization: ['Software Engineering', 'Web Development', 'Cloud Computing'],
    joiningDate: '2018-01-10',
    status: 'active',
    coursesAssigned: ['CS201', 'CS302'],
    averageRating: 4.8,
    totalFeedbacks: 89,
  },
  {
    id: 'f3',
    userId: '4',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    department: 'Electronics',
    designation: 'Professor',
    qualification: 'Ph.D. in Electronics Engineering',
    experience: 18,
    specialization: ['Digital Electronics', 'VLSI Design', 'Embedded Systems'],
    joiningDate: '2006-07-01',
    status: 'active',
    coursesAssigned: ['EC101', 'EC201', 'EC301', 'EC401'],
    averageRating: 4.3,
    totalFeedbacks: 245,
  },
  {
    id: 'f4',
    userId: '5',
    name: 'Dr. Amanda Foster',
    email: 'amanda.foster@university.edu',
    department: 'Mathematics',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Applied Mathematics',
    experience: 10,
    specialization: ['Calculus', 'Linear Algebra', 'Probability'],
    joiningDate: '2014-08-20',
    status: 'active',
    coursesAssigned: ['MA101', 'MA201', 'MA301'],
    averageRating: 4.5,
    totalFeedbacks: 178,
  },
  {
    id: 'f5',
    userId: '6',
    name: 'Prof. Robert Williams',
    email: 'robert.williams@university.edu',
    department: 'Physics',
    designation: 'Professor',
    qualification: 'Ph.D. in Theoretical Physics',
    experience: 22,
    specialization: ['Quantum Mechanics', 'Thermodynamics', 'Optics'],
    joiningDate: '2002-06-15',
    status: 'active',
    coursesAssigned: ['PH101', 'PH201', 'PH301', 'PH401'],
    averageRating: 4.2,
    totalFeedbacks: 312,
  },
  {
    id: 'f6',
    userId: '7',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@university.edu',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Artificial Intelligence',
    experience: 4,
    specialization: ['AI/ML', 'Natural Language Processing', 'Deep Learning'],
    joiningDate: '2020-08-01',
    status: 'active',
    coursesAssigned: ['CS402', 'CS403'],
    averageRating: 4.9,
    totalFeedbacks: 67,
  },
];

export const mockCourses: Course[] = [
  { id: 'CS101', code: 'CS101', name: 'Introduction to Programming', semester: 1, credits: 4, department: 'Computer Science' },
  { id: 'CS201', code: 'CS201', name: 'Data Structures', semester: 3, credits: 4, department: 'Computer Science' },
  { id: 'CS301', code: 'CS301', name: 'Algorithms', semester: 5, credits: 3, department: 'Computer Science' },
  { id: 'CS401', code: 'CS401', name: 'Machine Learning', semester: 7, credits: 4, department: 'Computer Science' },
  { id: 'EC101', code: 'EC101', name: 'Basic Electronics', semester: 1, credits: 4, department: 'Electronics' },
  { id: 'MA101', code: 'MA101', name: 'Engineering Mathematics I', semester: 1, credits: 4, department: 'Mathematics' },
  { id: 'PH101', code: 'PH101', name: 'Engineering Physics', semester: 1, credits: 3, department: 'Physics' },
];

export const mockFeedbacks: Feedback[] = [
  {
    id: 'fb1',
    facultyId: 'f1',
    courseId: 'CS101',
    semester: 'Fall 2024',
    academicYear: '2024-25',
    ratings: {
      teachingEffectiveness: 4.8,
      subjectKnowledge: 5.0,
      communication: 4.5,
      punctuality: 4.7,
      courseContent: 4.6,
      studentEngagement: 4.4,
      assessmentFairness: 4.5,
      overallSatisfaction: 4.6,
    },
    comments: 'Excellent teaching methodology. Makes complex concepts easy to understand.',
    submittedAt: '2024-12-15T10:30:00Z',
    isAnonymous: true,
  },
  {
    id: 'fb2',
    facultyId: 'f2',
    courseId: 'CS201',
    semester: 'Fall 2024',
    academicYear: '2024-25',
    ratings: {
      teachingEffectiveness: 4.9,
      subjectKnowledge: 4.8,
      communication: 4.9,
      punctuality: 5.0,
      courseContent: 4.7,
      studentEngagement: 4.8,
      assessmentFairness: 4.6,
      overallSatisfaction: 4.8,
    },
    comments: 'One of the best professors. Very engaging classes.',
    submittedAt: '2024-12-14T14:20:00Z',
    isAnonymous: true,
  },
  {
    id: 'fb3',
    facultyId: 'f3',
    courseId: 'EC101',
    semester: 'Fall 2024',
    academicYear: '2024-25',
    ratings: {
      teachingEffectiveness: 4.2,
      subjectKnowledge: 4.8,
      communication: 4.0,
      punctuality: 4.5,
      courseContent: 4.3,
      studentEngagement: 4.1,
      assessmentFairness: 4.4,
      overallSatisfaction: 4.3,
    },
    comments: 'Good content delivery but could be more interactive.',
    submittedAt: '2024-12-13T09:15:00Z',
    isAnonymous: false,
  },
];

export const mockMetrics: InstructionalMetric[] = [
  {
    id: 'm1',
    facultyId: 'f1',
    semester: 'Fall 2024',
    academicYear: '2024-25',
    teachingQualityScore: 92,
    researchContribution: 85,
    syllabusCompletion: 98,
    attendanceCompliance: 95,
    studentPassRate: 89,
    innovativeTeaching: 88,
    overallScore: 91,
    evaluatedAt: '2024-12-20T00:00:00Z',
    evaluatedBy: 'admin1',
  },
  {
    id: 'm2',
    facultyId: 'f2',
    semester: 'Fall 2024',
    academicYear: '2024-25',
    teachingQualityScore: 95,
    researchContribution: 78,
    syllabusCompletion: 100,
    attendanceCompliance: 98,
    studentPassRate: 92,
    innovativeTeaching: 94,
    overallScore: 93,
    evaluatedAt: '2024-12-20T00:00:00Z',
    evaluatedBy: 'admin1',
  },
];

export const mockDepartmentStats: DepartmentStats[] = [
  { department: 'Computer Science', facultyCount: 3, averageRating: 4.77, feedbackCount: 312 },
  { department: 'Electronics', facultyCount: 1, averageRating: 4.30, feedbackCount: 245 },
  { department: 'Mathematics', facultyCount: 1, averageRating: 4.50, feedbackCount: 178 },
  { department: 'Physics', facultyCount: 1, averageRating: 4.20, feedbackCount: 312 },
];

export const mockSemesterTrends: SemesterTrend[] = [
  { semester: 'Spring 2023', averageRating: 4.1, feedbackCount: 890, qualityScore: 82 },
  { semester: 'Fall 2023', averageRating: 4.25, feedbackCount: 945, qualityScore: 85 },
  { semester: 'Spring 2024', averageRating: 4.35, feedbackCount: 912, qualityScore: 87 },
  { semester: 'Fall 2024', averageRating: 4.48, feedbackCount: 1047, qualityScore: 90 },
];

export const getPerformanceColor = (score: number): string => {
  if (score >= 4.5) return 'text-success';
  if (score >= 4.0) return 'text-chart-5';
  if (score >= 3.5) return 'text-warning';
  return 'text-destructive';
};

export const getPerformanceBadge = (score: number): { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' } => {
  if (score >= 4.5) return { label: 'Excellent', variant: 'success' };
  if (score >= 4.0) return { label: 'Good', variant: 'secondary' };
  if (score >= 3.5) return { label: 'Average', variant: 'warning' };
  return { label: 'Needs Improvement', variant: 'destructive' };
};
