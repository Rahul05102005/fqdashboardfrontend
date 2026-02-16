// Core Types for Faculty Instructional Quality Dashboard

export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export interface FacultyProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  specialization: string[];
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  coursesAssigned: string[];
  averageRating: number;
  totalFeedbacks: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  department: string;
}

export interface Feedback {
  id: string;
  facultyId: string;
  courseId: string;
  semester: string;
  academicYear: string;
  ratings: FeedbackRatings;
  comments?: string;
  submittedAt: string;
  isAnonymous: boolean;
}

export interface FeedbackRatings {
  teachingEffectiveness: number;
  subjectKnowledge: number;
  communication: number;
  punctuality: number;
  courseContent: number;
  studentEngagement: number;
  assessmentFairness: number;
  overallSatisfaction: number;
}

export interface InstructionalMetric {
  id: string;
  facultyId: string;
  semester: string;
  academicYear: string;
  teachingQualityScore: number;
  researchContribution: number;
  syllabusCompletion: number;
  attendanceCompliance: number;
  studentPassRate: number;
  innovativeTeaching: number;
  overallScore: number;
  evaluatedAt: string;
  evaluatedBy: string;
}

export interface DashboardStats {
  totalFaculty: number;
  totalFeedbacks: number;
  averageRating: number;
  activeCourses: number;
  departmentWiseStats: DepartmentStats[];
  semesterTrends: SemesterTrend[];
  topPerformers: FacultyProfile[];
  recentFeedbacks: Feedback[];
}

export interface DepartmentStats {
  department: string;
  facultyCount: number;
  averageRating: number;
  feedbackCount: number;
}

export interface SemesterTrend {
  semester: string;
  averageRating: number;
  feedbackCount: number;
  qualityScore: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
