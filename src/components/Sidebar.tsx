import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Home, 
  Bot, 
  BookOpen, 
  Briefcase, 
  Users, 
  MessageSquare, 
  BarChart3, 
  User,
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onScreenChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'study-materials', label: 'Study Materials', icon: BookOpen },
    { id: 'placement-prep', label: 'Placement Prep', icon: Briefcase },
    { id: 'networking', label: 'Networking', icon: Users },
    { id: 'study-groups', label: 'Study Groups', icon: MessageSquare, badge: '3' },
    { id: 'learning-tracker', label: 'Learning Tracker', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-colors duration-500 ease-in-out"
    >
      {/* Logo and Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center animate-gradient hover:scale-105 transition-transform duration-300">
            <Bot className="h-6 w-6 text-primary-foreground animate-icon" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-lg">StudentConnect</h1>
            <p className="text-xs text-sidebar-foreground/70">AI-Powered Platform</p>
          </div>
        </motion.div>
      </div>

      {/* User Profile Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="p-4"
      >
        <div className="flex items-center space-x-3 p-3 bg-sidebar-accent rounded-lg animate-card-hover cursor-pointer">
          <Avatar className="h-10 w-10 transition-transform duration-300 hover:scale-110">
            <AvatarFallback className="bg-primary/10 text-primary">
              FL
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sidebar-foreground truncate">Fang Li</p>
            <p className="text-sm text-sidebar-foreground/70 truncate">CS Student</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
            >
              <Button
                variant={activeScreen === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-11 animate-sidebar-item ${
                  activeScreen === item.id 
                    ? "active bg-sidebar-primary text-sidebar-primary-foreground shadow-lg" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                onClick={() => onScreenChange(item.id)}
              >
                <item.icon className={`h-4 w-4 mr-3 animate-icon ${activeScreen === item.id ? 'text-sidebar-primary-foreground' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={activeScreen === item.id ? "secondary" : "outline"} 
                    className={`ml-2 h-5 px-2 text-xs animate-scale-in ${item.badge === 'AI' ? 'animate-badge-pulse' : ''}`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="p-4 border-t border-sidebar-border space-y-2"
      >
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent animate-button-hover">
          <Settings className="h-4 w-4 mr-3 animate-icon" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent animate-button-hover">
          <LogOut className="h-4 w-4 mr-3 animate-icon" />
          Sign Out
        </Button>
        
        {/* AI Status Indicator */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20 animate-card-hover cursor-pointer">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-badge-pulse"></div>
            <span className="text-xs font-medium text-sidebar-foreground">AI Services Active</span>
          </div>
          <p className="text-xs text-sidebar-foreground/70 mt-1">RunPod integration ready</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;