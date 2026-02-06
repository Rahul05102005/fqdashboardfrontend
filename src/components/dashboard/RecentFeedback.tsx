import React from 'react';
import { Feedback, FacultyProfile } from '@/types';
import { Star, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RecentFeedbackProps {
  feedbacks: Feedback[];
  faculty: FacultyProfile[];
  className?: string;
}

const RecentFeedback: React.FC<RecentFeedbackProps> = ({
  feedbacks,
  faculty,
  className,
}) => {
  const getFacultyName = (facultyId: string) => {
    const f = faculty.find(fac => fac.id === facultyId);
    return f?.name || 'Unknown Faculty';
  };

  const getAverageRating = (ratings: Feedback['ratings']) => {
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className={cn('dashboard-card', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Feedback</h3>
          <p className="text-sm text-muted-foreground">Latest student submissions</p>
        </div>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {feedbacks.slice(0, 5).map((feedback) => (
          <div
            key={feedback.id}
            className="rounded-lg border border-border p-4 transition-all hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {getFacultyName(feedback.facultyId)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {feedback.courseId} • {feedback.semester}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="text-sm font-semibold text-foreground">
                  {getAverageRating(feedback.ratings)}
                </span>
              </div>
            </div>
            {feedback.comments && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                "{feedback.comments}"
              </p>
            )}
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(feedback.submittedAt), 'MMM dd, yyyy • HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFeedback;
