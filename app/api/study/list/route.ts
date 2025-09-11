import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { listStudyMaterials } from '@/lib/services/study'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') || undefined
    const topicsParam = searchParams.get('topics')
    const topics = topicsParam ? topicsParam.split(',') : undefined
    const type = searchParams.get('type') as 'PDF' | 'YOUTUBE' | 'LINK' | undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const result = await listStudyMaterials(user.id, {
      subject,
      topics,
      type,
      page,
      limit
    })
    
    return jsonOk(result)
  } catch (error) {
    return handleError(error)
  }
}