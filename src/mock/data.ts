
import { 
  BookOpen, 
  Target, 
  Users, 
  Award
} from 'lucide-react';

export const stats = [
    {
      title: "Study Materials",
      value: "24",
      change: "+3 this week",
      icon: BookOpen,
      color: "text-[var(--brand-primary)]"
    },
    {
      title: "Active Goals",
      value: "8",
      change: "2 due soon",
      icon: Target,
      color: "text-[var(--brand-accent)]"
    },
    {
      title: "Study Groups",
      value: "5",
      change: "1 new invite",
      icon: Users,
      color: "text-[var(--warning)]"
    },
    {
      title: "Study Streak",
      value: "12 days",
      change: "Personal best!",
      icon: Award,
      color: "text-[var(--success)]"
    }
  ];

  export const recentGoals = [
    {
      id: "1",
      title: "Complete Data Structures Assignment",
      progress: 75,
      dueDate: "Tomorrow",
      priority: "high"
    },
    {
      id: "2", 
      title: "Review Machine Learning Notes",
      progress: 40,
      dueDate: "This week",
      priority: "medium"
    },
    {
      id: "3",
      title: "Prepare for Systems Design Interview",
      progress: 20,
      dueDate: "Next week",
      priority: "low"
    }
  ];

  export const recentMaterials = [
    {
      id: "1",
      title: "Linear Algebra Lecture Notes",
      type: "PDF",
      subject: "Mathematics",
      uploadedBy: "Dr. Smith",
      uploadedAt: "2 hours ago"
    },
    {
      id: "2",
      title: "React Hooks Tutorial",
      type: "Video",
      subject: "Computer Science",
      uploadedBy: "Sarah Chen",
      uploadedAt: "1 day ago"
    },
    {
      id: "3",
      title: "Database Design Patterns",
      type: "Document",
      subject: "Computer Science", 
      uploadedBy: "Alex Johnson",
      uploadedAt: "2 days ago"
    }
  ];

  export const upcomingEvents = [
    {
      id: "1",
      title: "Study Group: Algorithms",
      time: "2:00 PM",
      type: "group",
      participants: 6
    },
    {
      id: "2",
      title: "Mock Interview Session",
      time: "4:30 PM",
      type: "interview",
      participants: 2
    },
    {
      id: "3",
      title: "CS Career Fair",
      time: "Tomorrow, 10:00 AM",
      type: "event",
      participants: 50
    }
  ];
