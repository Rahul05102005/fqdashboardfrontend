import { useState, useEffect, useCallback } from 'react';
import { Feedback } from '@/types';
import api from '@/lib/api';

export function useFeedbackStore() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/feedback');
      // Normalize _id to id for frontend compatibility
      const data = response.data.map((f: any) => ({ ...f, id: f._id }));
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const addFeedback = async (feedback: any) => {
    try {
      const response = await api.post('/feedback', feedback);
      const newFeedback = { ...response.data, id: response.data._id };
      setFeedbacks(prev => [newFeedback, ...prev]);
      return newFeedback;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  };

  return { feedbacks, isLoading, addFeedback, deleteFeedback, refresh: fetchFeedbacks };
}
