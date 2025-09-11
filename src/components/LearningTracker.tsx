import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar as CalendarIcon, Clock, BookOpen, Target, TrendingUp, Brain, CheckCircle } from 'lucide-react';

const LearningTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const todayLearning = [
    {
      id: '1',
      time: '9:00 AM',
      topic: 'Binary Trees',
      subject: 'Data Structures',
      duration: '2 hours',
      status: 'completed',
      notes: 'Covered tree traversal algorithms: inorder, preorder, postorder. Practiced 5 problems on LeetCode.',
      aiSummary: 'Mastered basic tree traversal concepts. Ready to move to advanced tree problems like BST validation and tree construction.'
    },
    {
      id: '2',
      time: '11:30 AM',
      topic: 'Process Scheduling',
      subject: 'Operating Systems',
      duration: '1.5 hours',
      status: 'completed',
      notes: 'Studied FCFS, SJF, Round Robin algorithms. Solved numerical problems on waiting time calculations.',
      aiSummary: 'Good understanding of basic scheduling algorithms. Recommend practicing more complex scenarios with priority scheduling.'
    },
    {
      id: '3',
      time: '2:00 PM',
      topic: 'Linear Regression',
      subject: 'Machine Learning',
      duration: '1 hour',
      status: 'in-progress',
      notes: 'Started with simple linear regression. Need to complete gradient descent implementation.',
      aiSummary: 'Strong mathematical foundation observed. Focus on implementing cost function optimization next.'
    },
    {
      id: '4',
      time: '4:00 PM',
      topic: 'System Design Basics',
      subject: 'System Design',
      duration: '2 hours',
      status: 'planned',
      notes: 'Plan to cover scalability principles and load balancing concepts.',
      aiSummary: 'This topic builds on your networking knowledge. Prepare by reviewing client-server architecture.'
    }
  ];

  const weeklyStats = [
    { day: 'Mon', hours: 6, completed: 8 },
    { day: 'Tue', hours: 4, completed: 5 },
    { day: 'Wed', hours: 5, completed: 7 },
    { day: 'Thu', hours: 7, completed: 9 },
    { day: 'Fri', hours: 3, completed: 4 },
    { day: 'Sat', hours: 8, completed: 12 },
    { day: 'Sun', hours: 5, completed: 6 }
  ];

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
        <p className="text-muted-foreground">Track your daily learning progress and get AI-powered insights</p>
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
                <p className="text-2xl font-semibold text-foreground">4.5 hrs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm animate-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/60 rounded-lg transition-transform duration-300 hover:scale-110">
                <BookOpen className="h-5 w-5 text-secondary-foreground animate-icon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Covered</p>
                <p className="text-2xl font-semibold text-foreground">3</p>
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
                <p className="text-2xl font-semibold text-foreground">75%</p>
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
                <p className="text-2xl font-semibold text-foreground">12 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Today's Learning Journey</CardTitle>
                <Badge variant="outline" className="border-border">
                  {new Date().toLocaleDateString()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayLearning.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                      expandedCard === session.id ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
                    }`}
                    onClick={() => setExpandedCard(expandedCard === session.id ? null : session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          session.status === 'completed' 
                            ? 'bg-primary/10 text-primary' 
                            : session.status === 'in-progress'
                            ? 'bg-accent/30 text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {session.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-foreground">{session.topic}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {session.subject}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <span>{session.time}</span>
                            <span>{session.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={session.status === 'completed' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {session.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {expandedCard === session.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border space-y-3"
                        >
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Study Notes</h4>
                            <p className="text-sm text-muted-foreground">{session.notes}</p>
                          </div>
                          <div className="bg-primary/5 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <h4 className="font-medium text-foreground">AI Insights</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.aiSummary}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
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