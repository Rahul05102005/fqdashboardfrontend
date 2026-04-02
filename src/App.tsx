import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyManagement from "./pages/FacultyManagement";
import FeedbackAnalysis from "./pages/FeedbackAnalysis";
import Reports from "./pages/Reports";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyFeedback from "./pages/FacultyFeedback";
import FacultyMetrics from "./pages/FacultyMetrics";
import StudentDashboard from "./pages/StudentDashboard";
import StudentFeedback from "./pages/StudentFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FacultyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FeedbackAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/feedback"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/metrics"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyMetrics />
                </ProtectedRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/feedback"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentFeedback />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
