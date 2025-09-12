import React from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Home as HomeIcon,
  Bot,
  BookOpen,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
  User as UserIcon,
} from "lucide-react";

interface SidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onScreenChange,
}) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot, badge: "AI" },
    { id: "study-materials", label: "Study Materials", icon: BookOpen },
    { id: "placement-prep", label: "Placement", icon: Briefcase },
    { id: "networking", label: "Networking", icon: Users },
    { id: "study-groups", label: "Study Groups", icon: MessageSquare, badge: "3" },
    { id: "learning-tracker", label: "Learning Tracker", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: UserIcon },
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
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center animate-gradient hover:scale-105 transition-all duration-500 ease-in-out">
            <Bot className="h-6 w-6 text-primary-foreground animate-icon" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-lg">
              StudentConnect
            </h1>
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
        <button
          type="button"
          onClick={() => onScreenChange("profile")}
          className="w-full flex items-center space-x-3 p-3 bg-sidebar-accent rounded-lg animate-card-hover cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Open Profile"
        >
          <Avatar className="h-10 w-10 transition-transform duration-300 hover:scale-110">
            <AvatarFallback className="bg-primary/10 text-primary">FL</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-medium text-sidebar-foreground truncate">Sadique</p>
            <p className="text-sm text-sidebar-foreground/70 truncate">CS Student</p>
          </div>
        </button>
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
                <item.icon
                  className={`h-4 w-4 mr-3 animate-icon ${
                    activeScreen === item.id ? "text-sidebar-primary-foreground" : ""
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {"badge" in item && (item as any).badge && (
                  <Badge
                    variant={activeScreen === item.id ? "secondary" : "outline"}
                    className={`ml-2 h-5 px-2 text-xs animate-scale-in ${
                      (item as any).badge === "AI" ? "animate-badge-pulse" : ""
                    }`}
                  >
                    {(item as any).badge}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Bottom Section removed (Settings, Sign Out, AI status) */}
    </motion.div>
  );
};

export default Sidebar;
