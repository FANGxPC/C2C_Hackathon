'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Theme mapping for each route
const ROUTE_THEMES: Record<string, string> = {
  '/dashboard': 'theme-dashboard',
  '/ai-assistant': 'theme-ai-assistant',
  '/placement-prep': 'theme-placement-prep',
  '/study-material': 'theme-study-materials',
  '/networking': 'theme-networking',
  '/study-groups': 'theme-study-groups',
  '/learning-tracker': 'theme-learning-tracker',
  '/profile': 'theme-profile'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const themeClass = ROUTE_THEMES[pathname]
    
    // Remove all theme classes
    document.body.classList.remove(...Object.values(ROUTE_THEMES))
    
    // Add current theme class if it exists
    if (themeClass) {
      document.body.classList.add(themeClass)
    }
  }, [pathname])

  return <>{children}</>
}