import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { learningTaskSchema } from '@/lib/validation'
import { createTask, getUserTasks } from '@/lib/services/tracker'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')
    const subject = searchParams.get('subject') || undefined
    const dueDate = searchParams.get('dueDate') || undefined
    
    const filters: any = {}
    if (completed !== null) {
      filters.completed = completed === 'true'
    }
    if (subject) filters.subject = subject
    if (dueDate) filters.dueDate = dueDate
    
    const tasks = await getUserTasks(user.id, filters)
    
    return jsonOk(tasks)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const body = await request.json()
    const data = learningTaskSchema.parse(body)
    
    const task = await createTask(user.id, data)
    
    return jsonOk(task)
  } catch (error) {
    return handleError(error)
  }
}