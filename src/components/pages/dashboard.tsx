import React from 'react';
import { 
  BookOpen, 
  Target, 
  Users, 
  Calendar,
  Clock,
  Award,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { stats, recentGoals, recentMaterials, upcomingEvents } from '../../mock/data';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-[var(--text-muted)]">
          Here's what's happening with your studies today.
        </p>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--text-primary)]">Active Goals</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('goals')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentGoals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[var(--text-primary)]">{goal.title}</h4>
                  <Badge 
                    variant="secondary"
                    className={`${
                      goal.priority === 'high' ? 'bg-[var(--error)]/10 text-[var(--error)]' :
                      goal.priority === 'medium' ? 'bg-[var(--warning)]/10 text-[var(--warning)]' :
                      'bg-[var(--success)]/10 text-[var(--success)]'
                    }`}
                  >
                    {goal.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Progress</span>
                    <span className="text-[var(--text-primary)]">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-sm text-[var(--text-muted)] flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Due {goal.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-lg bg-[var(--muted)]">
                <h5 className="font-medium text-[var(--text-primary)] mb-1">{event.title}</h5>
                <p className="text-sm text-[var(--text-muted)] mb-2">{event.time}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {event.type}
                  </Badge>
                  <span className="text-xs text-[var(--text-muted)] flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {event.participants}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Materials */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--text-primary)]">Recent Materials</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('materials')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMaterials.map((material) => (
              <div key={material.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[var(--muted)] cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[var(--brand-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-[var(--text-primary)] truncate">{material.title}</h5>
                  <p className="text-sm text-[var(--text-muted)]">
                    {material.subject} • by {material.uploadedBy}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {material.type}
                  </Badge>
                  <p className="text-xs text-[var(--text-muted)]">{material.uploadedAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('materials')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('goals')}
            >
              <Target className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('groups')}
            >
              <Users className="h-4 w-4 mr-2" />
              Join Study Group
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('chat')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}