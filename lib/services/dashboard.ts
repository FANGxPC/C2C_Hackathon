import { db } from '../db'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format } from 'date-fns'

export async function computeToday(userId: string) {
  const today = new Date()
  const startDay = startOfDay(today)
  const endDay = endOfDay(today)

  const [completedToday, totalToday] = await Promise.all([
    db.learningTask.findMany({
      where: {
        userId,
        completed: true,
        completedAt: {
          gte: startDay,
          lte: endDay
        }
      },
      select: {
        id: true,
        title: true,
        subject: true,
        completedAt: true
      }
    }),
    db.learningTask.count({
      where: {
        userId,
        dueDate: {
          gte: startDay,
          lte: endDay
        }
      }
    })
  ])

  return {
    completed: completedToday,
    completedCount: completedToday.length,
    totalCount: totalToday
  }
}

export async function computeWeek(userId: string) {
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  const dailyProgress = await db.dailyProgress.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd
      }
    }
  })

  const weekStats = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    
    const progress = dailyProgress.find(p => 
      format(p.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
    
    weekStats.push({
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      completedCount: progress?.completedCount || 0,
      totalCount: progress?.totalCount || 0,
      percentage: progress?.totalCount ? 
        Math.round((progress.completedCount / progress.totalCount) * 100) : 0
    })
  }

  return weekStats
}

export async function buildSummary(userId: string, completedTasks: any[]) {
  if (completedTasks.length === 0) {
    return "No tasks completed today. Ready to start your learning journey!"
  }

  const subjects = [...new Set(completedTasks.map(t => t.subject).filter(Boolean))]
  const subjectText = subjects.length > 0 ? subjects.join(', ') : 'various topics'
  
  return `Great progress today! Completed ${completedTasks.length} task${completedTasks.length > 1 ? 's' : ''} in ${subjectText}. Keep up the momentum!`
}