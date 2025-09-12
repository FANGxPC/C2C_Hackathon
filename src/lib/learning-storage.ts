import { LearningData, Task, LearningSession, LearningMetrics, WeeklyStats } from '../types/learning';

const STORAGE_KEYS = {
  LEARNING_DATA: 'studentconnect_learning_data',
  TASKS: 'studentconnect_tasks',
  SESSIONS: 'studentconnect_sessions',
  METRICS: 'studentconnect_metrics',
  WEEKLY_STATS: 'studentconnect_weekly_stats'
};

class LearningStorage {
  // Generic storage methods
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  // Tasks
  getTasks(): Task[] {
    return this.getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  }

  setTasks(tasks: Task[]): void {
    this.setToStorage(STORAGE_KEYS.TASKS, tasks);
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setTasks(tasks);
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.setTasks(filteredTasks);
  }

  // Learning Sessions
  getSessions(): LearningSession[] {
    return this.getFromStorage<LearningSession[]>(STORAGE_KEYS.SESSIONS, []);
  }

  setSessions(sessions: LearningSession[]): void {
    this.setToStorage(STORAGE_KEYS.SESSIONS, sessions);
  }

  addSession(session: LearningSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.setSessions(sessions);
  }

  // Metrics
  getMetrics(): LearningMetrics | null {
    const metrics = this.getFromStorage<LearningMetrics | null>(STORAGE_KEYS.METRICS, null);
    return metrics;
  }

  setMetrics(metrics: LearningMetrics): void {
    this.setToStorage(STORAGE_KEYS.METRICS, metrics);
  }

  // Weekly Stats
  getWeeklyStats(): WeeklyStats[] {
    return this.getFromStorage<WeeklyStats[]>(STORAGE_KEYS.WEEKLY_STATS, []);
  }

  setWeeklyStats(stats: WeeklyStats[]): void {
    this.setToStorage(STORAGE_KEYS.WEEKLY_STATS, stats);
  }

  // Complete learning data
  getLearningData(): LearningData {
    const metrics = this.getMetrics() || this.getDefaultMetrics();
    const tasks = this.getTasks();
    const sessions = this.getSessions();
    const weeklyStats = this.getWeeklyStats().length > 0 ? this.getWeeklyStats() : this.getDefaultWeeklyStats();

    return {
      metrics,
      tasks,
      sessions,
      weeklyStats
    };
  }

  setLearningData(data: LearningData): void {
    this.setMetrics(data.metrics);
    this.setTasks(data.tasks);
    this.setSessions(data.sessions);
    this.setWeeklyStats(data.weeklyStats);
  }

  // Default data generators
  private getDefaultMetrics(): LearningMetrics {
    const today = new Date().toISOString().split('T')[0];
    return {
      id: 'default-metrics',
      date: today,
      studyHours: 4.5,
      problemsSolved: 12,
      projectsBuilt: 2,
      topicsCovered: ['Binary Trees', 'Process Scheduling', 'Linear Regression'],
      todayStudyTime: 270, // 4.5 hours in minutes
      streakDays: 12,
      weeklyGoalProgress: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private getDefaultWeeklyStats(): WeeklyStats[] {
    const today = new Date();
    const stats: WeeklyStats[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      
      // Generate some sample data
      const hours = Math.floor(Math.random() * 5) + 3; // 3-8 hours
      const completed = Math.floor(Math.random() * 6) + 4; // 4-10 tasks
      
      stats.push({
        day: dayName,
        hours,
        completed,
        date: date.toISOString().split('T')[0]
      });
    }
    
    return stats;
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const learningStorage = new LearningStorage();