import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Progress } from './ui/progress';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarIcon, Clock, BookOpen, Target, TrendingUp, CheckCircle, Plus, Check } from 'lucide-react';
import { useLearningData } from '../hooks/useLearningData';
import { CreateTaskRequest } from '../types/learning';

export const LearningTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'medium',
    category: ''
  });

  const {
    tasks,
    sessions,
    metrics,
    weeklyStats,
    createTask,
    markTaskComplete,
    markTaskIncomplete,
    deleteTask,
    tasksLoading,
    error
  } = useLearningData();

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      await createTask(newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: ''
      });
      setIsAddTaskOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await markTaskIncomplete(taskId);
      } else {
        await markTaskComplete(taskId);
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.createdAt).toDateString();
    return taskDate === today || !task.completed;
  });

  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);

  return (
    <div className="p-6 space-y-8 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold text-foreground">Learning Tracker</h1>
        <p className="text-muted-foreground">Track your daily learning progress and manage your tasks</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-card border-border shadow-sm animate-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg transition-transform duration-300 hover:scale-110">
                <Clock className="h-5 w-5 text-primary animate-icon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Study Time</p>
                <p className="text-2xl font-semibold text-foreground">{metrics?.studyHours?.toFixed(1) || '0'} hrs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm animate-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/60 rounded-lg transition-transform duration-300 hover:scale-110">
                <CheckCircle className="h-5 w-5 text-secondary-foreground animate-icon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-semibold text-foreground">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm animate-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/30 rounded-lg transition-transform duration-300 hover:scale-110">
                <Target className="h-5 w-5 text-accent-foreground animate-icon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-2xl font-semibold text-foreground">{metrics?.weeklyGoalProgress || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm animate-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-muted rounded-lg transition-transform duration-300 hover:scale-110">
                <TrendingUp className="h-5 w-5 text-muted-foreground animate-icon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-semibold text-foreground">{metrics?.streakDays || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Management */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Today's Tasks</CardTitle>
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="animate-button-hover">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task to track your learning progress. Fill in the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Enter task title..."
                          value={newTask.title}
                          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Enter task description..."
                          value={newTask.description || ''}
                          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Priority</label>
                          <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <Input
                            placeholder="e.g., Study, Project"
                            value={newTask.category || ''}
                            onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask} disabled={!newTask.title.trim() || tasksLoading}>
                          {tasksLoading ? 'Adding...' : 'Add Task'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                
                {pendingTasks.length === 0 && completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-3 bg-muted/20 rounded-lg inline-block mb-4">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No tasks yet. Add your first task to get started!</p>
                  </div>
                ) : (
                  <>
                    {pendingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="border border-border rounded-lg p-4 transition-all duration-300 bg-card hover:bg-muted/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="p-1 h-6 w-6 mt-1"
                              onClick={() => handleToggleTask(task.id, task.completed)}
                              disabled={tasksLoading}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-foreground">{task.title}</h3>
                                {task.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {task.category}
                                  </Badge>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span className="capitalize">Priority: {task.priority}</span>
                                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-6 w-6 text-muted-foreground hover:text-primary"
                              onClick={() => handleToggleTask(task.id, task.completed)}
                              disabled={tasksLoading}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {completedTasks.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 pt-4">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-sm text-muted-foreground px-3">Completed Tasks</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        
                        {completedTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="border border-border rounded-lg p-4 transition-all duration-300 bg-muted/20 opacity-75"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="p-1 h-6 w-6 mt-1 bg-primary"
                                  onClick={() => handleToggleTask(task.id, task.completed)}
                                  disabled={tasksLoading}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium text-foreground line-through">{task.title}</h3>
                                    {task.category && (
                                      <Badge variant="secondary" className="text-xs">
                                        {task.category}
                                      </Badge>
                                    )}
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                    <span>Completed: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Today'}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 h-6 w-6 text-muted-foreground hover:text-secondary-foreground"
                                onClick={() => handleToggleTask(task.id, task.completed)}
                                disabled={tasksLoading}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Calendar and Weekly Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-border"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyStats.map((stat, index) => (
                    <div key={stat.day} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{stat.day}</span>
                        <span className="text-muted-foreground">{stat.hours}h / {stat.completed} tasks</span>
                      </div>
                      <Progress 
                        value={(stat.hours / 8) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearningTracker;