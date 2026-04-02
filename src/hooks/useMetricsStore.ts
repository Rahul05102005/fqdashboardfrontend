import { create } from 'zustand';
import axios from 'axios';
import { InstructionalMetric } from '@/types';

interface MetricsState {
  metrics: InstructionalMetric[];
  isLoading: boolean;
  error: string | null;
  fetchMetricsByFaculty: (facultyId: string) => Promise<void>;
  clearMetrics: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: [],
  isLoading: false,
  error: null,
  fetchMetricsByFaculty: async (facultyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/metrics/faculty/${facultyId}`);
      // Normalize _id to id for the frontend
      const data = (response.data || []).map((m: any) => ({ ...m, id: m._id }));
      set({ metrics: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  clearMetrics: () => set({ metrics: [], error: null }),
}));
