import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

export interface ActiveProjectSummary {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  completedTasks: number;
  progressPct: number;
}

export interface DashboardSummaryData {
  range: string;
  totalProjects: number;
  projectsInProgress: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
  completedPct: number;
  inProgressPct: number;
  pendingPct: number;
  urgentTasks: number;
  dueThisWeek: number;
  activeProjects: ActiveProjectSummary[];
}

export const useDashboardSummary = (range: 'this_week' | 'this_month' | 'this_quarter' = 'this_quarter') => {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: DashboardSummaryData }>(
        `/dashboard/summary?range=${range}`
      );
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('Failed to load dashboard metrics.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Error connecting to database API';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    data,
    loading,
    error,
    refetch: fetchSummary,
  };
};

export default useDashboardSummary;
