import { db } from '../db'
import { startOfDay, endOfDay, format, subDays } from 'date-fns'

export async function createTask(userId: string, data: {
  title: string
  subject?: string
  description?: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
}) {
  const task = await db.learningTask.create({
    data: {
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    }
  })

  // Update daily progress for due date
  if (data.dueDate) {
    await updateDailyProgress(userId, new Date(data.dueDate))
  }

  return task
}

export async function updateTask(taskId: string, userId: string, data: any) {
  const task = await db.learningTask.update({
    where: { id: taskId, userId },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completedAt: data.completed ? new Date() : null
    }
  })

  // Update daily progress
  if (task.dueDate) {
    await updateDailyProgress(userId, task.dueDate)
  }

  return task
}

export async function deleteTask(taskId: string, userId: string) {
  const task = await db.learningTask.findUnique({
    where: { id: taskId, userId }
  })

  if (task) {
    await db.learningTask.delete({
      where: { id: taskId, userId }
    })

    // Update daily progress
    if (task.dueDate) {
      await updateDailyProgress(userId, task.dueDate)
    }
  }

  return task
}

export async function getUserTasks(userId: string, filters: {
  completed?: boolean
  subject?: string
  dueDate?: string
}) {
  const where: any = { userId }
  
  if (filters.completed !== undefined) {
    where.completed = filters.completed
  }
  
  if (filters.subject) {
    where.subject = { contains: filters.subject, mode: 'insensitive' }
  }
  
  if (filters.dueDate) {
    const date = new Date(filters.dueDate)
    where.dueDate = {
      gte: startOfDay(date),
      lte: endOfDay(date)
    }
  }

  return await db.learningTask.findMany({
    where,
    orderBy: [
      { completed: 'asc' },
      { dueDate: 'asc' },
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  })
}

export async function getCalendarData(userId: string, days = 365) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)

  const progress = await db.dailyProgress.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  })

  return progress.map(p => ({
    date: format(p.date, 'yyyy-MM-dd'),
    count: p.completedCount,
    level: getHeatmapLevel(p.completedCount, p.totalCount)
  }))
}

function getHeatmapLevel(completed: number, total: number): number {
  if (total === 0) return 0
  const percentage = (completed / total) * 100
  
  if (percentage >= 90) return 4
  if (percentage >= 70) return 3
  if (percentage >= 50) return 2
  if (percentage >= 25) return 1
  return 0
}

async function updateDailyProgress(userId: string, date: Date) {
  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)

  const [completed, total] = await Promise.all([
    db.learningTask.count({
      where: {
        userId,
        completed: true,
        dueDate: { gte: dayStart, lte: dayEnd }
      }
    }),
    db.learningTask.count({
      where: {
        userId,
        dueDate: { gte: dayStart, lte: dayEnd }
      }
    })
  ])

  await db.dailyProgress.upsert({
    where: {
      userId_date: {
        userId,
        date: dayStart
      }
    },
    update: {
      completedCount: completed,
      totalCount: total
    },
    create: {
      userId,
      date: dayStart,
      completedCount: completed,
      totalCount: total
    }
  })
}