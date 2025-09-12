import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, FileText, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
}); // Vite exposes VITE_* envs to the browser. [15]

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIStudyAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your AI Study Assistant. I can help you understand concepts, summarize materials, and answer questions. How can I assist today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Persist chat: choose ONE storage engine
const STORAGE = localStorage; // change to sessionStorage for “tab session only” [3]

// Load once on mount
useEffect(() => {
  try {
    const raw = STORAGE.getItem('studentconnect_chat_v1');
    if (raw) {
      const parsed = JSON.parse(raw) as Message[];
      const restored = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
      if (restored.length) setMessages(restored);
    }
  } catch {
    // ignore storage parse errors
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // run once to hydrate from storage [1]

// Save every time messages change
useEffect(() => {
  try {
    STORAGE.setItem('studentconnect_chat_v1', JSON.stringify(messages));
  } catch {
    // storage may be full/blocked; ignore for hackathon
  }
}, [messages]); // persist updates on change [2]

  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs to prevent re-render resets
  const typewriterActiveRef = useRef(false);
  const typewriterTextRef = useRef('');     // current displayed text
  const typewriterFullRef = useRef('');     // full final text
  const typewriterTimerRef = useRef<number | null>(null);
  const typewriterMsgIdRef = useRef<string | null>(null); // which message is being typed

  const recentQueries = [
    'Explain Binary Search Trees',
    'Summarize OS scheduling algorithms',
    'Help with Dynamic Programming',
    'Machine Learning basics',
  ];
  const recentUploads = [
    { name: 'Data_Structures_Notes.pdf', size: '2.3 MB', date: '2 hours ago' },
    { name: 'OS_Chapter_3.pdf', size: '1.8 MB', date: '1 day ago' },
    { name: 'ML_Algorithms.pdf', size: '3.1 MB', date: '3 days ago' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }; // Keep scroll on message changes only. [2]

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Don’t tie to input changes to avoid layout churn. [2]

  // Start a ref-based typewriter for the last AI message
  function startTypewriter(msgId: string, fullText: string) {
    stopTypewriter();
    typewriterActiveRef.current = true;
    typewriterMsgIdRef.current = msgId;
    typewriterTextRef.current = '';
    typewriterFullRef.current = fullText;

    const step = () => {
      const current = typewriterTextRef.current.length;
      const nextLen = Math.min(current + 2, typewriterFullRef.current.length);
      typewriterTextRef.current = typewriterFullRef.current.slice(0, nextLen);

      // Force a tiny re-render of only this component, not remount
      setTick((t) => t + 1);

      if (nextLen < typewriterFullRef.current.length && typewriterActiveRef.current) {
        typewriterTimerRef.current = window.setTimeout(step, 12);
      } else {
        typewriterActiveRef.current = false;
        typewriterTimerRef.current = null;
      }
    };
    step();
  }

  function stopTypewriter() {
    typewriterActiveRef.current = false;
    if (typewriterTimerRef.current != null) {
      window.clearTimeout(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
  }

  // Local tick to refresh text without remounting the bubble
  const [, setTick] = useState(0);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    stopTypewriter();

    try {
      const contents = [...messages, userMessage].map((m) => ({
        role: m.type === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })); // Map history to contents. [16]

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction:
            "You are StudentConnect's AI Study Assistant. Answer clearly and concisely in at most ~200 tokens. Use bullets when helpful. If unsure, say so briefly. Also dont use ** or *",
          temperature: 0.6,
          maxOutputTokens: 500,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }); // Constrained output with system instruction. [16][17]

      const text = response.text ?? 'No response'; // Read text from response. [16]

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: text,
        timestamp: new Date(),
      };

      // Add AI message, then start ref-based typewriter on it
      setMessages((prev) => {
        const next = [...prev, aiMessage];
        // Start typewriter on the newly added message
        startTypewriter(aiMessage.id, text);
        return next;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type: 'ai', content: 'Error contacting Gemini.', timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Bubble UI (no AnimatePresence on the list to avoid replays). [2]
  function Bubble({
    message,
    useTypewriter,
  }: {
    message: Message;
    useTypewriter: boolean;
  }) {
    const isCurrentTyping =
      useTypewriter && typewriterMsgIdRef.current === message.id && (typewriterActiveRef.current || typewriterTextRef.current);

    const display =
      isCurrentTyping ? typewriterTextRef.current || '' : message.content;

    return (
      <div
        className={`max-w-3xl flex items-start space-x-3 ${
          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            message.type === 'user' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div
          className={`p-4 rounded-xl ${
            message.type === 'user' ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-2">
            <div className={message.type === 'user' ? 'text-white' : 'text-slate-900'}>{display}</div>
            <div className={`text-xs ${message.type === 'user' ? 'text-amber-100' : 'text-slate-500'}`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastIndex = messages.length - 1;
  const prevMsgs = lastIndex > 0 ? messages.slice(0, lastIndex) : [];
  const lastMsg = lastIndex >= 0 ? messages[lastIndex] : null;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">AI Study Assistant</h1>
              <p className="text-slate-600">Get personalized help with your studies</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {/* Older messages as plain static divs to avoid re-animation on keystrokes */}
            {prevMsgs.map((m) => (
              <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <Bubble message={m} useTypewriter={false} />
              </div>
            ))}

            {/* Latest message: never remount while typing; use ref-driven text */}
            {lastMsg && (
              <div key={lastMsg.id} className={`flex ${lastMsg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Use typewriter only for AI and only with the ref text */}
                <Bubble message={lastMsg} useTypewriter={lastMsg.type === 'ai'} />
              </div>
            )}

            {/* Optional separate typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-3xl flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Bot className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <span className="text-sm text-slate-600">AI is thinking...</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-slate-200">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your studies..."
                className="pr-12"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
          </div>
        </div>
      </div>

      {/* Sidebar unchanged (can be removed if not needed) */}
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
                {recentQueries.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full text-left p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-sm text-slate-700 transition-colors"
                    onClick={() => setInputMessage(q)}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-4">Recent Uploads</h3>
              <div className="space-y-3">
                {recentUploads.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
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
    </div>
  );
};

export default AIStudyAssistant;
