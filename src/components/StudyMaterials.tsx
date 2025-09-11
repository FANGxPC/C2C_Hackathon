import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Search, Upload, FileText, BookOpen, Video, Download, Star, Clock, Filter } from 'lucide-react';

const StudyMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const materials = [
    {
      id: 1,
      title: 'Data Structures and Algorithms Complete Guide',
      type: 'PDF',
      category: 'Computer Science',
      size: '15.2 MB',
      rating: 4.8,
      downloads: 1250,
      uploadDate: '2 days ago',
      description: 'Comprehensive guide covering all major data structures and algorithms with examples.',
      tags: ['DSA', 'Programming', 'Interview Prep']
    },
    {
      id: 2,
      title: 'Operating Systems Concepts Video Series',
      type: 'Video',
      category: 'Computer Science',
      size: '2.1 GB',
      rating: 4.6,
      downloads: 890,
      uploadDate: '1 week ago',
      description: 'Complete video series explaining OS concepts with practical demonstrations.',
      tags: ['OS', 'System Programming', 'Theory']
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      type: 'PDF',
      category: 'AI/ML',
      size: '8.7 MB',
      rating: 4.9,
      downloads: 2100,
      uploadDate: '3 days ago',
      description: 'Introduction to machine learning with hands-on examples and case studies.',
      tags: ['ML', 'Python', 'Statistics']
    },
    {
      id: 4,
      title: 'Database Design Patterns',
      type: 'Document',
      category: 'Database',
      size: '5.4 MB',
      rating: 4.5,
      downloads: 670,
      uploadDate: '5 days ago',
      description: 'Best practices and design patterns for database architecture.',
      tags: ['Database', 'SQL', 'Design Patterns']
    },
    {
      id: 5,
      title: 'Software Engineering Principles',
      type: 'PDF',
      category: 'Software Engineering',
      size: '12.3 MB',
      rating: 4.7,
      downloads: 1580,
      uploadDate: '1 week ago',
      description: 'Fundamental principles of software engineering and development lifecycle.',
      tags: ['Software Engineering', 'SDLC', 'Best Practices']
    },
    {
      id: 6,
      title: 'Network Security Essentials',
      type: 'Video',
      category: 'Cybersecurity',
      size: '1.8 GB',
      rating: 4.6,
      downloads: 445,
      uploadDate: '2 weeks ago',
      description: 'Essential concepts in network security and cryptography.',
      tags: ['Security', 'Networking', 'Cryptography']
    }
  ];

  const categories = ['all', 'Computer Science', 'AI/ML', 'Database', 'Software Engineering', 'Cybersecurity'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || material.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
      case 'Document':
        return <FileText className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Video':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Document':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Study Materials</h1>
        <p className="text-slate-600">Access comprehensive study resources with AI-powered semantic search</p>
      </motion.div>

      {/* Search and Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
      >
        <div className="lg:col-span-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search materials with AI semantic search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              className={`pl-10 transition-all duration-300 ${
                isSearchActive ? 'ring-2 ring-amber-500 ring-opacity-50 shadow-lg' : ''
              }`}
            />
            {isSearchActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                <p className="text-sm text-slate-600">
                  💡 Try searching with natural language like "machine learning for beginners" or "data structures interview questions"
                </p>
              </motion.div>
            )}
          </div>
        </div>
        <Button className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Material</span>
        </Button>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeFilter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(category)}
            className="transition-all duration-200"
          >
            <Filter className="h-3 w-3 mr-2" />
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </motion.div>

      {/* Materials Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                        {getTypeIcon(material.type)}
                      </div>
                      <Badge variant="outline" className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-600">{material.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{material.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {material.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{material.uploadDate}</span>
                    </span>
                    <span>{material.size}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{material.downloads} downloads</span>
                    </span>
                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Upload Progress (when uploading) */}
      <AnimatePresence>
        {false && ( // This would be controlled by upload state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 w-80"
          >
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-xs text-slate-500">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-600">advanced-algorithms.pdf</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No materials found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Try adjusting your search query or filters to find the materials you're looking for.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StudyMaterials;