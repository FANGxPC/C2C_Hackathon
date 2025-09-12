import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Send, Users, Hash, Pin, Search, Plus, MessageSquare, FileText } from 'lucide-react';

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

const LS_MESSAGES_KEY = 'studyGroups_messages_v1';

function deserializeMessages(json: string): Record<string, Message[]> {
  const parsed = JSON.parse(json) as Record<string, any[]>;
  const out: Record<string, Message[]> = {};
  for (const key in parsed) {
    out[key] = (parsed[key] || []).map((m: any) => ({
      id: String(m.id),
      user: String(m.user),
      content: String(m.content),
      // revive Date from string/number
      timestamp: new Date(m.timestamp),
      type: m.type === 'resource' || m.type === 'announcement' ? m.type : 'message',
    }));
  }
  return out;
}

export const StudyGroups: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('dsa-group');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    { id: 'dsa-group', name: 'DSA Group', topic: 'Data Structures & Algorithms', members: 156, lastActivity: '2 min ago', unread: 3 },
    { id: 'os-group', name: 'OS Group', topic: 'Operating Systems', members: 89, lastActivity: '15 min ago', unread: 1 },
    { id: 'ml-group', name: 'ML Group', topic: 'Machine Learning', members: 203, lastActivity: '1 hour ago' },
    { id: 'web-dev', name: 'Web Dev', topic: 'Full Stack Development', members: 134, lastActivity: '3 hours ago' },
    { id: 'interview-prep', name: 'Interview Prep', topic: 'Technical Interviews', members: 267, lastActivity: '30 min ago', pinned: true, unread: 5 },
    { id: 'competitive-programming', name: 'Competitive Programming', topic: 'CP & Contests', members: 98, lastActivity: '2 hours ago' },
    { id: 'system-design', name: 'System Design', topic: 'Scalable Architecture & Design', members: 189, lastActivity: '45 min ago', unread: 2 },
    { id: 'database-systems', name: 'Database Systems', topic: 'SQL, NoSQL & Database Design', members: 145, lastActivity: '1.5 hours ago' },
    { id: 'ai-research', name: 'AI Research', topic: 'Deep Learning & AI Papers', members: 234, lastActivity: '20 min ago', unread: 7 },
    { id: 'mobile-dev', name: 'Mobile Dev', topic: 'iOS & Android Development', members: 178, lastActivity: '2.5 hours ago' },
    { id: 'devops-cloud', name: 'DevOps & Cloud', topic: 'AWS, Docker, Kubernetes', members: 167, lastActivity: '1 hour ago', unread: 1 },
    { id: 'frontend-masters', name: 'Frontend Masters', topic: 'React, Vue, Angular Deep Dive', members: 198, lastActivity: '40 min ago' },
    { id: 'blockchain-crypto', name: 'Blockchain & Crypto', topic: 'Smart Contracts & DeFi', members: 123, lastActivity: '3 hours ago' },
    { id: 'cybersecurity', name: 'Cybersecurity', topic: 'Ethical Hacking & Security', members: 156, lastActivity: '1.2 hours ago', unread: 3 },
    { id: 'game-dev', name: 'Game Development', topic: 'Unity, Unreal & Game Design', members: 134, lastActivity: '2 hours ago' },
    { id: 'data-science', name: 'Data Science', topic: 'Python, R & Analytics', members: 289, lastActivity: '25 min ago', unread: 4 },
    { id: 'quantum-computing', name: 'Quantum Computing', topic: 'Qubits & Quantum Algorithms', members: 67, lastActivity: '4 hours ago' },
    { id: 'startup-founders', name: 'Startup Founders', topic: 'Entrepreneurship & Business', members: 145, lastActivity: '1.8 hours ago' },
    { id: 'open-source', name: 'Open Source', topic: 'Contributing to OSS Projects', members: 167, lastActivity: '50 min ago', unread: 2 },
    { id: 'career-guidance', name: 'Career Guidance', topic: 'Job Search & Professional Growth', members: 234, lastActivity: '35 min ago', pinned: true, unread: 6 }
  ];

  const initialMessages: Record<string, Message[]> = {
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
      },
      {
        id: '3',
        user: 'Rachel Green',
        content: 'Also worth noting that mutexes have ownership - only the thread that locked it can unlock it.',
        timestamp: new Date(Date.now() - 500000),
        type: 'message'
      },
      {
        id: '4',
        user: 'OS Study Bot',
        content: '📚 Resource: Check out the classic "Producer-Consumer" problem to understand semaphores better!',
        timestamp: new Date(Date.now() - 400000),
        type: 'resource'
      }
    ],
    'ml-group': [
      {
        id: '1',
        user: 'Dr. Maya Patel',
        content: 'Today we\'re discussing attention mechanisms in transformers. Who can explain why attention is "all you need"?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Kevin Liu',
        content: 'Attention allows the model to focus on relevant parts of the input sequence when generating each output token, solving the limitation of RNNs with long sequences.',
        timestamp: new Date(Date.now() - 3300000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Sophia Chen',
        content: 'The self-attention mechanism computes attention weights between all pairs of positions in the sequence, allowing for parallel processing.',
        timestamp: new Date(Date.now() - 3000000),
        type: 'message'
      },
      {
        id: '4',
        user: 'AI Research Bot',
        content: '📄 Latest paper: "Attention is All You Need" - https://arxiv.org/abs/1706.03762',
        timestamp: new Date(Date.now() - 2700000),
        type: 'resource'
      }
    ],
    'web-dev': [
      {
        id: '1',
        user: 'Jordan Martinez',
        content: 'What\'s everyone\'s preferred state management solution for React apps in 2024?',
        timestamp: new Date(Date.now() - 10800000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Lisa Wang',
        content: 'I\'ve been loving Zustand for its simplicity. Redux Toolkit is still great for complex apps though.',
        timestamp: new Date(Date.now() - 10500000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Marcus Johnson',
        content: 'Don\'t sleep on the built-in Context API + useReducer for medium-sized apps!',
        timestamp: new Date(Date.now() - 10200000),
        type: 'message'
      },
      {
        id: '4',
        user: 'Frontend Bot',
        content: '⚛️ React 19 is bringing some exciting state management improvements!',
        timestamp: new Date(Date.now() - 9900000),
        type: 'announcement'
      }
    ],
    'interview-prep': [
      {
        id: '1',
        user: 'Career Coach Sarah',
        content: 'Mock interview session starts in 10 minutes! Topic: System Design - Design a Chat Application',
        timestamp: new Date(Date.now() - 1800000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'Ahmed Hassan',
        content: 'I just had my Google interview! The system design question was about designing a URL shortener like bit.ly',
        timestamp: new Date(Date.now() - 1500000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Jennifer Wu',
        content: 'How did you approach the scalability requirements? Did they ask about database sharding?',
        timestamp: new Date(Date.now() - 1200000),
        type: 'message'
      },
      {
        id: '4',
        user: 'Ahmed Hassan',
        content: 'Yes! I discussed horizontal partitioning, caching strategies with Redis, and load balancing. They were impressed with the CDN discussion.',
        timestamp: new Date(Date.now() - 900000),
        type: 'message'
      },
      {
        id: '5',
        user: 'Carlos Santos',
        content: 'Congrats! Did they ask about the encoding algorithm for generating short URLs?',
        timestamp: new Date(Date.now() - 600000),
        type: 'message'
      }
    ],
    'competitive-programming': [
      {
        id: '1',
        user: 'CodeMaster Alex',
        content: 'Codeforces Round 925 starts in 2 hours! Anyone participating?',
        timestamp: new Date(Date.now() - 7200000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'Nina Kumar',
        content: 'Definitely! I\'ve been practicing graph algorithms all week.',
        timestamp: new Date(Date.now() - 6900000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Ryan O\'Connor',
        content: 'Any tips for the DP problems? I always struggle with optimization.',
        timestamp: new Date(Date.now() - 6600000),
        type: 'message'
      },
      {
        id: '4',
        user: 'CP Mentor Bot',
        content: '💡 Tip: Start with the recursive solution, then add memoization, finally convert to bottom-up DP.',
        timestamp: new Date(Date.now() - 6300000),
        type: 'resource'
      }
    ],
    'system-design': [
      {
        id: '1',
        user: 'Principal Engineer Sam',
        content: 'Let\'s discuss designing a distributed cache system. What are the key considerations?',
        timestamp: new Date(Date.now() - 2700000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Priya Sharma',
        content: 'Consistency, partition tolerance, and availability trade-offs. Also cache eviction policies like LRU, LFU.',
        timestamp: new Date(Date.now() - 2400000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Tech Lead Mike',
        content: 'Don\'t forget about cache warming strategies and handling cache stampede scenarios.',
        timestamp: new Date(Date.now() - 2100000),
        type: 'message'
      }
    ],
    'database-systems': [
      {
        id: '1',
        user: 'DB Expert Elena',
        content: 'Question: When would you choose a document database over a relational database?',
        timestamp: new Date(Date.now() - 5400000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Brandon Taylor',
        content: 'When you have flexible schema requirements, need horizontal scaling, or dealing with nested/hierarchical data.',
        timestamp: new Date(Date.now() - 5100000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Database Bot',
        content: '📊 MongoDB vs PostgreSQL comparison guide: https://docs.example.com/db-comparison',
        timestamp: new Date(Date.now() - 4800000),
        type: 'resource'
      }
    ],
    'ai-research': [
      {
        id: '1',
        user: 'Research Lead Anna',
        content: 'Exciting news! GPT-4 Turbo has been updated with better reasoning capabilities.',
        timestamp: new Date(Date.now() - 1200000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'PhD Student John',
        content: 'Has anyone experimented with the new multimodal features? I\'m curious about vision-language tasks.',
        timestamp: new Date(Date.now() - 900000),
        type: 'message'
      },
      {
        id: '3',
        user: 'ML Researcher Zoe',
        content: 'Yes! The image understanding is remarkably improved. Great for document analysis and chart interpretation.',
        timestamp: new Date(Date.now() - 600000),
        type: 'message'
      }
    ],
    'mobile-dev': [
      {
        id: '1',
        user: 'iOS Dev Maria',
        content: 'SwiftUI vs UIKit in 2024 - what\'s your preference for new projects?',
        timestamp: new Date(Date.now() - 9000000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Android Dev Chris',
        content: 'On Android side, Jetpack Compose is definitely the way forward. Much cleaner than XML layouts.',
        timestamp: new Date(Date.now() - 8700000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Flutter Dev Amy',
        content: 'Don\'t forget about cross-platform solutions! Flutter 3.0 has excellent performance.',
        timestamp: new Date(Date.now() - 8400000),
        type: 'message'
      }
    ],
    'devops-cloud': [
      {
        id: '1',
        user: 'DevOps Engineer Tom',
        content: 'Kubernetes vs Docker Swarm - what are you using for container orchestration?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Cloud Architect Lisa',
        content: 'K8s all the way! The ecosystem and community support are unmatched.',
        timestamp: new Date(Date.now() - 3300000),
        type: 'message'
      },
      {
        id: '3',
        user: 'SRE Bot',
        content: '☁️ Best practices for Kubernetes security: https://kubernetes.io/docs/concepts/security/',
        timestamp: new Date(Date.now() - 3000000),
        type: 'resource'
      }
    ],
    'frontend-masters': [
      {
        id: '1',
        user: 'React Expert Paul',
        content: 'React 19 concurrent features are game-changing. Server Components are finally stable!',
        timestamp: new Date(Date.now() - 2400000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Vue Enthusiast Kate',
        content: 'Vue 3.4 composition API improvements are also incredible. The DX keeps getting better.',
        timestamp: new Date(Date.now() - 2100000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Frontend Bot',
        content: '🎨 CSS Container Queries are now supported in all major browsers!',
        timestamp: new Date(Date.now() - 1800000),
        type: 'announcement'
      }
    ],
    'blockchain-crypto': [
      {
        id: '1',
        user: 'DeFi Developer Max',
        content: 'Working on a new AMM protocol. Anyone familiar with concentrated liquidity like Uniswap V3?',
        timestamp: new Date(Date.now() - 10800000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Solidity Dev Emma',
        content: 'Yes! The math is complex but the capital efficiency gains are huge. Watch out for impermanent loss though.',
        timestamp: new Date(Date.now() - 10500000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Crypto Bot',
        content: '₿ Ethereum 2.0 staking rewards calculator: https://eth2calculator.example.com',
        timestamp: new Date(Date.now() - 10200000),
        type: 'resource'
      }
    ],
    'cybersecurity': [
      {
        id: '1',
        user: 'Security Expert Rob',
        content: 'New zero-day vulnerability discovered in popular web framework. Patches available.',
        timestamp: new Date(Date.now() - 4320000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'Ethical Hacker Jane',
        content: 'Just completed a penetration test. SQL injection is still way too common in 2024.',
        timestamp: new Date(Date.now() - 4020000),
        type: 'message'
      },
      {
        id: '3',
        user: 'InfoSec Bot',
        content: '🔒 OWASP Top 10 2024 update: https://owasp.org/www-project-top-ten/',
        timestamp: new Date(Date.now() - 3720000),
        type: 'resource'
      }
    ],
    'game-dev': [
      {
        id: '1',
        user: 'Game Designer Alex',
        content: 'Unity 2024.1 is out! The new rendering pipeline improvements are impressive.',
        timestamp: new Date(Date.now() - 7200000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'Indie Dev Sarah',
        content: 'Anyone tried Godot 4.0? Considering switching from Unity for my next project.',
        timestamp: new Date(Date.now() - 6900000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Graphics Programmer Joe',
        content: 'Godot\'s GDScript is surprisingly pleasant to work with. Great for rapid prototyping.',
        timestamp: new Date(Date.now() - 6600000),
        type: 'message'
      }
    ],
    'data-science': [
      {
        id: '1',
        user: 'Data Scientist Laura',
        content: 'Working on a churn prediction model. Random Forest vs XGBoost - thoughts?',
        timestamp: new Date(Date.now() - 1500000),
        type: 'message'
      },
      {
        id: '2',
        user: 'ML Engineer David',
        content: 'XGBoost typically performs better but Random Forest is more interpretable. Depends on your use case.',
        timestamp: new Date(Date.now() - 1200000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Stats Professor Ana',
        content: 'Don\'t forget to validate your feature importance! SHAP values are great for explainability.',
        timestamp: new Date(Date.now() - 900000),
        type: 'message'
      },
      {
        id: '4',
        user: 'Data Science Bot',
        content: '📈 Kaggle competition: Predict customer lifetime value - $50k prize pool!',
        timestamp: new Date(Date.now() - 600000),
        type: 'announcement'
      }
    ],
    'quantum-computing': [
      {
        id: '1',
        user: 'Quantum Researcher Dr. Kim',
        content: 'IBM just announced their 1000-qubit processor roadmap. Thoughts on quantum advantage?',
        timestamp: new Date(Date.now() - 14400000),
        type: 'message'
      },
      {
        id: '2',
        user: 'Physics PhD Alice',
        content: 'Error correction remains the biggest challenge. Need millions of physical qubits for fault-tolerant logical qubits.',
        timestamp: new Date(Date.now() - 14100000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Quantum Dev Bob',
        content: 'Qiskit 1.0 is amazing for learning. The circuit visualization tools are top-notch.',
        timestamp: new Date(Date.now() - 13800000),
        type: 'message'
      }
    ],
    'startup-founders': [
      {
        id: '1',
        user: 'Serial Entrepreneur Mark',
        content: 'Raising Series A in this market - any tips on investor meetings?',
        timestamp: new Date(Date.now() - 6480000),
        type: 'message'
      },
      {
        id: '2',
        user: 'VC Partner Jessica',
        content: 'Focus on unit economics and clear path to profitability. Investors are more cautious now.',
        timestamp: new Date(Date.now() - 6180000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Startup Mentor Bot',
        content: '💼 Y Combinator Startup School is free: https://startupschool.org',
        timestamp: new Date(Date.now() - 5880000),
        type: 'resource'
      }
    ],
    'open-source': [
      {
        id: '1',
        user: 'OSS Maintainer Sofia',
        content: 'Hacktoberfest 2024 is coming! Great time to contribute to open source projects.',
        timestamp: new Date(Date.now() - 3000000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'First-time Contributor Tim',
        content: 'Made my first PR to a major project today! The maintainers were so helpful.',
        timestamp: new Date(Date.now() - 2700000),
        type: 'message'
      },
      {
        id: '3',
        user: 'GitHub Expert Luna',
        content: 'Start with documentation fixes and small bug reports. Great way to understand the codebase.',
        timestamp: new Date(Date.now() - 2400000),
        type: 'message'
      }
    ],
    'career-guidance': [
      {
        id: '1',
        user: 'Career Coach Rachel',
        content: 'Mock interview results are in! 90% improvement in System Design scores this month.',
        timestamp: new Date(Date.now() - 2100000),
        type: 'announcement'
      },
      {
        id: '2',
        user: 'Job Seeker Maya',
        content: 'Finally got an offer from my dream company! The practice sessions here were invaluable.',
        timestamp: new Date(Date.now() - 1800000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Senior Engineer Carlos',
        content: 'Congratulations! What was the most helpful part of your preparation?',
        timestamp: new Date(Date.now() - 1500000),
        type: 'message'
      },
      {
        id: '4',
        user: 'Job Seeker Maya',
        content: 'The behavioral interview practice made a huge difference. Technical skills aren\'t everything!',
        timestamp: new Date(Date.now() - 1200000),
        type: 'message'
      },
      {
        id: '5',
        user: 'Career Bot',
        content: '🎯 Salary negotiation workshop next Tuesday at 7 PM EST. RSVP in #events',
        timestamp: new Date(Date.now() - 900000),
        type: 'resource'
      }
    ]
  };

  const currentMessages = messages[selectedChannel] || [];
  const currentChannel = channels.find(c => c.id === selectedChannel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load from localStorage once on mount; fallback to initialMessages
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_MESSAGES_KEY);
      if (saved) {
        setMessages(deserializeMessages(saved));
      } else {
        setMessages(initialMessages);
      }
    } catch {
      setMessages(initialMessages);
    }
  }, []);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      // Dates will be serialized to ISO strings automatically
      localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota or serialization errors
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannel, currentMessages]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'You',
      content: messageInput,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), newMessage]
    }));

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
    <div className="flex h-full">
      {/* Sidebar - Channels */}
      <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col h-full">
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

        <ScrollArea className="flex-1 p-2 max-h-[calc(100vh-200px)]">
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
      <div className="flex-1 flex flex-col h-full">
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
                        {message.user.split(' ').map(n => n).join('')}
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
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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
    </div>
  );
};

export default StudyGroups;
