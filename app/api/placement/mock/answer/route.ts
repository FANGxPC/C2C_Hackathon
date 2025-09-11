import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { mockAnswerSchema } from '@/lib/validation'
import { addMockAnswer } from '@/lib/services/placement'

export async function POST(request: NextRequest) {
  try {
    await requireUser()
    
    const body = await request.json()
    const data = mockAnswerSchema.parse(body)
    
    const answer = await addMockAnswer(data)
    
    return jsonOk(answer)
  } catch (error) {
    return handleError(error)
  }
}