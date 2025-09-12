import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MessageCircle, Users, Building, GraduationCap, MapPin, Filter } from 'lucide-react';

export const Networking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');

  const profiles = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      graduationYear: '2019',
      skills: ['React', 'Python', 'System Design'],
      experience: '4 years',
      bio: 'Passionate about building scalable web applications. Happy to help with interview prep and career guidance.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.9,
      connections: 156
    },
    {
      id: 2,
      name: 'Raj Patel',
      title: 'Product Manager',
      company: 'Microsoft',
      location: 'Seattle, WA',
      graduationYear: '2018',
      skills: ['Product Strategy', 'Data Analysis', 'Leadership'],
      experience: '5 years',
      bio: 'Transitioned from engineering to product management. Can share insights about PM roles and career pivots.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.7,
      connections: 234
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Data Scientist',
      company: 'Amazon',
      location: 'Austin, TX',
      graduationYear: '2020',
      skills: ['Machine Learning', 'Python', 'Statistics'],
      experience: '3 years',
      bio: 'Specialized in recommendation systems and NLP. Love mentoring students interested in data science.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 1 hour',
      helpfulRating: 4.8,
      connections: 89
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Full Stack Developer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      graduationYear: '2021',
      skills: ['JavaScript', 'Node.js', 'AWS'],
      experience: '2 years',
      bio: 'Recent graduate working on streaming technologies. Can share insights about new grad experiences.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 30 minutes',
      helpfulRating: 4.6,
      connections: 67
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'UX Designer',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      graduationYear: '2017',
      skills: ['Design Thinking', 'Figma', 'User Research'],
      experience: '6 years',
      bio: 'Passionate about creating user-centered designs. Happy to review portfolios and provide design feedback.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.9,
      connections: 312
    },
    {
      id: 6,
      name: 'Alex Johnson',
      title: 'Security Engineer',
      company: 'Tesla',
      location: 'Austin, TX',
      graduationYear: '2019',
      skills: ['Cybersecurity', 'Penetration Testing', 'Network Security'],
      experience: '4 years',
      bio: 'Securing the future of autonomous vehicles. Can help with cybersecurity career paths and certifications.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 123
    },
    {
      id: 7,
      name: 'Michael Zhang',
      title: 'DevOps Engineer',
      company: 'Spotify',
      location: 'New York, NY',
      graduationYear: '2020',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      experience: '3 years',
      bio: 'Infrastructure enthusiast. Help students understand cloud technologies and deployment strategies.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.8,
      connections: 198
    },
    {
      id: 8,
      name: 'Jennifer Wu',
      title: 'iOS Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      graduationYear: '2018',
      skills: ['Swift', 'SwiftUI', 'Core Data'],
      experience: '5 years',
      bio: 'Building the future of mobile experiences. Can guide on iOS development and App Store strategies.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.9,
      connections: 267
    },
    {
      id: 9,
      name: 'Carlos Santos',
      title: 'Backend Engineer',
      company: 'Uber',
      location: 'San Francisco, CA',
      graduationYear: '2019',
      skills: ['Go', 'Microservices', 'PostgreSQL'],
      experience: '4 years',
      bio: 'Scaling systems that serve millions of users. Happy to discuss distributed systems and API design.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.6,
      connections: 145
    },
    {
      id: 10,
      name: 'Amanda Foster',
      title: 'AI Research Scientist',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      graduationYear: '2016',
      skills: ['Deep Learning', 'PyTorch', 'Research'],
      experience: '7 years',
      bio: 'Pushing the boundaries of artificial intelligence. Can mentor on ML research and PhD applications.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 12 hours',
      helpfulRating: 4.9,
      connections: 389
    },
    {
      id: 11,
      name: 'James Park',
      title: 'Frontend Lead',
      company: 'Slack',
      location: 'Vancouver, BC',
      graduationYear: '2017',
      skills: ['TypeScript', 'React', 'GraphQL'],
      experience: '6 years',
      bio: 'Leading frontend teams and building collaborative tools. Love helping with technical leadership skills.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 223
    },
    {
      id: 12,
      name: 'Priya Sharma',
      title: 'Machine Learning Engineer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      graduationYear: '2020',
      skills: ['TensorFlow', 'Computer Vision', 'MLOps'],
      experience: '3 years',
      bio: 'Building ML systems at scale. Happy to share insights about transitioning from academia to industry.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 5 hours',
      helpfulRating: 4.8,
      connections: 156
    },
    {
      id: 13,
      name: 'Robert Chen',
      title: 'Site Reliability Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      graduationYear: '2018',
      skills: ['Monitoring', 'Automation', 'Linux'],
      experience: '5 years',
      bio: 'Keeping services running 24/7. Can help with infrastructure, monitoring, and incident response.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.7,
      connections: 189
    },
    {
      id: 14,
      name: 'Sofia Martinez',
      title: 'Product Designer',
      company: 'Adobe',
      location: 'San Jose, CA',
      graduationYear: '2019',
      skills: ['Adobe XD', 'Prototyping', 'Design Systems'],
      experience: '4 years',
      bio: 'Creating beautiful and functional digital experiences. Happy to review design portfolios and provide feedback.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.8,
      connections: 234
    },
    {
      id: 15,
      name: 'Kevin Liu',
      title: 'Data Engineer',
      company: 'Snowflake',
      location: 'San Mateo, CA',
      graduationYear: '2021',
      skills: ['Apache Spark', 'ETL', 'Data Warehousing'],
      experience: '2 years',
      bio: 'Building data pipelines that power analytics. Can guide on data engineering fundamentals and tools.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.6,
      connections: 98
    },
    {
      id: 16,
      name: 'Rachel Green',
      title: 'Quantitative Analyst',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      graduationYear: '2017',
      skills: ['Python', 'Statistics', 'Financial Modeling'],
      experience: '6 years',
      bio: 'Applying math and programming to financial markets. Can help with quant finance career transitions.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.9,
      connections: 312
    },
    {
      id: 17,
      name: 'Daniel Wong',
      title: 'Cloud Architect',
      company: 'AWS',
      location: 'Seattle, WA',
      graduationYear: '2015',
      skills: ['AWS', 'Terraform', 'Solution Architecture'],
      experience: '8 years',
      bio: 'Designing cloud solutions for enterprise customers. Happy to discuss cloud certifications and architecture.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 5 hours',
      helpfulRating: 4.8,
      connections: 445
    },
    {
      id: 18,
      name: 'Maya Patel',
      title: 'Blockchain Developer',
      company: 'Coinbase',
      location: 'San Francisco, CA',
      graduationYear: '2020',
      skills: ['Solidity', 'Web3', 'Smart Contracts'],
      experience: '3 years',
      bio: 'Building the future of decentralized finance. Can mentor on blockchain development and crypto space.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 167
    },
    {
      id: 19,
      name: 'Thomas Anderson',
      title: 'Game Developer',
      company: 'Epic Games',
      location: 'Cary, NC',
      graduationYear: '2018',
      skills: ['Unreal Engine', 'C++', 'Game Design'],
      experience: '5 years',
      bio: 'Creating immersive gaming experiences. Love helping students break into the game development industry.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 7 hours',
      helpfulRating: 4.6,
      connections: 198
    },
    {
      id: 20,
      name: 'Nina Kumar',
      title: 'Cybersecurity Analyst',
      company: 'CrowdStrike',
      location: 'Austin, TX',
      graduationYear: '2021',
      skills: ['Threat Intelligence', 'SIEM', 'Incident Response'],
      experience: '2 years',
      bio: 'Protecting organizations from cyber threats. Can guide on cybersecurity career paths and certifications.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.7,
      connections: 134
    },
    {
      id: 21,
      name: 'Brandon Taylor',
      title: 'Software Architect',
      company: 'Salesforce',
      location: 'San Francisco, CA',
      graduationYear: '2014',
      skills: ['System Design', 'Microservices', 'Leadership'],
      experience: '9 years',
      bio: 'Designing enterprise software solutions. Happy to mentor on technical leadership and system architecture.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 10 hours',
      helpfulRating: 4.9,
      connections: 567
    },
    {
      id: 22,
      name: 'Yuki Tanaka',
      title: 'Mobile Engineer',
      company: 'TikTok',
      location: 'Los Angeles, CA',
      graduationYear: '2019',
      skills: ['React Native', 'iOS', 'Android'],
      experience: '4 years',
      bio: 'Building mobile apps used by millions. Can help with mobile development strategies and performance optimization.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.8,
      connections: 189
    },
    {
      id: 23,
      name: 'Isabella Rodriguez',
      title: 'Business Intelligence Analyst',
      company: 'Tableau',
      location: 'Seattle, WA',
      graduationYear: '2020',
      skills: ['SQL', 'Tableau', 'Data Visualization'],
      experience: '3 years',
      bio: 'Turning data into actionable insights. Love helping students understand data analysis and visualization.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.7,
      connections: 156
    },
    {
      id: 24,
      name: 'Marcus Johnson',
      title: 'Engineering Manager',
      company: 'Stripe',
      location: 'San Francisco, CA',
      graduationYear: '2016',
      skills: ['Team Leadership', 'Agile', 'Technical Strategy'],
      experience: '7 years',
      bio: 'Leading engineering teams building payment infrastructure. Can mentor on engineering management transitions.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.9,
      connections: 378
    },
    {
      id: 25,
      name: 'Aisha Hassan',
      title: 'Quality Assurance Engineer',
      company: 'Zoom',
      location: 'San Jose, CA',
      graduationYear: '2021',
      skills: ['Test Automation', 'Selenium', 'API Testing'],
      experience: '2 years',
      bio: 'Ensuring software quality and reliability. Happy to share insights about QA processes and automation.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.6,
      connections: 87
    },
    {
      id: 26,
      name: 'Christopher Lee',
      title: 'Research Engineer',
      company: 'DeepMind',
      location: 'London, UK',
      graduationYear: '2017',
      skills: ['Reinforcement Learning', 'Python', 'Research'],
      experience: '6 years',
      bio: 'Advancing AI research for scientific discovery. Can mentor on research methodologies and PhD paths.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 12 hours',
      helpfulRating: 4.9,
      connections: 298
    },
    {
      id: 27,
      name: 'Samantha Clark',
      title: 'Technical Writer',
      company: 'GitLab',
      location: 'Remote',
      graduationYear: '2019',
      skills: ['Documentation', 'API Docs', 'Technical Communication'],
      experience: '4 years',
      bio: 'Making complex technical concepts accessible. Can help with technical writing and documentation strategies.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.8,
      connections: 145
    },
    {
      id: 28,
      name: 'Victor Petrov',
      title: 'Hardware Engineer',
      company: 'NVIDIA',
      location: 'Santa Clara, CA',
      graduationYear: '2018',
      skills: ['CUDA', 'GPU Architecture', 'Hardware Design'],
      experience: '5 years',
      bio: 'Designing next-generation graphics processors. Happy to discuss hardware engineering and GPU computing.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 5 hours',
      helpfulRating: 4.7,
      connections: 234
    },
    {
      id: 29,
      name: 'Grace Wang',
      title: 'Product Marketing Manager',
      company: 'HubSpot',
      location: 'Cambridge, MA',
      graduationYear: '2020',
      skills: ['Go-to-Market', 'Product Positioning', 'Marketing Analytics'],
      experience: '3 years',
      bio: 'Bringing innovative products to market. Can share insights about product marketing and growth strategies.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.8,
      connections: 189
    },
    {
      id: 30,
      name: 'Ahmed Al-Rashid',
      title: 'Systems Engineer',
      company: 'SpaceX',
      location: 'Hawthorne, CA',
      graduationYear: '2017',
      skills: ['Aerospace', 'Systems Integration', 'Mission Critical'],
      experience: '6 years',
      bio: 'Building systems for space exploration. Can mentor on aerospace engineering and mission-critical systems.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.9,
      connections: 267
    },
    {
      id: 31,
      name: 'Lauren Mitchell',
      title: 'Scrum Master',
      company: 'Atlassian',
      location: 'Austin, TX',
      graduationYear: '2019',
      skills: ['Agile', 'Scrum', 'Team Facilitation'],
      experience: '4 years',
      bio: 'Enabling high-performing agile teams. Happy to share insights about agile methodologies and team dynamics.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 178
    },
    {
      id: 32,
      name: 'Ryan O\'Connor',
      title: 'Platform Engineer',
      company: 'HashiCorp',
      location: 'San Francisco, CA',
      graduationYear: '2020',
      skills: ['Infrastructure as Code', 'Terraform', 'Platform Engineering'],
      experience: '3 years',
      bio: 'Building platforms that enable developer productivity. Can guide on infrastructure and platform engineering.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 7 hours',
      helpfulRating: 4.8,
      connections: 145
    },
    {
      id: 33,
      name: 'Fatima Benali',
      title: 'Computer Vision Engineer',
      company: 'Waymo',
      location: 'Mountain View, CA',
      graduationYear: '2018',
      skills: ['Computer Vision', 'OpenCV', 'Autonomous Systems'],
      experience: '5 years',
      bio: 'Developing vision systems for autonomous vehicles. Can mentor on computer vision and robotics applications.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.8,
      connections: 198
    },
    {
      id: 34,
      name: 'Nathan Brooks',
      title: 'Solutions Engineer',
      company: 'MongoDB',
      location: 'New York, NY',
      graduationYear: '2021',
      skills: ['Database Design', 'NoSQL', 'Customer Solutions'],
      experience: '2 years',
      bio: 'Helping customers solve complex data challenges. Happy to discuss database technologies and solutions architecture.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.6,
      connections: 123
    },
    {
      id: 35,
      name: 'Zoe Chen',
      title: 'Growth Engineer',
      company: 'Notion',
      location: 'San Francisco, CA',
      graduationYear: '2020',
      skills: ['A/B Testing', 'Analytics', 'Growth Metrics'],
      experience: '3 years',
      bio: 'Using data and engineering to drive product growth. Can share insights about growth engineering and metrics.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 167
    },
    {
      id: 36,
      name: 'Oliver Schmidt',
      title: 'Embedded Software Engineer',
      company: 'Tesla',
      location: 'Fremont, CA',
      graduationYear: '2019',
      skills: ['C/C++', 'Embedded Systems', 'Real-time OS'],
      experience: '4 years',
      bio: 'Programming the brains of electric vehicles. Can mentor on embedded systems and automotive software.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.8,
      connections: 156
    },
    {
      id: 37,
      name: 'Chloe Anderson',
      title: 'UX Researcher',
      company: 'Meta',
      location: 'Menlo Park, CA',
      graduationYear: '2018',
      skills: ['User Research', 'Usability Testing', 'Behavioral Analysis'],
      experience: '5 years',
      bio: 'Understanding user needs and behaviors. Happy to guide on UX research methodologies and career paths.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.9,
      connections: 234
    },
    {
      id: 38,
      name: 'Diego Ramirez',
      title: 'Network Engineer',
      company: 'Cisco',
      location: 'San Jose, CA',
      graduationYear: '2017',
      skills: ['Network Protocols', 'Security', 'Infrastructure'],
      experience: '6 years',
      bio: 'Building robust network infrastructures. Can help with networking fundamentals and certification paths.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 5 hours',
      helpfulRating: 4.7,
      connections: 189
    },
    {
      id: 39,
      name: 'Julia Novak',
      title: 'Finance Technology Analyst',
      company: 'JPMorgan Chase',
      location: 'New York, NY',
      graduationYear: '2021',
      skills: ['Financial Analysis', 'Python', 'Risk Management'],
      experience: '2 years',
      bio: 'Bridging finance and technology. Can guide on fintech careers and quantitative finance applications.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.6,
      connections: 145
    },
    {
      id: 40,
      name: 'Kai Nakamura',
      title: 'AR/VR Developer',
      company: 'Magic Leap',
      location: 'Plantation, FL',
      graduationYear: '2020',
      skills: ['Unity', 'ARCore', 'Mixed Reality'],
      experience: '3 years',
      bio: 'Creating immersive mixed reality experiences. Happy to share insights about AR/VR development and spatial computing.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.8,
      connections: 167
    },
    {
      id: 41,
      name: 'Emma Thompson',
      title: 'Technical Program Manager',
      company: 'Amazon',
      location: 'Seattle, WA',
      graduationYear: '2016',
      skills: ['Program Management', 'Cross-functional Leadership', 'Strategic Planning'],
      experience: '7 years',
      bio: 'Coordinating complex technical initiatives. Can mentor on technical program management and leadership skills.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 5 hours',
      helpfulRating: 4.9,
      connections: 345
    },
    {
      id: 42,
      name: 'Hassan Ahmed',
      title: 'Information Security Specialist',
      company: 'Palo Alto Networks',
      location: 'Santa Clara, CA',
      graduationYear: '2019',
      skills: ['Penetration Testing', 'Vulnerability Assessment', 'Security Compliance'],
      experience: '4 years',
      bio: 'Protecting digital assets from cyber threats. Can guide on cybersecurity specializations and certifications.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 7 hours',
      helpfulRating: 4.7,
      connections: 198
    },
    {
      id: 43,
      name: 'Lily Zhang',
      title: 'Bioinformatics Engineer',
      company: 'Illumina',
      location: 'San Diego, CA',
      graduationYear: '2018',
      skills: ['Genomics', 'Python', 'Statistical Analysis'],
      experience: '5 years',
      bio: 'Using computation to understand biology. Can mentor on bioinformatics applications and computational biology.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.8,
      connections: 156
    },
    {
      id: 44,
      name: 'Andre Silva',
      title: 'Robotics Engineer',
      company: 'Boston Dynamics',
      location: 'Waltham, MA',
      graduationYear: '2017',
      skills: ['ROS', 'Control Systems', 'Mechanical Design'],
      experience: '6 years',
      bio: 'Building robots that can navigate complex environments. Happy to discuss robotics engineering and automation.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.9,
      connections: 234
    },
    {
      id: 45,
      name: 'Megan Foster',
      title: 'Customer Success Engineer',
      company: 'Twilio',
      location: 'San Francisco, CA',
      graduationYear: '2020',
      skills: ['API Integration', 'Customer Support', 'Technical Solutions'],
      experience: '3 years',
      bio: 'Helping customers succeed with communication APIs. Can guide on customer-facing technical roles.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.7,
      connections: 145
    },
    {
      id: 46,
      name: 'Jin Wu',
      title: 'Compiler Engineer',
      company: 'Apple',
      location: 'Cupertino, CA',
      graduationYear: '2016',
      skills: ['LLVM', 'Compiler Design', 'Programming Languages'],
      experience: '7 years',
      bio: 'Optimizing code compilation and language tooling. Can mentor on compiler development and language design.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 9 hours',
      helpfulRating: 4.8,
      connections: 189
    },
    {
      id: 47,
      name: 'Sophia Reyes',
      title: 'Digital Marketing Specialist',
      company: 'Adobe',
      location: 'San Jose, CA',
      graduationYear: '2021',
      skills: ['SEO', 'Content Marketing', 'Analytics'],
      experience: '2 years',
      bio: 'Driving growth through digital marketing strategies. Happy to share insights about marketing technology stack.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.6,
      connections: 123
    },
    {
      id: 48,
      name: 'Ethan Davis',
      title: 'Site Performance Engineer',
      company: 'Cloudflare',
      location: 'San Francisco, CA',
      graduationYear: '2019',
      skills: ['CDN', 'Performance Optimization', 'Web Standards'],
      experience: '4 years',
      bio: 'Making the internet faster and more reliable. Can guide on web performance and edge computing.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.8,
      connections: 167
    },
    {
      id: 49,
      name: 'Nora Eriksson',
      title: 'Audio Software Engineer',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      graduationYear: '2018',
      skills: ['Digital Signal Processing', 'Audio Algorithms', 'Music Technology'],
      experience: '5 years',
      bio: 'Creating the technology behind music streaming. Happy to discuss audio engineering and music technology.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.9,
      connections: 198
    },
    {
      id: 50,
      name: 'Isaiah Jackson',
      title: 'Algorithm Engineer',
      company: 'TikTok',
      location: 'Mountain View, CA',
      graduationYear: '2020',
      skills: ['Recommendation Systems', 'Machine Learning', 'Large Scale Systems'],
      experience: '3 years',
      bio: 'Building algorithms that connect creators and audiences. Can mentor on recommendation systems and ML at scale.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.7,
      connections: 156
    },
    {
      id: 51,
      name: 'Valentina Rossi',
      title: 'Technical Recruiter',
      company: 'Google',
      location: 'Mountain View, CA',
      graduationYear: '2019',
      skills: ['Technical Hiring', 'Talent Acquisition', 'Interview Coaching'],
      experience: '4 years',
      bio: 'Connecting talented engineers with opportunities. Can provide insights on technical recruiting and job search strategies.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      helpfulRating: 4.8,
      connections: 567
    },
    {
      id: 52,
      name: 'Lucas Mueller',
      title: 'IoT Engineer',
      company: 'Siemens',
      location: 'Munich, Germany',
      graduationYear: '2017',
      skills: ['IoT Protocols', 'Embedded Systems', 'Industrial Automation'],
      experience: '6 years',
      bio: 'Connecting the physical and digital worlds through IoT. Happy to discuss industrial IoT and smart manufacturing.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 10 hours',
      helpfulRating: 4.7,
      connections: 234
    },
    {
      id: 53,
      name: 'Aria Shah',
      title: 'Health Tech Engineer',
      company: 'Epic Systems',
      location: 'Madison, WI',
      graduationYear: '2020',
      skills: ['Healthcare IT', 'FHIR', 'Medical Software'],
      experience: '3 years',
      bio: 'Improving healthcare through technology. Can guide on health informatics and medical software development.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 4 hours',
      helpfulRating: 4.6,
      connections: 145
    },
    {
      id: 54,
      name: 'Maxime Dubois',
      title: 'Edge Computing Engineer',
      company: 'NVIDIA',
      location: 'Santa Clara, CA',
      graduationYear: '2021',
      skills: ['Edge AI', 'CUDA', 'Distributed Computing'],
      experience: '2 years',
      bio: 'Bringing AI computing to the edge. Happy to discuss edge computing architectures and AI acceleration.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      helpfulRating: 4.8,
      connections: 123
    },
    {
      id: 55,
      name: 'Aaliyah Williams',
      title: 'Climate Tech Engineer',
      company: 'Tesla Energy',
      location: 'Austin, TX',
      graduationYear: '2019',
      skills: ['Renewable Energy', 'Power Systems', 'Sustainability'],
      experience: '4 years',
      bio: 'Engineering solutions for climate change. Can mentor on clean energy technology and sustainability careers.',
      avatar: '',
      isOnline: false,
      responseTime: 'Usually responds within 6 hours',
      helpfulRating: 4.9,
      connections: 189
    },
    {
      id: 56,
      name: 'Hiroshi Tanaka',
      title: 'Quantum Computing Researcher',
      company: 'IBM',
      location: 'Yorktown Heights, NY',
      graduationYear: '2015',
      skills: ['Quantum Algorithms', 'Qiskit', 'Quantum Physics'],
      experience: '8 years',
      bio: 'Exploring the frontiers of quantum computation. Can guide on quantum computing research and applications.',
      avatar: '',
      isOnline: true,
      responseTime: 'Usually responds within 8 hours',
      helpfulRating: 4.9,
      connections: 267
    }
  ];

  const companies = ['all', 'Google', 'Microsoft', 'Amazon', 'Netflix', 'Airbnb', 'Tesla', 'Spotify', 'Apple', 'Uber', 'OpenAI', 'Slack', 'Meta', 'Adobe', 'Snowflake', 'Goldman Sachs', 'AWS', 'Coinbase', 'Epic Games', 'CrowdStrike', 'Salesforce', 'TikTok', 'Tableau', 'Stripe', 'Zoom', 'DeepMind', 'GitLab', 'NVIDIA', 'HubSpot', 'SpaceX', 'Atlassian', 'HashiCorp', 'Waymo', 'MongoDB', 'Notion', 'Cisco', 'JPMorgan Chase', 'Magic Leap', 'Palo Alto Networks', 'Illumina', 'Boston Dynamics', 'Twilio', 'Cloudflare', 'Siemens', 'Epic Systems', 'Tesla Energy', 'IBM'];
  const years = ['all', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
  const skills = ['all', 'React', 'Python', 'JavaScript', 'Machine Learning', 'Design', 'Cybersecurity', 'Docker', 'Kubernetes', 'Swift', 'Go', 'Deep Learning', 'TypeScript', 'GraphQL', 'TensorFlow', 'Computer Vision', 'MLOps', 'Monitoring', 'Automation', 'Adobe XD', 'Prototyping', 'Apache Spark', 'ETL', 'Statistics', 'Financial Modeling', 'AWS', 'Terraform', 'Solidity', 'Web3', 'Unreal Engine', 'C++', 'Game Design', 'Threat Intelligence', 'SIEM', 'System Design', 'Microservices', 'Leadership', 'React Native', 'iOS', 'Android', 'SQL', 'Tableau', 'Data Visualization', 'Team Leadership', 'Agile', 'Test Automation', 'Selenium', 'API Testing', 'Reinforcement Learning', 'Research', 'Documentation', 'API Docs', 'CUDA', 'GPU Architecture', 'Hardware Design', 'Go-to-Market', 'Product Positioning', 'Marketing Analytics', 'Aerospace', 'Systems Integration', 'Mission Critical', 'Scrum', 'Team Facilitation', 'Infrastructure as Code', 'Platform Engineering', 'OpenCV', 'Autonomous Systems', 'Database Design', 'NoSQL', 'Customer Solutions', 'A/B Testing', 'Analytics', 'Growth Metrics', 'C/C++', 'Embedded Systems', 'Real-time OS', 'User Research', 'Usability Testing', 'Behavioral Analysis', 'Network Protocols', 'Security', 'Infrastructure', 'Financial Analysis', 'Risk Management', 'Unity', 'ARCore', 'Mixed Reality', 'Program Management', 'Cross-functional Leadership', 'Strategic Planning', 'Penetration Testing', 'Vulnerability Assessment', 'Security Compliance', 'Genomics', 'Statistical Analysis', 'ROS', 'Control Systems', 'Mechanical Design', 'API Integration', 'Customer Support', 'Technical Solutions', 'LLVM', 'Compiler Design', 'Programming Languages', 'SEO', 'Content Marketing', 'CDN', 'Performance Optimization', 'Web Standards', 'Digital Signal Processing', 'Audio Algorithms', 'Music Technology', 'Recommendation Systems', 'Large Scale Systems', 'Technical Hiring', 'Talent Acquisition', 'Interview Coaching', 'IoT Protocols', 'Industrial Automation', 'Healthcare IT', 'FHIR', 'Medical Software', 'Edge AI', 'Distributed Computing', 'Renewable Energy', 'Power Systems', 'Sustainability', 'Quantum Algorithms', 'Qiskit', 'Quantum Physics'];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesYear = yearFilter === 'all' || profile.graduationYear === yearFilter;
    const matchesCompany = companyFilter === 'all' || profile.company === companyFilter;
    const matchesSkill = skillFilter === 'all' || profile.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );

    return matchesSearch && matchesYear && matchesCompany && matchesSkill;
  });

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Networking</h1>
        <p className="text-slate-600">Connect with alumni and industry professionals for guidance and mentorship</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Graduation Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.slice(1).map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.slice(1).map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {skills.slice(1).map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setYearFilter('all');
            setCompanyFilter('all');
            setSkillFilter('all');
            setSearchQuery('');
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </motion.div>



      {/* Profiles Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {profile.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900">{profile.name}</h3>
                      <p className="text-sm text-slate-600">{profile.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{profile.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{profile.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-3">{profile.bio}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <GraduationCap className="h-3 w-3" />
                        <span>Class of {profile.graduationYear}</span>
                      </span>
                      <span>{profile.experience} experience</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{profile.connections} connections</span>
                      </span>
                      <span>⭐ {profile.helpfulRating}</span>
                    </div>

                    <p className="text-xs text-slate-500">{profile.responseTime}</p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      className="w-full group-hover:bg-amber-600 transition-colors"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Ask for Guidance
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProfiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No profiles found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Try adjusting your search criteria to find more professionals to connect with.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Networking;