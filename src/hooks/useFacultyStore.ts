import { useState, useEffect } from 'react';
import { FacultyProfile } from '@/types';
import { mockFaculty } from '@/data/mockData';

const STORAGE_KEY = 'faculty_data';

function loadFaculty(): FacultyProfile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return mockFaculty;
}

function saveFaculty(faculty: FacultyProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(faculty));
}

// Simple event-based sync across components
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach(fn => fn());
}

export function useFacultyStore() {
  const [faculty, setFacultyState] = useState<FacultyProfile[]>(loadFaculty);

  useEffect(() => {
    const handler = () => setFacultyState(loadFaculty());
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const setFaculty = (updater: FacultyProfile[] | ((prev: FacultyProfile[]) => FacultyProfile[])) => {
    setFacultyState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveFaculty(next);
      setTimeout(notify, 0);
      return next;
    });
  };

  const addFaculty = (profile: FacultyProfile) => {
    setFaculty(prev => [profile, ...prev]);
  };

  const updateFaculty = (id: string, updates: Partial<FacultyProfile>) => {
    setFaculty(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  return { faculty, setFaculty, addFaculty, updateFaculty, deleteFaculty };
}
