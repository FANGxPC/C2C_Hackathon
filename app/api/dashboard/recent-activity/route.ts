import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { computeToday, computeWeek, buildSummary } from '@/lib/services/dashboard'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const [todayData, weekStats] = await Promise.all([
      computeToday(user.id),
      computeWeek(user.id)
    ])

    const summary = await buildSummary(user.id, todayData.completed)

    return jsonOk({
      completedToday: todayData.completed,
      completedCount: todayData.completedCount,
      totalToday: todayData.totalCount,
      weekStats,
      summary
    })
  } catch (error) {
    return handleError(error)
  }
}