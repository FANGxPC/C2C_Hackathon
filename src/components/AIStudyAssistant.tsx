import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Upload, FileText, Bot, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIStudyAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Study Assistant. I can help you understand concepts, summarize materials, and answer questions. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recentQueries = [
    'Explain Binary Search Trees',
    'Summarize OS scheduling algorithms',
    'Help with Dynamic Programming',
    'Machine Learning basics'
  ];

  const recentUploads = [
    { name: 'Data_Structures_Notes.pdf', size: '2.3 MB', date: '2 hours ago' },
    { name: 'OS_Chapter_3.pdf', size: '1.8 MB', date: '1 day ago' },
    { name: 'ML_Algorithms.pdf', size: '3.1 MB', date: '3 days ago' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with typewriter effect
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand you\'re asking about this topic. Let me break it down for you with a clear explanation and examples. This is a placeholder response from the AI assistant that will be powered by RunPod in the future.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const TypewriterMessage: React.FC<{ content: string }> = ({ content }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(prev => prev + content[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      }
    }, [currentIndex, content]);

    return <span>{displayedContent}</span>;
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 text-slate-600"
    >
      <Bot className="h-4 w-4" />
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-slate-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="text-sm">AI is thinking...</span>
    </motion.div>
  );

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">AI Study Assistant</h1>
              <p className="text-slate-600">Get personalized help with your studies</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden md:flex"
            >
              <FileText className="h-4 w-4 mr-2" />
              History & Files
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`p-4 rounded-xl ${
                      message.type === 'user'
                        ? 'bg-amber-500 text-white'
                        : 'bg-white border border-slate-200 shadow-sm'
                    }`}>
                      <div className="space-y-2">
                        <div className={message.type === 'user' ? 'text-white' : 'text-slate-900'}>
                          {index === messages.length - 1 && message.type === 'ai' ? (
                            <TypewriterMessage content={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                        <div className={`text-xs ${
                          message.type === 'user' ? 'text-amber-100' : 'text-slate-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div className="flex justify-start">
                <div className="max-w-3xl flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Bot className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <TypingIndicator />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your studies..."
                className="pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="px-4">
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-l border-slate-200 bg-amber-50 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Recent Queries</h3>
                <div className="space-y-2">
                  {recentQueries.map((query, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full text-left p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-sm text-slate-700 transition-colors"
                      onClick={() => setInputMessage(query)}
                    >
                      {query}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-4">Recent Uploads</h3>
                <div className="space-y-3">
                  {recentUploads.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-3 rounded-lg bg-white border border-slate-200"
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{file.size}</Badge>
                            <span className="text-xs text-slate-500">{file.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIStudyAssistant;