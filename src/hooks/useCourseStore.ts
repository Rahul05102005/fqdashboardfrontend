import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';
import api from '@/lib/api';

export function useCourseStore() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/courses');
      // Normalize _id to id for frontend compatibility
      const data = response.data.map((c: any) => ({ ...c, id: c._id }));
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, refresh: fetchCourses };
}
