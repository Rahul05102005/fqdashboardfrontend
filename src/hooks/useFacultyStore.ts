import { useState, useEffect, useCallback } from 'react';
import { FacultyProfile } from '@/types';
import api from '@/lib/api';

export function useFacultyStore() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/faculty');
      // Normalize _id to id for frontend compatibility
      const data = response.data.map((f: any) => ({ ...f, id: f._id }));
      setFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const addFaculty = async (profile: any) => {
    try {
      const response = await api.post('/faculty', profile);
      const newFaculty = { ...response.data, id: response.data._id };
      setFaculty(prev => [newFaculty, ...prev]);
      return newFaculty;
    } catch (error) {
      console.error('Error adding faculty:', error);
      throw error;
    }
  };

  const updateFaculty = async (id: string, updates: Partial<FacultyProfile>) => {
    try {
      const response = await api.put(`/faculty/${id}`, updates);
      const updated = { ...response.data, id: response.data._id };
      setFaculty(prev => prev.map(f => f.id === id ? updated : f));
      return updated;
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  };

  const deleteFaculty = async (id: string) => {
    try {
      await api.delete(`/faculty/${id}`);
      setFaculty(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting faculty:', error);
      throw error;
    }
  };

  return { faculty, isLoading, addFaculty, updateFaculty, deleteFaculty, refresh: fetchFaculty };
}
