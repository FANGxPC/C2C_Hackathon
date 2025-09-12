import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Bot, 
  Briefcase, 
  Search, 
  Users, 
  MessageSquare,
  TrendingUp,
  User
} from 'lucide-react'

const features = [
  {
    title: 'Dashboard',
    description: 'Track your learning progress and daily goals',
    icon: TrendingUp,
    href: '/dashboard',
    color: 'text-blue-600'
  },
  {
    title: 'AI Study Assistant',
    description: 'Get personalized study recommendations powered by AI',
    icon: Bot,
    href: '/ai-assistant',
    color: 'text-purple-600'
  },
  {
    title: 'Placement Prep',
    description: 'Build your resume and prepare for job interviews',
    icon: Briefcase,
    href: '/placement-prep',
    color: 'text-green-600'
  },
  {
    title: 'Study Materials',
    description: 'Access curated learning resources with semantic search',
    icon: BookOpen,
    href: '/study-material',
    color: 'text-orange-600'
  },
  {
    title: 'Networking',
    description: 'Connect with peers and industry professionals',
    icon: Users,
    href: '/networking',
    color: 'text-pink-600'
  },
  {
    title: 'Study Groups',
    description: 'Join or create collaborative learning groups',
    icon: MessageSquare,
    href: '/study-groups',
    color: 'text-teal-600'
  },
  {
    title: 'Learning Tracker',
    description: 'Monitor your daily learning activities and streaks',
    icon: Search,
    href: '/learning-tracker',
    color: 'text-indigo-600'
  },
  {
    title: 'Profile',
    description: 'Manage your account and learning preferences',
    icon: User,
    href: '/profile',
    color: 'text-amber-600'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-full p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to StudentConnect
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered learning companion for academic success, career preparation, and professional networking.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-muted w-fit">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={feature.href}>Explore</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-primary">8</h3>
              <p className="text-muted-foreground">Learning Modules</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">AI-Powered</h3>
              <p className="text-muted-foreground">Study Assistant</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">Learning Support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}