import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Plus,
  Search,
  Send,
  MoreVertical,
  Users,
  Phone,
  Video,
  Paperclip,
  Smile,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { apiClient } from '../../utils/supabase/client';
import { useAuth } from '../auth-provider';

interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  participants: string[];
  created_by: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  edited: boolean;
  edited_at: string | null;
}

interface ChatUser {
  id: string;
  full_name: string;
  university: string;
  major: string;
}

interface ChatProps {
  onNavigate: (page: string) => void;
}

export function Chat({ onNavigate }: ChatProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<Record<string, ChatUser>>({});
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // New chat dialog state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Mobile state
  const [showRoomsList, setShowRoomsList] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagePollingRef = useRef<NodeJS.Timeout>();

  // Load chat rooms on mount
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      
      // Start polling for new messages every 3 seconds
      messagePollingRef.current = setInterval(() => {
        loadMessages(selectedRoom.id, true);
      }, 3000);

      return () => {
        if (messagePollingRef.current) {
          clearInterval(messagePollingRef.current);
        }
      };
    }
  }, [selectedRoom]);

  // Search users with debounce
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getChatRooms();
      setRooms(response.rooms || []);
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
      setError('Failed to load chat rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string, silent = false) => {
    try {
      if (!silent) setMessagesLoading(true);
      const response = await apiClient.getChatMessages(roomId);
      const newMessages = response.messages || [];
      
      // Only update if we have new messages (to avoid unnecessary re-renders)
      if (!silent || newMessages.length !== messages.length) {
        setMessages(newMessages);
        
        // Load user info for messages
        const userIds = [...new Set(newMessages.map(msg => msg.user_id))];
        await loadUsers(userIds);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      if (!silent) {
        setError('Failed to load messages. Please try again.');
      }
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  };

  const loadUsers = async (userIds: string[]) => {
    try {
      const newUsers: Record<string, ChatUser> = { ...users };
      
      for (const userId of userIds) {
        if (!newUsers[userId]) {
          try {
            const response = await apiClient.getChatUser(userId);
            newUsers[userId] = response.user;
          } catch (err) {
            console.error(`Failed to load user ${userId}:`, err);
            // Create a fallback user
            newUsers[userId] = {
              id: userId,
              full_name: 'Unknown User',
              university: '',
              major: ''
            };
          }
        }
      }
      
      setUsers(newUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const sendMessage = async () => {
    if (!selectedRoom || !newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      await apiClient.sendMessage(selectedRoom.id, {
        content: newMessage.trim(),
        type: 'text'
      });
      
      setNewMessage('');
      // Reload messages to show the new message
      await loadMessages(selectedRoom.id, true);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const response = await apiClient.searchUsers(searchQuery);
      setSearchResults(response.users || []);
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const startDirectChat = async (targetUser: ChatUser) => {
    try {
      const response = await apiClient.createChatRoom({
        type: 'direct',
        participants: [targetUser.id]
      });
      
      // Add room to list if it's new
      const existingRoom = rooms.find(r => r.id === response.room.id);
      if (!existingRoom) {
        setRooms(prev => [response.room, ...prev]);
      }
      
      // Select the room
      setSelectedRoom(response.room);
      setIsNewChatOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      setShowRoomsList(false); // Hide rooms list on mobile
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError('Failed to start chat. Please try again.');
    }
  };

  const getRoomDisplayName = (room: ChatRoom): string => {
    if (room.type === 'group') {
      return room.name || `Group Chat`;
    }
    
    // For direct messages, show the other participant's name
    const otherParticipant = room.participants.find(p => p !== user?.id);
    const otherUser = otherParticipant ? users[otherParticipant] : null;
    return otherUser?.full_name || 'Direct Message';
  };

  const getRoomInitials = (room: ChatRoom): string => {
    const name = getRoomDisplayName(room);
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--brand-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Loading Chat</h2>
          <p className="text-[var(--text-muted)]">Setting up your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Rooms sidebar */}
      <div className={`w-80 border-r border-[var(--border)] bg-[var(--bg-surface)] flex flex-col ${
        showRoomsList ? 'block' : 'hidden lg:block'
      }`}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Messages</h1>
            
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Start New Chat</DialogTitle>
                  <DialogDescription>
                    Search for students to start a conversation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
                    <Input
                      placeholder="Search by name, university, or major..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {searchLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {searchResults.map((searchUser) => (
                          <div
                            key={searchUser.id}
                            className="flex items-center p-3 rounded-lg hover:bg-[var(--muted)] cursor-pointer"
                            onClick={() => startDirectChat(searchUser)}
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-[var(--brand-primary)] text-white">
                                {searchUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-[var(--text-primary)]">{searchUser.full_name}</p>
                              <p className="text-sm text-[var(--text-muted)]">
                                {searchUser.university} • {searchUser.major}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  
                  {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
                    <p className="text-center text-[var(--text-muted)] py-4">
                      No users found. Try a different search term.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {rooms.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)]" />
                <p className="text-[var(--text-muted)] mb-4">No conversations yet</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsNewChatOpen(true)}
                >
                  Start your first chat
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id 
                        ? 'bg-[var(--brand-primary)] text-white' 
                        : 'hover:bg-[var(--muted)]'
                    }`}
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowRoomsList(false);
                    }}
                  >
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarFallback className={
                        selectedRoom?.id === room.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[var(--brand-primary)] text-white'
                      }>
                        {getRoomInitials(room)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedRoom?.id === room.id 
                          ? 'text-white' 
                          : 'text-[var(--text-primary)]'
                      }`}>
                        {getRoomDisplayName(room)}
                      </p>
                      <p className={`text-sm truncate ${
                        selectedRoom?.id === room.id 
                          ? 'text-white/70' 
                          : 'text-[var(--text-muted)]'
                      }`}>
                        {room.message_count} messages
                      </p>
                    </div>
                    {room.type === 'group' && (
                      <Badge className="ml-2" variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {room.participants.length}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${
        showRoomsList ? 'hidden lg:flex' : 'flex'
      }`}>
        {selectedRoom ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden mr-2"
                  onClick={() => setShowRoomsList(true)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-[var(--brand-primary)] text-white">
                    {getRoomInitials(selectedRoom)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    {getRoomDisplayName(selectedRoom)}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {selectedRoom.participants.length} participants
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)]" />
                    <p className="text-[var(--text-muted)]">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const messageUser = users[message.user_id];
                    const isOwnMessage = message.user_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarFallback className="bg-[var(--brand-primary)] text-white text-xs">
                                {messageUser?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`${isOwnMessage ? 'mr-2' : ''}`}>
                            {!isOwnMessage && (
                              <p className="text-xs text-[var(--text-muted)] mb-1 ml-1">
                                {messageUser?.full_name || 'Unknown User'}
                              </p>
                            )}
                            <div
                              className={`p-3 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-[var(--brand-primary)] text-white rounded-br-md'
                                  : 'bg-[var(--muted)] text-[var(--text-primary)] rounded-bl-md'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-white/70' : 'text-[var(--text-muted)]'
                              }`}>
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={sendingMessage}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || sendingMessage}
                  size="sm"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Select a conversation</h2>
              <p className="text-[var(--text-muted)] mb-4">
                Choose a chat from the sidebar to start messaging
              </p>
              <Button onClick={() => setIsNewChatOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}