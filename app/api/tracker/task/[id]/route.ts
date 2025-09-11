import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { updateTaskSchema } from '@/lib/validation'
import { updateTask, deleteTask } from '@/lib/services/tracker'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()
    const { id } = params
    
    const body = await request.json()
    const data = updateTaskSchema.parse(body)
    
    const task = await updateTask(id, user.id, data)
    
    return jsonOk(task)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()
    const { id } = params
    
    await deleteTask(id, user.id)
    
    return jsonOk({ success: true })
  } catch (error) {
    return handleError(error)
  }
}