import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FacultyProfile } from '@/types';

function mapRow(row: any): FacultyProfile {
  return {
    id: row.id,
    userId: row.user_id || '',
    name: row.name,
    email: row.email,
    department: row.department,
    designation: row.designation,
    qualification: row.qualification,
    experience: row.experience,
    specialization: row.specialization || [],
    joiningDate: row.joining_date,
    status: row.status as 'active' | 'inactive' | 'on-leave',
    avatar: row.avatar || undefined,
    coursesAssigned: row.courses_assigned || [],
    averageRating: 0,
    totalFeedbacks: 0,
  };
}

export function useFacultyStore() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = useCallback(async () => {
    const { data, error } = await supabase
      .from('faculty_profiles')
      .select('*')
      .order('name');
    if (!error && data) {
      setFaculty(data.map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFaculty();

    const channel = supabase
      .channel('faculty_profiles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faculty_profiles' }, () => {
        fetchFaculty();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchFaculty]);

  const addFaculty = async (profile: FacultyProfile) => {
    const { error } = await supabase.from('faculty_profiles').insert({
      name: profile.name,
      email: profile.email,
      department: profile.department,
      designation: profile.designation,
      qualification: profile.qualification,
      experience: profile.experience,
      specialization: profile.specialization,
      joining_date: profile.joiningDate,
      status: profile.status,
      courses_assigned: profile.coursesAssigned,
      avatar: profile.avatar || null,
    });
    if (!error) await fetchFaculty();
    return !error;
  };

  const updateFaculty = async (id: string, updates: Partial<FacultyProfile>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.designation !== undefined) dbUpdates.designation = updates.designation;
    if (updates.qualification !== undefined) dbUpdates.qualification = updates.qualification;
    if (updates.experience !== undefined) dbUpdates.experience = updates.experience;
    if (updates.specialization !== undefined) dbUpdates.specialization = updates.specialization;
    if (updates.coursesAssigned !== undefined) dbUpdates.courses_assigned = updates.coursesAssigned;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;

    const { error } = await supabase.from('faculty_profiles').update(dbUpdates).eq('id', id);
    if (!error) await fetchFaculty();
    return !error;
  };

  const deleteFaculty = async (id: string) => {
    const { error } = await supabase.from('faculty_profiles').delete().eq('id', id);
    if (!error) await fetchFaculty();
    return !error;
  };

  return { faculty, loading, setFaculty, addFaculty, updateFaculty, deleteFaculty, refetch: fetchFaculty };
}
