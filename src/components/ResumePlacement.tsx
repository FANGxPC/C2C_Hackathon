import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  Building, 
  Calendar, 
  Clock,
  ExternalLink,
  Users,
  BookOpen,
  Target,
  Star,
  MapPin,
  Briefcase,
  DollarSign,
  BarChart3,
  Newspaper
} from 'lucide-react';

export const ResumePlacement: React.FC = () => {
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('all');

  const placementInsights = [
    {
      company: 'Google',
      position: 'Software Engineer',
      difficulty: 'Hard',
      tips: 'Focus on system design and coding problems',
      recent: '2 days ago',
      trend: 'up',
      packageRange: '₹25-40 LPA',
      location: 'Bangalore, Hyderabad'
    },
    {
      company: 'Microsoft',
      position: 'Product Manager',
      difficulty: 'Medium',
      tips: 'Emphasize leadership and analytical skills',
      recent: '1 week ago',
      trend: 'up',
      packageRange: '₹28-45 LPA',
      location: 'Bangalore, Noida'
    },
    {
      company: 'Amazon',
      position: 'Data Scientist',
      difficulty: 'Hard',
      tips: 'Prepare for statistical modeling questions',
      recent: '3 days ago',
      trend: 'stable',
      packageRange: '₹30-50 LPA',
      location: 'Bangalore, Chennai'
    },
    {
      company: 'Flipkart',
      position: 'SDE-1',
      difficulty: 'Medium',
      tips: 'Strong focus on DSA and system design basics',
      recent: '5 days ago',
      trend: 'up',
      packageRange: '₹18-25 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Meta',
      position: 'Frontend Engineer',
      difficulty: 'Hard',
      tips: 'React expertise and component architecture knowledge essential',
      recent: '4 days ago',
      trend: 'up',
      packageRange: '₹35-55 LPA',
      location: 'Bangalore, Gurgaon'
    },
    {
      company: 'Netflix',
      position: 'Full Stack Developer',
      difficulty: 'Hard',
      tips: 'Microservices architecture and scaling challenges',
      recent: '1 week ago',
      trend: 'up',
      packageRange: '₹40-65 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Uber',
      position: 'Data Engineer',
      difficulty: 'Medium',
      tips: 'Real-time data processing and Apache Kafka experience',
      recent: '6 days ago',
      trend: 'up',
      packageRange: '₹22-35 LPA',
      location: 'Bangalore, Hyderabad'
    },
    {
      company: 'Swiggy',
      position: 'Backend Engineer',
      difficulty: 'Medium',
      tips: 'API development and database optimization skills',
      recent: '3 days ago',
      trend: 'up',
      packageRange: '₹15-28 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Zomato',
      position: 'Mobile App Developer',
      difficulty: 'Medium',
      tips: 'Flutter/React Native and cross-platform development',
      recent: '1 week ago',
      trend: 'stable',
      packageRange: '₹12-22 LPA',
      location: 'Gurgaon, Bangalore'
    },
    {
      company: 'Paytm',
      position: 'DevOps Engineer',
      difficulty: 'Medium',
      tips: 'Docker, Kubernetes, and CI/CD pipeline knowledge',
      recent: '4 days ago',
      trend: 'up',
      packageRange: '₹16-30 LPA',
      location: 'Noida, Bangalore'
    },
    {
      company: 'PhonePe',
      position: 'Security Engineer',
      difficulty: 'Hard',
      tips: 'Cybersecurity fundamentals and threat analysis',
      recent: '5 days ago',
      trend: 'up',
      packageRange: '₹20-35 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Razorpay',
      position: 'Payments Engineer',
      difficulty: 'Medium',
      tips: 'Payment gateway integration and financial systems',
      recent: '2 days ago',
      trend: 'up',
      packageRange: '₹18-32 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Ola',
      position: 'Machine Learning Engineer',
      difficulty: 'Hard',
      tips: 'ML algorithms and model deployment experience',
      recent: '1 week ago',
      trend: 'stable',
      packageRange: '₹25-40 LPA',
      location: 'Bangalore'
    },
    {
      company: 'Byju\'s',
      position: 'Content Developer',
      difficulty: 'Easy',
      tips: 'Educational content creation and curriculum design',
      recent: '3 days ago',
      trend: 'stable',
      packageRange: '₹8-15 LPA',
      location: 'Bangalore, Mumbai'
    },
    {
      company: 'Unacademy',
      position: 'Product Analyst',
      difficulty: 'Medium',
      tips: 'Data analysis and user behavior insights',
      recent: '6 days ago',
      trend: 'up',
      packageRange: '₹12-20 LPA',
      location: 'Bangalore, Delhi'
    },
    {
      company: 'Zerodha',
      position: 'Quantitative Analyst',
      difficulty: 'Hard',
      tips: 'Financial modeling and algorithmic trading knowledge',
      recent: '4 days ago',
      trend: 'up',
      packageRange: '₹22-38 LPA',
      location: 'Bangalore'
    }
  ];

  const placementNews = [
    {
      id: 1,
      title: 'Andhra University: 435 Students Placed in Recent Campus Drives',
      summary: 'Andhra University sees successful placement season with 435 students placed in recent campus drives. TCS recruited 18 management trainees at approximately ₹5.85 lakh/year package.',
      category: 'campus',
      date: '1 day ago',
      source: 'The Times of India',
      trending: true,
      tags: ['Campus Placement', 'TCS', 'Management Trainee']
    },
    {
      id: 2,
      title: 'JPMorgan Plans 20% Hiring Increase in Asia Pacific Corporate Banking',
      summary: 'JPMorgan plans to increase hiring in its Corporate Banking division in Asia Pacific by approximately 20% in 2026, representing expansion and opportunity in finance roles.',
      category: 'industry',
      date: '2 days ago',
      source: 'Reuters',
      trending: true,
      tags: ['JPMorgan', 'Finance', 'Asia Pacific', 'Corporate Banking']
    },
    {
      id: 3,
      title: 'Hyderabad Campus Placements See Decline in Company Participation',
      summary: 'Campus placements in Hyderabad are seeing a decline with fewer companies participating, and many recruitment processes are delayed or have stopped. Colleges express concern about reduced offers compared to last year.',
      category: 'campus',
      date: '3 days ago',
      source: 'The Times of India',
      trending: false,
      tags: ['Hyderabad', 'Campus Decline', 'Recruitment Delay']
    },
    {
      id: 4,
      title: 'Quick-Commerce Platforms Expect 40-60% Hiring Surge for Festive Season',
      summary: 'Quick-commerce platforms in India are expecting a surge in hiring (40-60% growth in workforce) ahead of the festive season to deal with higher demand.',
      category: 'opportunities',
      date: '4 days ago',
      source: 'The Times of India',
      trending: true,
      tags: ['Quick Commerce', 'Festive Hiring', 'E-commerce']
    },
    {
      id: 5,
      title: 'Japanese Companies Expanding Global Capability Centres in India',
      summary: 'Japanese companies are increasingly setting up Global Capability Centres (GCCs) in India with projected huge growth: India has approximately 85 such GCCs now, aiming for 150 by 2028, employing around 350,000 people.',
      category: 'industry',
      date: '5 days ago',
      source: 'The Times of India',
      trending: false,
      tags: ['Japanese Companies', 'GCC', 'India Expansion']
    },
    {
      id: 6,
      title: 'Engineering Placements Crisis Worse Than Expected, Says CoinSwitch Co-founder',
      summary: 'CoinSwitch co-founder highlights that the engineering placements issue is worse than people think, urging students and parents to broaden outlook beyond traditional engineering roles due to mismatch between graduate numbers and job opportunities.',
      category: 'trends',
      date: '6 days ago',
      source: 'The Economic Times',
      trending: true,
      tags: ['Engineering Crisis', 'Career Advice', 'Job Market']
    },
    {
      id: 7,
      title: 'Infosys Resumes Campus Hiring with Digital Specialist Engineer Positions',
      summary: 'Infosys is resuming campus hiring, involving senior employees in interview panels. Positions called "Digital Specialist Engineers (DSEs)" are being targeted.',
      category: 'campus',
      date: '1 week ago',
      source: 'The Economic Times',
      trending: false,
      tags: ['Infosys', 'Campus Hiring', 'Digital Specialist']
    },
    {
      id: 8,
      title: 'University of Hyderabad Student Bags Record ₹46 Lakh Package',
      summary: 'University of Hyderabad (UoH) MTech student bagged a record package of ₹46 lakh/year, a steep jump over the previous year\'s highest offer (~₹17.9 lakh). 550 students placed across approximately 180 companies.',
      category: 'campus',
      date: '1 week ago',
      source: 'The Times of India',
      trending: true,
      tags: ['UoH', 'Record Package', 'MTech Placement']
    },
    {
      id: 9,
      title: 'PU UIET Reports 325 Placements with ₹24.73 Lakh Highest Package',
      summary: 'PU UIET, Panjab University achieved 325 placements in the batch with highest package ₹24.73 lakh and average package approximately ₹8.5 lakh. Companies like Cisco, American Express, Walmart, Deloitte, L&T among recruiters.',
      category: 'campus',
      date: '1 week ago',
      source: 'The Times of India',
      trending: false,
      tags: ['Panjab University', 'UIET', 'Tech Companies']
    },
    {
      id: 10,
      title: 'Databricks Invests $250M+ in India AI Operations, 50% Workforce Increase',
      summary: 'Databricks announced an investment of over $250 million in India to scale up its AI/data analytics operations, planning to increase its workforce by 50%+ with new R&D center in Bengaluru.',
      category: 'industry',
      date: '2 weeks ago',
      source: 'Reuters',
      trending: true,
      tags: ['Databricks', 'AI Investment', 'Bengaluru', 'R&D']
    },
    {
      id: 11,
      title: 'Cargill Plans 500 New Jobs in Indian GCCs Over Next 2-3 Years',
      summary: 'Cargill, the global commodity trader, plans to add 500 jobs in its Indian GCCs over next 2-3 years, particularly in roles like data engineering, analytics, and AI.',
      category: 'opportunities',
      date: '2 weeks ago',
      source: 'Reuters',
      trending: false,
      tags: ['Cargill', 'Data Engineering', 'Analytics', 'AI Jobs']
    },
    {
      id: 12,
      title: 'Capgemini India Plans 40,000-45,000 Hires in 2025',
      summary: 'Capgemini India is planning to hire 40,000-45,000 employees in 2025, with approximately 35-40% lateral hires. Focus is on building an AI-ready workforce.',
      category: 'industry',
      date: '3 weeks ago',
      source: 'The Economic Times',
      trending: true,
      tags: ['Capgemini', 'Mass Hiring', 'AI Workforce']
    },
    {
      id: 13,
      title: 'Big Tech Ramps Up India Hiring While IT Majors Slow Down',
      summary: 'Global tech firms (Google, Meta etc.) are ramping up hiring in India especially for AI, cloud, etc., while many domestic large IT firms (e.g. TCS, Infosys) are slowing down.',
      category: 'trends',
      date: '3 weeks ago',
      source: 'The Times of India',
      trending: true,
      tags: ['Big Tech', 'Global vs Domestic', 'AI Cloud Jobs']
    },
    {
      id: 14,
      title: '2025 Placement Season Shows Rebound with 24% Higher Conversion Rates',
      summary: 'Campus hirings rebound for the 2025 placement season with pre-placement offers and conversion rates rising approximately 24% over the previous year, per Deloitte report.',
      category: 'trends',
      date: '1 month ago',
      source: 'Mint',
      trending: false,
      tags: ['Placement Rebound', 'Conversion Rates', 'Deloitte Report']
    },
    {
      id: 15,
      title: 'Salary Trends Improve in 2025: MBA +8.3%, BTech +4.3%',
      summary: 'After a flat 2024, median salary offers improved in 2025: MBA graduates seeing approximately +8.3% increase; BTech graduates approximately +4.3% increase.',
      category: 'trends',
      date: '1 month ago',
      source: 'Industry Report',
      trending: false,
      tags: ['Salary Trends', 'MBA', 'BTech', 'Salary Increase']
    }
  ];

  const newsCategories = [
    { id: 'all', label: 'All News', count: placementNews.length },
    { id: 'industry', label: 'Industry Updates', count: placementNews.filter(n => n.category === 'industry').length },
    { id: 'campus', label: 'Campus News', count: placementNews.filter(n => n.category === 'campus').length },
    { id: 'opportunities', label: 'New Opportunities', count: placementNews.filter(n => n.category === 'opportunities').length },
    { id: 'trends', label: 'Market Trends', count: placementNews.filter(n => n.category === 'trends').length }
  ];

  const filteredNews = selectedNewsCategory === 'all' 
    ? placementNews 
    : placementNews.filter(news => news.category === selectedNewsCategory);

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Placement Hub</h1>
        <p className="text-slate-600">Stay updated with latest placement news, insights, and opportunities</p>
      </motion.div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">Company Insights</TabsTrigger>
          <TabsTrigger value="news">Placement Pulse</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Latest Placement Insights</CardTitle>
                <p className="text-slate-600">Real-time updates from recent placement activities</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {placementInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow animate-card-hover"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Building className="h-5 w-5 text-slate-500 mt-1" />
                          <div className="space-y-3 flex-1">
                            <div>
                              <h4 className="font-medium text-slate-900">{insight.company}</h4>
                              <p className="text-sm text-slate-600">{insight.position}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-slate-700">{insight.packageRange}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                <span className="text-slate-700">{insight.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={insight.difficulty === 'Hard' ? 'destructive' : insight.difficulty === 'Medium' ? 'default' : 'secondary'}
                              >
                                {insight.difficulty}
                              </Badge>
                              <span className="text-xs text-slate-500">{insight.recent}</span>
                            </div>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">{insight.tips}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className={`h-4 w-4 ${
                            insight.trend === 'up' ? 'text-green-500' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* News Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Placement Pulse</span>
                </CardTitle>
                <p className="text-slate-600">Latest news and updates from the placement world</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {newsCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedNewsCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedNewsCategory(category.id)}
                      className="animate-button-hover"
                    >
                      {category.label}
                      <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredNews.map((news, index) => (
                    <motion.article
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow animate-card-hover"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              {news.trending && (
                                <Badge className="bg-red-500 text-white animate-badge-pulse">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {news.category}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                              {news.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {news.summary}
                            </p>
                          </div>
                          <Newspaper className="h-5 w-5 text-slate-400 ml-4 flex-shrink-0" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {news.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{news.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{news.source}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default ResumePlacement;