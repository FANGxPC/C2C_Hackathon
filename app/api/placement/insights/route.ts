import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { getPlacementInsights } from '@/lib/services/placement'

export async function GET(request: NextRequest) {
  try {
    await requireUser()
    
    const insights = await getPlacementInsights()
    
    return jsonOk({ jobs: insights })
  } catch (error) {
    return handleError(error)
  }
}