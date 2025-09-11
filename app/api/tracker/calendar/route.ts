import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { getCalendarData } from '@/lib/services/tracker'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '365')
    
    const calendarData = await getCalendarData(user.id, days)
    
    return jsonOk(calendarData)
  } catch (error) {
    return handleError(error)
  }
}