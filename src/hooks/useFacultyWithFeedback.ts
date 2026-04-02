import { useMemo } from 'react';
import { useFacultyStore } from './useFacultyStore';
import { useFeedbackStore } from './useFeedbackStore';
import { FacultyProfile } from '@/types';

/**
 * Returns faculty list with averageRating and totalFeedbacks
 * dynamically computed from the feedback store (now from DB).
 */
export function useFacultyWithFeedback() {
  const { faculty, isLoading: facultyLoading, ...rest } = useFacultyStore();
  const { feedbacks, isLoading: feedbackLoading } = useFeedbackStore();

  const enrichedFaculty: FacultyProfile[] = useMemo(() => {
    return faculty.map(f => {
      const fbs = feedbacks.filter(fb => {
        const fbFacultyId = fb.facultyId ? (typeof fb.facultyId === 'object' ? (fb.facultyId as any)._id || (fb.facultyId as any).id : fb.facultyId) : null;
        return fbFacultyId && (fbFacultyId === f.id || fbFacultyId === f._id);
      });
      if (fbs.length === 0) return f;
      const totalFeedbacks = fbs.length;
      const avgRatings = fbs.map(fb => {
        const vals = Object.values(fb.ratings);
        return vals.reduce((a, b) => a + b, 0) / vals.length;
      });
      const averageRating = parseFloat(
        (avgRatings.reduce((a, b) => a + b, 0) / avgRatings.length).toFixed(2)
      );
      return { ...f, averageRating, totalFeedbacks };
    });
  }, [faculty, feedbacks]);

  return { faculty: enrichedFaculty, loading: facultyLoading || feedbackLoading, ...rest };
}
