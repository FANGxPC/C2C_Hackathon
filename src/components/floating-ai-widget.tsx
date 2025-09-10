import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Square,
  BookOpen,
  Target,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface FloatingAIWidgetProps {
  context?: string;
}

export function FloatingAIWidget({ context = "dashboard" }: FloatingAIWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('tutor');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your AI assistant. I can help you as a Study Tutor, Goal Coach, or Company Mentor. What would you like to work on today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const modes = [
    { id: 'tutor', label: 'Study Tutor', icon: BookOpen },
    { id: 'coach', label: 'Goal Coach', icon: Target },
    { id: 'mentor', label: 'Company Mentor', icon: Briefcase }
  ];

  const contextMessages = {
    dashboard: "Based on your dashboard activity",
    materials: "Looking at your current materials",
    goals: "Reviewing your goals progress",
    companies: "Analyzing company requirements"
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        tutor: [
          "Let me help you understand this concept better. What specific topic are you struggling with?",
          "Based on your materials, I can create a study plan. Would you like me to break this down into smaller sections?",
          "I notice you're working on this subject. Here are some key points to focus on..."
        ],
        coach: [
          "Great question! Let's break this goal into actionable steps. What's your target deadline?",
          "I can see you're making progress. Here's how to optimize your next steps...",
          "Let's create a milestone plan to keep you motivated and on track."
        ],
        mentor: [
          "This is a great company to target. Based on their requirements, here's what you should focus on...",
          "For this role, I recommend strengthening these specific skills...",
          "Let me help you create a roadmap to prepare for this company's interview process."
        ]
      };

      const modeResponses = responses[activeMode as keyof typeof responses];
      const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-[var(--bg-surface)] rounded-lg shadow-2xl border border-[var(--border)] flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">AI Assistant</h3>
            {context && (
              <Badge variant="secondary" className="text-xs mt-1">
                {contextMessages[context as keyof typeof contextMessages]}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mode Tabs */}
      <Tabs value={activeMode} onValueChange={setActiveMode} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <TabsTrigger 
                key={mode.id} 
                value={mode.id}
                className="text-xs flex items-center space-x-1"
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{mode.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {modes.map((mode) => (
          <TabsContent key={mode.id} value={mode.id} className="flex-1 flex flex-col m-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser
                          ? 'bg-[var(--brand-primary)] text-white'
                          : 'bg-[var(--muted)] text-[var(--text-primary)]'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isUser ? 'text-blue-100' : 'text-[var(--text-muted)]'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--muted)] p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-[var(--border)]">
              <div className="flex space-x-2">
                <Input
                  placeholder={`Ask your ${mode.label.toLowerCase()}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="h-10 w-10 p-0"
                >
                  {isTyping ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}