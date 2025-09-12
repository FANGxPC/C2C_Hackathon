export interface LearningMetrics {
  id: string;
  userId?: string;
  date: string; // ISO date string
  studyHours: number;
  problemsSolved: number;
  projectsBuilt: number;
  topicsCovered: string[];
  todayStudyTime: number; // in minutes
  streakDays: number;
  weeklyGoalProgress: number; // percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  userId?: string;
}

export interface LearningSession {
  id: string;
  time: string;
  topic: string;
  subject: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'planned';
  notes: string;
  date: string;
  userId?: string;
}

export interface WeeklyStats {
  day: string;
  hours: number;
  completed: number;
  date: string;
}

export interface LearningData {
  metrics: LearningMetrics;
  tasks: Task[];
  sessions: LearningSession[];
  weeklyStats: WeeklyStats[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}