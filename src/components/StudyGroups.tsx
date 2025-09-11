import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send, Users, Hash, Pin, Calendar, Clock, Search, Plus, MessageSquare, FileText } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'resource' | 'announcement';
}

interface Channel {
  id: string;
  name: string;
  topic: string;
  members: number;
  lastActivity: string;
  pinned?: boolean;
  unread?: number;
}

const StudyGroups: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('dsa-group');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    { id: 'dsa-group', name: 'DSA Group', topic: 'Data Structures & Algorithms', members: 156, lastActivity: '2 min ago', unread: 3 },
    { id: 'os-group', name: 'OS Group', topic: 'Operating Systems', members: 89, lastActivity: '15 min ago', unread: 1 },
    { id: 'ml-group', name: 'ML Group', topic: 'Machine Learning', members: 203, lastActivity: '1 hour ago' },
    { id: 'web-dev', name: 'Web Dev', topic: 'Full Stack Development', members: 134, lastActivity: '3 hours ago' },
    { id: 'interview-prep', name: 'Interview Prep', topic: 'Technical Interviews', members: 267, lastActivity: '30 min ago', pinned: true, unread: 5 },
    { id: 'competitive-programming', name: 'Competitive Programming', topic: 'CP & Contests', members: 98, lastActivity: '2 hours ago' }
  ];

  const messages: Record<string, Message[]> = {
    'dsa-group': [
      {
        id: '1',
        user: 'Alex Chen',
        content: 'Hey everyone! I just solved the Binary Tree Maximum Path Sum problem. Anyone want to discuss different approaches?',
        timestamp: new Date(Date.now() - 300000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Sarah Kim',
        content: 'That\'s awesome! I struggled with that one. Could you share your approach?',
        timestamp: new Date(Date.now() - 240000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Mike Johnson',
        content: 'I have a great video resource for tree problems. Let me share it with you all.',
        timestamp: new Date(Date.now() - 180000),
        type: 'resource'
      },
      {
        id: '4',
        user: 'Alex Chen',
        content: 'Sure! The key insight is to think about it as finding the maximum gain from each node. For each node, we calculate the maximum path sum passing through it.',
        timestamp: new Date(Date.now() - 120000),
        type: 'message'
      },
      {
        id: '5',
        user: 'Study Group Bot',
        content: '📌 Reminder: Weekly DSA contest is tomorrow at 7 PM EST. Topic: Dynamic Programming',
        timestamp: new Date(Date.now() - 60000),
        type: 'announcement'
      }
    ],
    'os-group': [
      {
        id: '1',
        user: 'Emma Wilson',
        content: 'Can someone explain the difference between semaphores and mutexes?',
        timestamp: new Date(Date.now() - 900000),
        type: 'message'
      },
      {
        id: '2',
        user: 'David Lee',
        content: 'Great question! Semaphores can count, mutexes are binary. Semaphores allow multiple threads to access a resource (up to the count), while mutexes allow only one.',
        timestamp: new Date(Date.now() - 600000),
        type: 'message'
      }
    ]
  };

  const pinnedResources = [
    { title: 'DSA Cheatsheet', type: 'PDF', size: '2.3 MB' },
    { title: 'System Design Primer', type: 'Link', url: 'github.com/...' },
    { title: 'Mock Interview Questions', type: 'Document', size: '1.8 MB' }
  ];

  const currentMessages = messages[selectedChannel] || [];
  const currentChannel = channels.find(c => c.id === selectedChannel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannel, currentMessages]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'resource':
        return 'border-l-4 border-l-amber-500 bg-amber-50';
      case 'announcement':
        return 'border-l-4 border-l-orange-500 bg-orange-50';
      default:
        return '';
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar - Channels */}
      <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Study Groups</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {filteredChannels.map((channel, index) => (
              <motion.button
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedChannel === channel.id 
                    ? 'bg-white shadow-sm border border-slate-200' 
                    : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-900">{channel.name}</span>
                    {channel.pinned && <Pin className="h-3 w-3 text-amber-500" />}
                  </div>
                  {channel.unread && (
                    <Badge variant="destructive" className="h-5 min-w-5 text-xs px-1">
                      {channel.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 truncate">{channel.topic}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{channel.members}</span>
                  </span>
                  <span>{channel.lastActivity}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Hash className="h-5 w-5 text-slate-500" />
                <span>{currentChannel?.name}</span>
              </h3>
              <p className="text-sm text-slate-600">{currentChannel?.topic}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{currentChannel?.members} members</span>
              </span>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Members
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {currentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`p-4 rounded-lg ${getMessageTypeColor(message.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">
                        {message.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-900">{message.user}</span>
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'resource' && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Resource
                          </Badge>
                        )}
                        {message.type === 'announcement' && (
                          <Badge variant="outline" className="text-xs bg-amber-100 border-amber-200 text-amber-700">
                            📢 Announcement
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-700">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message #${currentChannel?.name || 'channel'}`}
                className="pr-12"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={sendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Resources */}
      <div className="w-80 border-l border-slate-200 bg-slate-50 p-4">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
              <Pin className="h-4 w-4" />
              <span>Pinned Resources</span>
            </h4>
            <div className="space-y-2">
              {pinnedResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{resource.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                        {resource.size && (
                          <span className="text-xs text-slate-500">{resource.size}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Upcoming Events</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Weekly DSA Contest</p>
                    <p className="text-xs text-slate-600">Tomorrow, 7:00 PM EST</p>
                    <Badge variant="outline" className="text-xs mt-1">Dynamic Programming</Badge>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Study Session</p>
                    <p className="text-xs text-slate-600">Friday, 3:00 PM EST</p>
                    <Badge variant="outline" className="text-xs mt-1">OS Concepts</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;