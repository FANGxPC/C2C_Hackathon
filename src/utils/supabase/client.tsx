import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client for the frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API client for our server endpoints
export class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-984eea46`;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async signUp(userData: {
    email: string;
    password: string;
    fullName: string;
    university?: string;
    major?: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: {
    full_name?: string;
    university?: string;
    major?: string;
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Goals endpoints
  async getGoals() {
    return this.request('/goals');
  }

  async createGoal(goalData: {
    title: string;
    description?: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    milestones?: Array<{
      id: string;
      title: string;
      completed: boolean;
      due_date?: string;
    }>;
  }) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async getGoal(goalId: string) {
    return this.request(`/goals/${goalId}`);
  }

  async updateGoal(goalId: string, goalData: {
    title?: string;
    description?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'active' | 'completed' | 'paused';
    due_date?: string;
    milestones?: Array<{
      id: string;
      title: string;
      completed: boolean;
      due_date?: string;
    }>;
  }) {
    return this.request(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(goalId: string) {
    return this.request(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  }

  async updateGoalProgress(goalId: string, progress: number) {
    return this.request(`/goals/${goalId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  }

  // Chat endpoints
  async getChatRooms() {
    return this.request('/chat/rooms');
  }

  async createChatRoom(roomData: {
    type: 'direct' | 'group';
    name?: string;
    participants: string[];
  }) {
    return this.request('/chat/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async getChatMessages(roomId: string, limit = 50, before?: string) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(before && { before })
    });
    return this.request(`/chat/rooms/${roomId}/messages?${params}`);
  }

  async sendMessage(roomId: string, messageData: {
    content: string;
    type?: 'text' | 'image' | 'file';
  }) {
    return this.request(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getChatUser(userId: string) {
    return this.request(`/chat/users/${userId}`);
  }

  async searchUsers(query: string) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/chat/users/search?${params}`);
  }
}

export const apiClient = new ApiClient();