import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Plus,
  FileText,
  Video,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MaterialsProps {
  onNavigate: (page: string, id?: string) => void;
}

export function Materials({ onNavigate }: MaterialsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const materials = [
    {
      id: '1',
      title: 'Linear Algebra Complete Course',
      description: 'Comprehensive notes covering vectors, matrices, eigenvalues and applications',
      type: 'PDF',
      subject: 'Mathematics',
      uploadedBy: 'Dr. Emily Smith',
      uploadedAt: '2 days ago',
      views: 245,
      likes: 18,
      comments: 5,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      tags: ['vectors', 'matrices', 'eigenvalues'],
      isPinned: true
    },
    {
      id: '2',
      title: 'React Hooks Deep Dive',
      description: 'Advanced patterns and best practices for React Hooks',
      type: 'Video',
      subject: 'Computer Science',
      uploadedBy: 'Sarah Chen',
      uploadedAt: '1 day ago',
      views: 189,
      likes: 24,
      comments: 8,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      tags: ['react', 'hooks', 'frontend'],
      isPinned: false
    },
    {
      id: '3',
      title: 'Database Design Patterns',
      description: 'Essential patterns for scalable database architecture',
      type: 'Document',
      subject: 'Computer Science',
      uploadedBy: 'Alex Johnson',
      uploadedAt: '3 days ago',
      views: 156,
      likes: 12,
      comments: 3,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      tags: ['database', 'sql', 'architecture'],
      isPinned: false
    },
    {
      id: '4',
      title: 'Organic Chemistry Lab Manual',
      description: 'Step-by-step procedures for common organic chemistry experiments',
      type: 'PDF',
      subject: 'Chemistry',
      uploadedBy: 'Prof. Michael Rodriguez',
      uploadedAt: '1 week ago',
      views: 312,
      likes: 28,
      comments: 12,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      tags: ['organic', 'lab', 'experiments'],
      isPinned: false
    }
  ];

  const subjects = ['all', 'Mathematics', 'Computer Science', 'Chemistry', 'Physics', 'Biology'];
  const types = ['all', 'PDF', 'Video', 'Document', 'Presentation'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return FileText;
      case 'Video':
        return Video;
      case 'Document':
        return FileText;
      case 'Presentation':
        return File;
      default:
        return File;
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const MaterialCard = ({ material }: { material: typeof materials[0] }) => {
    const TypeIcon = getTypeIcon(material.type);
    
    return (
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-[var(--border)]">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg overflow-hidden">
            <img 
              src={material.thumbnail} 
              alt={material.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          {material.isPinned && (
            <Badge className="absolute top-3 left-3 bg-[var(--warning)] text-white">
              Pinned
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-[var(--text-primary)]">
              <TypeIcon className="h-3 w-3 mr-1" />
              {material.type}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                {material.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                {material.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {material.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {material.uploadedBy.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {material.uploadedBy}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {material.uploadedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {material.views}
                </span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {material.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {material.comments}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-[var(--warning)] text-[var(--warning)]" />
                <span>{material.rating}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onNavigate('materials', material.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Study Materials</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Discover and share educational resources with your study community
          </p>
        </div>
        <Button onClick={() => onNavigate('materials/upload')}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-[var(--border)]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
                <Input
                  placeholder="Search materials, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border border-[var(--border)] rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid/List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[var(--text-muted)]">
            {filteredMaterials.length} materials found
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((material) => {
              const TypeIcon = getTypeIcon(material.type);
              return (
                <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer border-[var(--border)]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={material.thumbnail} 
                          alt={material.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                              {material.title}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-2">
                              {material.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
                              <Badge variant="secondary">
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {material.type}
                              </Badge>
                              <span>{material.subject}</span>
                              <span>by {material.uploadedBy}</span>
                              <span>{material.uploadedAt}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button size="sm" onClick={() => onNavigate('materials', material.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1">
                            {material.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {material.views}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {material.likes}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-[var(--warning)] text-[var(--warning)]" />
                              {material.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}