import { Task, LearningSession, LearningMetrics, CreateTaskRequest, UpdateTaskRequest, WeeklyStats } from '../types/learning';
import { learningStorage } from './learning-storage';

class LearningDataService {
  // Task management
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      priority: taskData.priority || 'medium',
      category: taskData.category,
      userId: 'current-user' // This would come from auth context in a real app
    };

    learningStorage.addTask(newTask);
    return newTask;
  }

  async updateTask(updates: UpdateTaskRequest): Promise<Task | null> {
    const tasks = learningStorage.getTasks();
    const existingTask = tasks.find(task => task.id === updates.id);
    
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedFields: Partial<Task> = {};
    
    if (updates.title !== undefined) updatedFields.title = updates.title;
    if (updates.description !== undefined) updatedFields.description = updates.description;
    if (updates.completed !== undefined) {
      updatedFields.completed = updates.completed;
      if (updates.completed) {
        updatedFields.completedAt = new Date();
      } else {
        updatedFields.completedAt = undefined;
      }
    }
    if (updates.dueDate !== undefined) {
      updatedFields.dueDate = updates.dueDate ? new Date(updates.dueDate) : undefined;
    }
    if (updates.priority !== undefined) updatedFields.priority = updates.priority;
    if (updates.category !== undefined) updatedFields.category = updates.category;

    learningStorage.updateTask(updates.id, updatedFields);
    
    // Return updated task
    const updatedTasks = learningStorage.getTasks();
    return updatedTasks.find(task => task.id === updates.id) || null;
  }

  async deleteTask(taskId: string): Promise<void> {
    learningStorage.deleteTask(taskId);
  }

  async getTasks(): Promise<Task[]> {
    return learningStorage.getTasks();
  }

  async getTask(taskId: string): Promise<Task | null> {
    const tasks = learningStorage.getTasks();
    return tasks.find(task => task.id === taskId) || null;
  }

  async markTaskComplete(taskId: string): Promise<Task | null> {
    return this.updateTask({ id: taskId, completed: true });
  }

  async markTaskIncomplete(taskId: string): Promise<Task | null> {
    return this.updateTask({ id: taskId, completed: false });
  }

  // Learning sessions
  async createSession(sessionData: Omit<LearningSession, 'id'>): Promise<LearningSession> {
    const newSession: LearningSession = {
      id: this.generateId(),
      ...sessionData,
      userId: 'current-user'
    };

    learningStorage.addSession(newSession);
    return newSession;
  }

  async getSessions(): Promise<LearningSession[]> {
    return learningStorage.getSessions();
  }

  async getTodaySessions(): Promise<LearningSession[]> {
    const sessions = learningStorage.getSessions();
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date === today);
  }

  // Metrics
  async getMetrics(): Promise<LearningMetrics> {
    const metrics = learningStorage.getMetrics();
    if (!metrics) {
      // Create default metrics if none exist
      const defaultMetrics = this.createDefaultMetrics();
      learningStorage.setMetrics(defaultMetrics);
      return defaultMetrics;
    }
    return metrics;
  }

  async updateMetrics(updates: Partial<LearningMetrics>): Promise<LearningMetrics> {
    const currentMetrics = await this.getMetrics();
    const updatedMetrics = {
      ...currentMetrics,
      ...updates,
      updatedAt: new Date()
    };
    
    learningStorage.setMetrics(updatedMetrics);
    return updatedMetrics;
  }

  // Statistics
  async getWeeklyStats(): Promise<WeeklyStats[]> {
    const stats = learningStorage.getWeeklyStats();
    // If no stats exist, create default ones
    if (stats.length === 0) {
      const defaultStats = await this.createDefaultWeeklyStats();
      learningStorage.setWeeklyStats(defaultStats);
      return defaultStats;
    }
    return stats;
  }

  async updateDailyProgress(): Promise<void> {
    const tasks = await this.getTasks();
    const sessions = await this.getTodaySessions();
    const todayCompletedTasks = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      this.isToday(task.completedAt)
    ).length;

    const todayStudyTime = sessions.reduce((total, session) => {
      if (session.status === 'completed') {
        // Parse duration like "2 hours", "1.5 hours", "30 minutes"
        const duration = this.parseDuration(session.duration);
        return total + duration;
      }
      return total;
    }, 0);

    const metrics = await this.getMetrics();
    await this.updateMetrics({
      studyHours: todayStudyTime / 60, // Convert minutes to hours
      todayStudyTime,
      problemsSolved: todayCompletedTasks,
      topicsCovered: sessions.map(s => s.topic).filter((topic, index, arr) => arr.indexOf(topic) === index)
    });

    // Update today's entry in weekly stats
    await this.updateTodayWeeklyStats(todayStudyTime / 60, todayCompletedTasks);
  }

  async updateTodayWeeklyStats(hours: number, completed: number): Promise<void> {
    const stats = await this.getWeeklyStats();
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    
    // Find today's entry and update it
    const updatedStats = stats.map(stat => {
      if (stat.date === todayDateString) {
        return {
          ...stat,
          hours: Math.max(0, Math.round(hours * 10) / 10), // Round to 1 decimal
          completed
        };
      }
      return stat;
    });
    
    learningStorage.setWeeklyStats(updatedStats);
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
  }

  private parseDuration(duration: string): number {
    // Parse strings like "2 hours", "1.5 hours", "30 minutes"
    const hourMatch = duration.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/i);
    const minuteMatch = duration.match(/(\d+)\s*(?:minute|min)/i);
    
    let totalMinutes = 0;
    
    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60;
    }
    
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1]);
    }
    
    return totalMinutes || 0;
  }

  private createDefaultMetrics(): LearningMetrics {
    const today = new Date().toISOString().split('T')[0];
    return {
      id: this.generateId(),
      userId: 'current-user',
      date: today,
      studyHours: 4.5,
      problemsSolved: 12,
      projectsBuilt: 2,
      topicsCovered: ['Binary Trees', 'Process Scheduling', 'Linear Regression'],
      todayStudyTime: 270,
      streakDays: 12,
      weeklyGoalProgress: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private async createDefaultWeeklyStats(): Promise<WeeklyStats[]> {
    const today = new Date();
    const stats: WeeklyStats[] = [];
    
    // Get today's actual data
    const tasks = await this.getTasks();
    const sessions = await this.getTodaySessions();
    const todayCompletedTasks = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      this.isToday(task.completedAt)
    ).length;

    const todayStudyTime = sessions.reduce((total, session) => {
      if (session.status === 'completed') {
        const duration = this.parseDuration(session.duration);
        return total + duration;
      }
      return total;
    }, 0) / 60; // Convert to hours
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      const isToday = this.isToday(date);
      
      if (isToday) {
        // Use actual data for today
        stats.push({
          day: dayName,
          hours: Math.max(0, Math.round(todayStudyTime * 10) / 10), // Round to 1 decimal
          completed: todayCompletedTasks,
          date: date.toISOString().split('T')[0]
        });
      } else {
        // Generate mock data for other days
        const hours = Math.floor(Math.random() * 3) + 3; // 3-6 hours
        const completed = Math.floor(Math.random() * 4) + 2; // 2-6 tasks
        
        stats.push({
          day: dayName,
          hours,
          completed,
          date: date.toISOString().split('T')[0]
        });
      }
    }
    
    return stats;
  }
}

export const learningDataService = new LearningDataService();