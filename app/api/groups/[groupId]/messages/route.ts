import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { groupMessageSchema } from '@/lib/validation'
import { getGroupMessages, createGroupMessage } from '@/lib/services/groups'

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await requireUser()
    const { groupId } = params
    
    const messages = await getGroupMessages(groupId, user.id)
    
    return jsonOk(messages)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await requireUser()
    const { groupId } = params
    
    const body = await request.json()
    const data = groupMessageSchema.parse(body)
    
    const message = await createGroupMessage(groupId, user.id, data)
    
    return jsonOk(message)
  } catch (error) {
    return handleError(error)
  }
}