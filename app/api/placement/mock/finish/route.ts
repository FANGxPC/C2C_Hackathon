import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { finishMockSession } from '@/lib/services/placement'
import { reviewMockInterview } from '@/lib/services/ai'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const body = await request.json()
    const { sessionId } = body
    
    // Get session with answers
    const session = await db.mockInterviewSession.findUnique({
      where: { id: sessionId, userId: user.id },
      include: { answers: true }
    })
    
    if (!session) {
      throw new Error('Session not found')
    }

    // Prepare answers for review
    const answers = session.answers.map(a => ({
      question: a.question,
      answer: a.answerText
    }))

    // Get AI review
    const review = await reviewMockInterview(answers)
    
    // Update session with review
    const updatedSession = await finishMockSession(sessionId, review)
    
    return jsonOk({
      session: updatedSession,
      review
    })
  } catch (error) {
    return handleError(error)
  }
}