import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { db } from './db'

export async function getUser() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Get or create user profile
    let profile = await db.user.findUnique({
      where: { id: user.id }
    })

    if (!profile) {
      profile = await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
          displayName: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatarUrl: user.user_metadata?.avatar_url
        }
      })
    }

    return profile
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function requireUser() {
  const user = await getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}