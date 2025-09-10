import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Users, 
  Network, 
  Target, 
  Building2, 
  Search,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from './auth-provider';

interface AppShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'materials', label: 'Materials', icon: BookOpen },
  { id: 'chat', label: 'Chat', icon: MessageCircle, badge: 3 },
  { id: 'groups', label: 'Study Groups', icon: Users },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'companies', label: 'Companies', icon: Building2 },
];

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    onNavigate('auth');
  };

  return (
    <div className="flex h-screen bg-[var(--bg-page)]">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-semibold text-[var(--brand-primary)]">
            Student Hub
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-11 ${
                      isActive 
                        ? 'bg-[var(--brand-primary)] text-white' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--muted)]'
                    }`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-[var(--border)]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--muted)] cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {profile?.full_name ? 
                      profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      user?.email?.[0]?.toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {profile?.full_name || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {profile?.major || 'Student'}
                  </p>
                </div>
                <Settings className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-[var(--error)]">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
              <Input
                placeholder="Search materials, groups, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[var(--error)] text-white text-xs">
                2
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>
                    {profile?.full_name ? 
                      profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      user?.email?.[0]?.toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-[var(--error)]">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}