import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  Target, 
  TrendingUp,
  Edit3,
  Github,
  Linkedin,
  ExternalLink
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: 'Fang',
    title: 'Computer Science Student',
    university: 'Stanford University',
    year: 'Junior (3rd Year)',
    email: 'fang.li@stanford.edu',
    phone: '+1 (555) 123-4567',
    location: 'Palo Alto, CA',
    joinDate: 'September 2023',
    bio: 'Passionate computer science student with interests in machine learning, software engineering, and system design. Actively preparing for software engineering internships and contributing to open source projects.',
    avatar: '',
    skills: [
      { name: 'Python', level: 85 },
      { name: 'JavaScript', level: 78 },
      { name: 'React', level: 82 },
      { name: 'Data Structures', level: 90 },
      { name: 'Machine Learning', level: 70 },
      { name: 'System Design', level: 60 }
    ],
    socialLinks: {
      github: 'https://github.com/fangli',
      linkedin: 'https://linkedin.com/in/fangli',
      portfolio: 'https://fangli.dev'
    }
  };

  const learningJourney = [
    {
      date: '2024-01-10',
      milestone: 'Completed Advanced Data Structures Course',
      description: 'Mastered complex data structures including AVL trees, B-trees, and graph algorithms.',
      category: 'Academic',
      icon: '📚'
    },
    {
      date: '2024-01-05',
      milestone: 'Solved 100 LeetCode Problems',
      description: 'Reached a significant milestone in algorithmic problem solving.',
      category: 'Practice',
      icon: '🧩'
    },
    {
      date: '2023-12-20',
      milestone: 'Built Full-Stack Web Application',
      description: 'Created a task management app using React, Node.js, and MongoDB.',
      category: 'Project',
      icon: '🚀'
    },
    {
      date: '2023-12-15',
      milestone: 'Contributed to Open Source',
      description: 'Made first significant contribution to a popular React library.',
      category: 'Contribution',
      icon: '🌟'
    },
    {
      date: '2023-12-01',
      milestone: 'Started Machine Learning Specialization',
      description: 'Began comprehensive ML course on Coursera by Andrew Ng.',
      category: 'Learning',
      icon: '🤖'
    }
  ];

  const achievements = [
    {
      title: 'Dean\'s List',
      description: 'Achieved Dean\'s List recognition for academic excellence',
      date: 'Fall 2023',
      type: 'academic',
      icon: '🏆'
    },
    {
      title: 'Hackathon Winner',
      description: 'First place at Stanford Hackathon for AI-powered study assistant',
      date: 'October 2023',
      type: 'competition',
      icon: '🥇'
    },
    {
      title: 'Research Assistant',
      description: 'Selected as undergraduate research assistant in NLP lab',
      date: 'September 2023',
      type: 'research',
      icon: '🔬'
    },
    {
      title: 'Google Code-in Participant',
      description: 'Completed multiple tasks in open source development',
      date: 'Summer 2023',
      type: 'program',
      icon: '💻'
    }
  ];

  const studyStats = {
    totalHours: 245,
    streakDays: 15,
    topicsCompleted: 89,
    problemsSolved: 156,
    coursesFinished: 8,
    projectsBuilt: 12
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
      'Practice': 'bg-green-100 text-green-700 border-green-200',
      'Project': 'bg-purple-100 text-purple-700 border-purple-200',
      'Contribution': 'bg-orange-100 text-orange-700 border-orange-200',
      'Learning': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getAchievementColor = (type: string) => {
    const colors = {
      'academic': 'bg-blue-50 border-blue-200',
      'competition': 'bg-amber-50 border-amber-200',
      'research': 'bg-purple-50 border-purple-200',
      'program': 'bg-green-50 border-green-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Profile</h1>
        <p className="text-slate-600">Manage your profile and track your learning journey</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-6">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <CardTitle className="text-xl">{userProfile.name}</CardTitle>
              <p className="text-slate-600">{userProfile.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-slate-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{userProfile.university}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>{userProfile.year}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{userProfile.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-4">{userProfile.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.totalHours}</p>
                    <p className="text-xs text-slate-600">Study Hours</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.streakDays}</p>
                    <p className="text-xs text-slate-600">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.problemsSolved}</p>
                    <p className="text-xs text-slate-600">Problems Solved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.projectsBuilt}</p>
                    <p className="text-xs text-slate-600">Projects Built</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="journey" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="journey">Learning Journey</TabsTrigger>
              <TabsTrigger value="skills">Skills & Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="journey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>My Learning Journey</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {learningJourney.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-lg">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-900">{item.milestone}</h4>
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                            <p className="text-xs text-slate-500">{item.date}</p>
                          </div>
                        </div>
                        
                        {index < learningJourney.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-12 bg-slate-200"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Skills & Proficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userProfile.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{skill.name}</span>
                          <span className="text-sm text-slate-600">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-3" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.topicsCompleted}</p>
                    <p className="text-sm text-slate-600">Topics Completed</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.coursesFinished}</p>
                    <p className="text-sm text-slate-600">Courses Finished</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-2xl font-semibold text-slate-900">{studyStats.projectsBuilt}</p>
                    <p className="text-sm text-slate-600">Projects Built</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Card className={`hover:shadow-lg transition-all duration-300 ${getAchievementColor(achievement.type)}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 mb-1">{achievement.title}</h3>
                            <p className="text-sm text-slate-600 mb-2">{achievement.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {achievement.date}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;