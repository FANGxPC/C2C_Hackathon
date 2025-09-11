import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MessageCircle, Users, Building, GraduationCap, MapPin, Filter, Sparkles } from 'lucide-react';

const Networking: React.FC = () => {
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
      connections: 156,
      aiRecommended: true
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
      connections: 234,
      aiRecommended: true
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
      connections: 89,
      aiRecommended: false
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
      connections: 67,
      aiRecommended: true
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
      connections: 312,
      aiRecommended: false
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
      connections: 123,
      aiRecommended: true
    }
  ];

  const companies = ['all', 'Google', 'Microsoft', 'Amazon', 'Netflix', 'Airbnb', 'Tesla'];
  const years = ['all', '2017', '2018', '2019', '2020', '2021'];
  const skills = ['all', 'React', 'Python', 'JavaScript', 'Machine Learning', 'Design', 'Cybersecurity'];

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

  const aiRecommendedProfiles = filteredProfiles.filter(profile => profile.aiRecommended);

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

      {/* AI Recommendations */}
      {aiRecommendedProfiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800">
                <Sparkles className="h-5 w-5" />
                <span>AI Recommendations</span>
              </CardTitle>
              <p className="text-amber-700 text-sm">
                Based on your profile and interests, these connections might be particularly valuable for you.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiRecommendedProfiles.slice(0, 3).map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 bg-white rounded-lg border border-amber-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{profile.name}</p>
                        <p className="text-sm text-slate-600 truncate">{profile.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Profiles Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
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
                      {profile.aiRecommended && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </motion.div>
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