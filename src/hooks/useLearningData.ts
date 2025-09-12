import { useState, useEffect, useCallback } from 'react';
import { Task, LearningSession, LearningMetrics, CreateTaskRequest, UpdateTaskRequest, WeeklyStats } from '../types/learning';
import { learningDataService } from '../lib/learning-data';

interface UseLearningDataReturn {
  // Data
  tasks: Task[];
  sessions: LearningSession[];
  metrics: LearningMetrics | null;
  weeklyStats: WeeklyStats[];
  
  // Loading states
  loading: boolean;
  tasksLoading: boolean;
  metricsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Task actions
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markTaskComplete: (taskId: string) => Promise<void>;
  markTaskIncomplete: (taskId: string) => Promise<void>;
  
  // Session actions
  createSession: (sessionData: Omit<LearningSession, 'id'>) => Promise<void>;
  
  // Metrics actions
  updateMetrics: (updates: Partial<LearningMetrics>) => Promise<void>;
  refreshMetrics: () => Promise<void>;
  
  // Utility actions
  refresh: () => Promise<void>;
}

export const useLearningData = (): UseLearningDataReturn => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, sessionsData, metricsData, weeklyStatsData] = await Promise.all([
        learningDataService.getTasks(),
        learningDataService.getSessions(),
        learningDataService.getMetrics(),
        learningDataService.getWeeklyStats()
      ]);
      
      setTasks(tasksData);
      setSessions(sessionsData);
      setMetrics(metricsData);
      setWeeklyStats(weeklyStatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load learning data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Task actions
  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setTasksLoading(true);
      setError(null);
      const newTask = await learningDataService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (updates: UpdateTaskRequest) => {
    try {
      setTasksLoading(true);
      setError(null);
      const updatedTask = await learningDataService.updateTask(updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === updates.id ? updatedTask : task
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setTasksLoading(true);
      setError(null);
      await learningDataService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const markTaskComplete = useCallback(async (taskId: string) => {
    try {
      setTasksLoading(true);
      setError(null);
      const updatedTask = await learningDataService.markTaskComplete(taskId);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        // Update daily progress when a task is completed
        await learningDataService.updateDailyProgress();
        // Refresh metrics and weekly stats
        try {
          const [metricsData, weeklyStatsData] = await Promise.all([
            learningDataService.getMetrics(),
            learningDataService.getWeeklyStats()
          ]);
          setMetrics(metricsData);
          setWeeklyStats(weeklyStatsData);
        } catch (refreshError) {
          console.error('Failed to refresh data:', refreshError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task as complete');
      throw err;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const markTaskIncomplete = useCallback(async (taskId: string) => {
    try {
      setTasksLoading(true);
      setError(null);
      const updatedTask = await learningDataService.markTaskIncomplete(taskId);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        // Update daily progress when a task is marked incomplete
        await learningDataService.updateDailyProgress();
        // Refresh metrics and weekly stats
        try {
          const [metricsData, weeklyStatsData] = await Promise.all([
            learningDataService.getMetrics(),
            learningDataService.getWeeklyStats()
          ]);
          setMetrics(metricsData);
          setWeeklyStats(weeklyStatsData);
        } catch (refreshError) {
          console.error('Failed to refresh data:', refreshError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task as incomplete');
      throw err;
    } finally {
      setTasksLoading(false);
    }
  }, []);

  // Session actions
  const createSession = useCallback(async (sessionData: Omit<LearningSession, 'id'>) => {
    try {
      setError(null);
      const newSession = await learningDataService.createSession(sessionData);
      setSessions(prev => [...prev, newSession]);
      // Update daily progress when a session is added
      await learningDataService.updateDailyProgress();
      // Refresh metrics and weekly stats
      try {
        const [metricsData, weeklyStatsData] = await Promise.all([
          learningDataService.getMetrics(),
          learningDataService.getWeeklyStats()
        ]);
        setMetrics(metricsData);
        setWeeklyStats(weeklyStatsData);
      } catch (refreshError) {
        console.error('Failed to refresh data:', refreshError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      throw err;
    }
  }, []);

  // Metrics actions
  const updateMetrics = useCallback(async (updates: Partial<LearningMetrics>) => {
    try {
      setMetricsLoading(true);
      setError(null);
      const updatedMetrics = await learningDataService.updateMetrics(updates);
      setMetrics(updatedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update metrics');
      throw err;
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const refreshMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      const metricsData = await learningDataService.getMetrics();
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh metrics');
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Utility actions
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    // Data
    tasks,
    sessions,
    metrics,
    weeklyStats,
    
    // Loading states
    loading,
    tasksLoading,
    metricsLoading,
    
    // Error state
    error,
    
    // Task actions
    createTask,
    updateTask,
    deleteTask,
    markTaskComplete,
    markTaskIncomplete,
    
    // Session actions
    createSession,
    
    // Metrics actions
    updateMetrics,
    refreshMetrics,
    
    // Utility actions
    refresh
  };
};