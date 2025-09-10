import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { BookOpen, Users, Target, Brain, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth-provider';

interface AuthProps {
  onNavigate: (page: string) => void;
}

export function Auth({ onNavigate }: AuthProps) {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Failed to sign in');
      } else if (user) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signUp({
        email,
        password,
        fullName: fullName.trim(),
        university: university.trim(),
        major: major.trim(),
      });
      
      if (error) {
        setError(error.message || 'Failed to create account');
      } else if (user) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred during signup');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Access and share educational resources with your study community'
    },
    {
      icon: Users,
      title: 'Study Groups',
      description: 'Join collaborative study sessions with fellow students'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track your academic goals with progress monitoring'
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Get personalized study help, goal coaching, and career mentoring'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-page)] to-blue-50 flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Welcome to
              <span className="block text-[var(--brand-primary)]">Student Connect</span>
            </h1>
            <p className="text-xl text-[var(--text-muted)]">
              Your all-in-one platform for academic success and collaborative learning
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-muted)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-white/50 rounded-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white" />
                ))}
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">Join 10,000+ students</p>
                <p className="text-sm text-[var(--text-muted)]">Already using Student Connect</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-[var(--border)] shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-[var(--text-primary)]">Student Connect</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="text-center">
                      <Button variant="link" className="text-sm" disabled={isLoading}>
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          type="text"
                          placeholder="Your university"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          type="text"
                          placeholder="Your major"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm text-[var(--text-muted)]">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile features preview */}
          <div className="lg:hidden mt-8 space-y-4">
            <h3 className="font-semibold text-[var(--text-primary)] text-center">
              Why choose Student Connect?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white rounded-lg border border-[var(--border)]">
                    <Icon className="h-6 w-6 text-[var(--brand-primary)] mx-auto mb-2" />
                    <h4 className="font-medium text-sm text-[var(--text-primary)]">
                      {feature.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}