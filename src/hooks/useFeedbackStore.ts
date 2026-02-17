import { useState, useEffect } from 'react';
import { Feedback } from '@/types';
import { mockFeedbacks } from '@/data/mockData';

const STORAGE_KEY = 'feedback_data';

function loadFeedbacks(): Feedback[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return mockFeedbacks;
}

function saveFeedbacks(feedbacks: Feedback[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach(fn => fn());
}

export function useFeedbackStore() {
  const [feedbacks, setFeedbacksState] = useState<Feedback[]>(loadFeedbacks);

  useEffect(() => {
    const handler = () => setFeedbacksState(loadFeedbacks());
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const setFeedbacks = (updater: Feedback[] | ((prev: Feedback[]) => Feedback[])) => {
    setFeedbacksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveFeedbacks(next);
      setTimeout(notify, 0);
      return next;
    });
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  return { feedbacks, setFeedbacks, addFeedback, deleteFeedback };
}
