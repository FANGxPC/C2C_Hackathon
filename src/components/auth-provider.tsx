import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, apiClient } from '../utils/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  university: string;
  major: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signUp: (userData: {
    email: string;
    password: string;
    fullName: string;
    university?: string;
    major?: string;
  }) => Promise<{ user: User | null; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        apiClient.setAccessToken(session.access_token);
        fetchProfile();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        apiClient.setAccessToken(session.access_token);
        await fetchProfile();
      } else {
        apiClient.setAccessToken(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      setProfile(response.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { user: null, error };
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    fullName: string;
    university?: string;
    major?: string;
  }) => {
    try {
      // First create the user account via our server
      await apiClient.signUp(userData);

      // Then sign them in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        console.error('Sign in after signup error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      apiClient.setAccessToken(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await apiClient.updateProfile(data);
      setProfile(response.profile);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}