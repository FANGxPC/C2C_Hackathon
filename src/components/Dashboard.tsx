import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Star, TrendingUp, Target, Sparkles, Quote } from 'lucide-react';

const motivationalQuotes = [
  {
    quote: "Every expert was once a beginner. Every pro was once an amateur.",
    author: "Robin Sharma",
    icon: Star,
    gradient: "from-blue-50 to-blue-100/60"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs", 
    icon: Sparkles,
    gradient: "from-blue-100/40 to-blue-50"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    icon: TrendingUp,
    gradient: "from-blue-50 to-blue-200/30"
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    icon: Quote,
    gradient: "from-blue-100/50 to-blue-50"
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    icon: Star,
    gradient: "from-blue-50/80 to-blue-100/40"
  }
];

const dailyGoal = {
  title: "Today's Focus",
  description: "Master the fundamentals, one step at a time",
  progress: 65,
  icon: Target
};

export const Dashboard: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Auto-slide quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === motivationalQuotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = motivationalQuotes[currentQuoteIndex];
  const IconComponent = currentQuote.icon;

  return (
    <div className="p-6 space-y-8 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold text-foreground">Hi Sadique 👋, here's your progress today.</h1>
        <p className="text-muted-foreground">Welcome back to StudentConnect. Continue your learning journey.</p>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Daily Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="shadow-sm animate-card-hover bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/30">
            <CardContent className="p-6 bg-[rgba(195,233,255,0)]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <dailyGoal.icon className="h-6 w-6 text-primary animate-icon" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{dailyGoal.title}</h3>
                  <p className="text-sm text-muted-foreground">{dailyGoal.description}</p>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-medium">{dailyGoal.progress}%</span>
                  </div>
                  <Progress value={dailyGoal.progress} className="h-2 animate-progress-fill" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inspirational Quote Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="shadow-sm animate-card-hover">
            <CardContent className="p-6">
              <div className="relative h-32 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuoteIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className={`w-full p-6 rounded-xl bg-gradient-to-br ${currentQuote.gradient} animate-card-hover cursor-pointer`}
                  >
                    <div className="flex flex-col space-y-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <IconComponent className="h-5 w-5 text-primary animate-icon" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Daily Inspiration</span>
                      </div>
                      <blockquote className="text-lg text-foreground leading-relaxed font-medium">
                        "{currentQuote.quote}"
                      </blockquote>
                      <cite className="text-sm text-muted-foreground not-italic">
                        — {currentQuote.author}
                      </cite>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Quote indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {motivationalQuotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuoteIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentQuoteIndex 
                          ? 'bg-primary scale-125' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-sm animate-card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Data Structures & Algorithms</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2 animate-progress-fill" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">System Design</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2 animate-progress-fill" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Machine Learning</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <Progress value={40} className="h-2 animate-progress-fill" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          <Card className="shadow-sm animate-card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Today's Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Study Time</span>
                <span className="text-sm font-medium text-primary">2.5 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Problems Solved</span>
                <span className="text-sm font-medium text-primary">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Study Streak</span>
                <span className="text-sm font-medium text-primary">12 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm animate-card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg animate-card-hover cursor-pointer">
                  <p className="text-sm text-foreground">Focus on Dynamic Programming concepts today</p>
                </div>
                <div className="p-3 bg-muted rounded-lg animate-card-hover cursor-pointer">
                  <p className="text-sm text-foreground">Review Binary Trees and Graph algorithms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="shadow-sm animate-card-hover">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-card-hover cursor-pointer">
                <div className="w-2 h-2 bg-primary rounded-full animate-badge-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Completed Binary Search practice</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-card-hover cursor-pointer">
                <div className="w-2 h-2 bg-accent rounded-full animate-badge-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Joined Study Group: System Design</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-card-hover cursor-pointer">
                <div className="w-2 h-2 bg-secondary rounded-full animate-badge-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">AI generated study plan for ML</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;