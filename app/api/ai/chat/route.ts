import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { chatRequestSchema } from '@/lib/validation'
import { eduChat } from '@/lib/services/ai'

export async function POST(request: NextRequest) {
  try {
    await requireUser()
    
    const body = await request.json()
    const { messages } = chatRequestSchema.parse(body)
    
    const response = await eduChat(messages)
    
    return jsonOk({ message: response })
  } catch (error) {
    return handleError(error)
  }
}