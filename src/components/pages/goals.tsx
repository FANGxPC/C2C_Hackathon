import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Filter,
  Edit,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { apiClient } from '../../utils/supabase/client';
import { useAuth } from '../auth-provider';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  due_date: string | null;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    due_date?: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface GoalsProps {
  onNavigate: (page: string) => void;
}

export function Goals({ onNavigate }: GoalsProps) {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('active');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [createLoading, setCreateLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    due_date: ''
  });

  // Load goals on component mount
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getGoals();
      setGoals(response.goals || []);
    } catch (err) {
      console.error('Failed to load goals:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!formData.title.trim() || !formData.category || !formData.priority) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreateLoading(true);
      setError('');
      
      const goalData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        milestones: []
      };

      const response = await apiClient.createGoal(goalData);
      
      // Add the new goal to the list
      setGoals(prev => [response.goal, ...prev]);
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        due_date: ''
      });
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
      setError('Failed to create goal. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await apiClient.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      setError('Failed to delete goal. Please try again.');
    }
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    try {
      const response = await apiClient.updateGoalProgress(goalId, newProgress);
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? response.goal : goal
      ));
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Failed to update progress. Please try again.');
    }
  };

  // Mock data for backwards compatibility - remove this section
  const mockGoals = [
    // This section will be removed once we're using real data
  ];

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  const priorityColors = {
    high: 'bg-[var(--error)]/10 text-[var(--error)]',
    medium: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    low: 'bg-[var(--success)]/10 text-[var(--success)]'
  };

  const categoryColors = {
    Academic: 'bg-blue-100 text-blue-700',
    Study: 'bg-green-100 text-green-700',
    Career: 'bg-purple-100 text-purple-700',
    Personal: 'bg-orange-100 text-orange-700'
  };

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const completedMilestones = goal.milestones.filter(milestone => milestone.completed).length;
    const totalMilestones = goal.milestones.length;
    const daysUntilDue = goal.due_date 
      ? Math.ceil((new Date(goal.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      : null;
    
    return (
      <Card className="border-[var(--border)] hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-[var(--text-primary)] mb-2">{goal.title}</CardTitle>
              <p className="text-sm text-[var(--text-muted)] mb-3">{goal.description}</p>
              
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={priorityColors[goal.priority as keyof typeof priorityColors]}>
                  {goal.priority} priority
                </Badge>
                <Badge className={categoryColors[goal.category as keyof typeof categoryColors]}>
                  {goal.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDeleteGoal(goal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Progress</span>
                <span className="text-[var(--text-primary)] font-medium">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--text-muted)]">Milestones</span>
                <span className="text-sm text-[var(--text-primary)]">{completedMilestones}/{totalMilestones}</span>
              </div>
              {goal.milestones.length > 0 ? (
                <div className="space-y-2">
                  {goal.milestones.slice(0, 3).map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-2">
                      {milestone.completed ? (
                        <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--text-muted)]" />
                      )}
                      <span className={`text-sm ${
                        milestone.completed 
                          ? 'text-[var(--text-muted)] line-through' 
                          : 'text-[var(--text-primary)]'
                      }`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                  {goal.milestones.length > 3 && (
                    <p className="text-xs text-[var(--text-muted)] ml-6">
                      +{goal.milestones.length - 3} more milestones
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] italic">No milestones set</p>
              )}
            </div>

            {/* Due date */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-[var(--text-muted)]">
                <Clock className="h-4 w-4 mr-1" />
                {daysUntilDue !== null ? (
                  daysUntilDue > 0 ? (
                    <span>Due in {daysUntilDue} days</span>
                  ) : daysUntilDue === 0 ? (
                    <span className="text-[var(--warning)]">Due today</span>
                  ) : (
                    <span className="text-[var(--error)]">Overdue by {Math.abs(daysUntilDue)} days</span>
                  )
                ) : (
                  <span>No due date set</span>
                )}
              </div>
              
              <div className="flex items-center text-[var(--brand-accent)]">
                <Award className="h-4 w-4 mr-1" />
                <span>{goal.status === 'completed' ? 'Completed' : 'In Progress'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  const newProgress = prompt('Enter progress (0-100):', goal.progress.toString());
                  if (newProgress !== null) {
                    const progress = parseInt(newProgress);
                    if (!isNaN(progress) && progress >= 0 && progress <= 100) {
                      handleUpdateProgress(goal.id, progress);
                    }
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Update Progress
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate stats from real data
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  const stats = [
    {
      title: "Active Goals",
      value: activeGoals.length.toString(),
      change: `${goals.length} total`,
      icon: Target,
      color: "text-[var(--brand-primary)]"
    },
    {
      title: "Completed Goals",
      value: completedGoals.length.toString(),
      change: `${Math.round((completedGoals.length / Math.max(goals.length, 1)) * 100)}% complete`,
      icon: CheckCircle,
      color: "text-[var(--success)]"
    },
    {
      title: "Average Progress",
      value: `${totalProgress}%`,
      change: "Across all goals",
      icon: TrendingUp,
      color: "text-[var(--brand-accent)]"
    },
    {
      title: "Total Goals",
      value: goals.length.toString(),
      change: "Keep growing!",
      icon: Award,
      color: "text-[var(--warning)]"
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--brand-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Loading Goals</h2>
          <p className="text-[var(--text-muted)]">Fetching your goals and progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Goals</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Track your progress and achieve your academic objectives
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to track your progress and stay motivated.
              </DialogDescription>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Goal Title *</label>
                <Input 
                  placeholder="e.g., Complete Calculus Course" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  disabled={createLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea 
                  placeholder="Describe your goal and what you want to achieve..." 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={createLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority *</label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                    disabled={createLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={createLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date (Optional)</label>
                <Input 
                  type="date" 
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  disabled={createLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGoal}
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Goal'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[var(--border)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">{stat.value}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-[var(--muted)] ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goals Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value="active" className="mt-6">
          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Active Goals</h3>
              <p className="text-[var(--text-muted)] mb-4">Create your first goal to start tracking your progress!</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Completed Goals Yet</h3>
              <p className="text-[var(--text-muted)]">Keep working on your active goals to see completed ones here!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}