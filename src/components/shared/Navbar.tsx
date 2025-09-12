'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard,
  Bot,
  Briefcase,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  User,
  Home
} from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home, theme: '' },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, theme: 'theme-dashboard' },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, theme: 'theme-ai-assistant' },
  { name: 'Placement Prep', href: '/placement-prep', icon: Briefcase, theme: 'theme-placement-prep' },
  { name: 'Study Materials', href: '/study-material', icon: BookOpen, theme: 'theme-study-materials' },
  { name: 'Networking', href: '/networking', icon: Users, theme: 'theme-networking' },
  { name: 'Study Groups', href: '/study-groups', icon: MessageSquare, theme: 'theme-study-groups' },
  { name: 'Learning Tracker', href: '/learning-tracker', icon: TrendingUp, theme: 'theme-learning-tracker' },
  { name: 'Profile', href: '/profile', icon: User, theme: 'theme-profile' }
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">
            StudentConnect
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-all duration-200 animate-sidebar-item',
                isActive 
                  ? 'active bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 animate-icon" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Auth Section removed */}
    </nav>
  )
}
export default Navbar
