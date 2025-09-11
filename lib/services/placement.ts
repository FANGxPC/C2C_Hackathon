import { db } from '../db'

export async function createMockSession(userId: string, type = 'technical') {
  return await db.mockInterviewSession.create({
    data: {
      userId,
      type,
      status: 'IN_PROGRESS'
    }
  })
}

export async function addMockAnswer(data: {
  sessionId: string
  questionIdx: number
  question: string
  answerText: string
}) {
  return await db.mockAnswer.create({
    data
  })
}

export async function finishMockSession(sessionId: string, review: any) {
  const session = await db.mockInterviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      reviewed: true,
      review: JSON.stringify(review),
      rating: review.overallRating
    },
    include: {
      answers: true
    }
  })

  // Update individual answer ratings
  if (review.questionRatings && review.questionFeedback) {
    await Promise.all(
      session.answers.map((answer, index) =>
        db.mockAnswer.update({
          where: { id: answer.id },
          data: {
            rating: review.questionRatings[index],
            feedback: review.questionFeedback[index]
          }
        })
      )
    )
  }

  return session
}

export async function getPlacementInsights() {
  try {
    const response = await fetch('https://api.simplejobdata.com/v1/jobs', {
      headers: {
        'Authorization': `Api-Key ${process.env.JOBDATA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        query: 'software engineer',
        location: 'United States',
        limit: 10,
        sort_by: 'date_posted'
      })
    })

    if (!response.ok) {
      throw new Error(`Job API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.jobs?.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description?.slice(0, 200) + '...',
      postedDate: job.date_posted,
      url: job.url
    })) || []
  } catch (error) {
    console.error('Error fetching job insights:', error)
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        salary: '$120,000 - $180,000',
        description: 'Join our team to build scalable web applications...',
        postedDate: new Date().toISOString(),
        url: '#'
      }
    ]
  }
}

export const mockInterviewQuestions = [
  "Tell me about yourself and your background in computer science.",
  "What's your experience with data structures and algorithms?",
  "Describe a challenging project you've worked on recently.",
  "How do you approach debugging a complex issue?",
  "Where do you see yourself in your career in 5 years?"
]