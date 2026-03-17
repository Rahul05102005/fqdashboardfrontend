import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Feedback, FeedbackRatings } from '@/types';

function mapRow(row: any): Feedback {
  return {
    id: row.id,
    facultyId: row.faculty_id,
    courseId: row.course_id,
    semester: row.semester,
    academicYear: row.academic_year,
    ratings: {
      teachingEffectiveness: Number(row.teaching_effectiveness),
      subjectKnowledge: Number(row.subject_knowledge),
      communication: Number(row.communication),
      punctuality: Number(row.punctuality),
      courseContent: Number(row.course_content),
      studentEngagement: Number(row.student_engagement),
      assessmentFairness: Number(row.assessment_fairness),
      overallSatisfaction: Number(row.overall_satisfaction),
    },
    comments: row.comments || undefined,
    submittedAt: row.submitted_at,
    isAnonymous: row.is_anonymous,
  };
}

export function useFeedbackStore() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (!error && data) {
      setFeedbacks(data.map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedbacks();

    const channel = supabase
      .channel('feedbacks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => {
        fetchFeedbacks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchFeedbacks]);

  const addFeedback = async (feedback: Feedback) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('feedbacks').insert({
      faculty_id: feedback.facultyId,
      course_id: feedback.courseId,
      semester: feedback.semester,
      academic_year: feedback.academicYear,
      teaching_effectiveness: feedback.ratings.teachingEffectiveness,
      subject_knowledge: feedback.ratings.subjectKnowledge,
      communication: feedback.ratings.communication,
      punctuality: feedback.ratings.punctuality,
      course_content: feedback.ratings.courseContent,
      student_engagement: feedback.ratings.studentEngagement,
      assessment_fairness: feedback.ratings.assessmentFairness,
      overall_satisfaction: feedback.ratings.overallSatisfaction,
      comments: feedback.comments || null,
      is_anonymous: feedback.isAnonymous,
      submitted_by: user?.id || null,
    });
    if (!error) await fetchFeedbacks();
    return !error;
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (!error) await fetchFeedbacks();
    return !error;
  };

  return { feedbacks, loading, setFeedbacks, addFeedback, deleteFeedback, refetch: fetchFeedbacks };
}
