import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { createMockSession, mockInterviewQuestions } from '@/lib/services/placement'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const body = await request.json()
    const type = body.type || 'technical'
    
    const session = await createMockSession(user.id, type)
    
    return jsonOk({
      session,
      questions: mockInterviewQuestions
    })
  } catch (error) {
    return handleError(error)
  }
}