import { z } from 'zod'

// AI Chat
export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })),
  persona: z.string().optional().default('edu')
})

// Study Material
export const studyMaterialSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['PDF', 'YOUTUBE', 'LINK']),
  subject: z.string().min(1),
  topics: z.array(z.string()),
  url: z.string().url().optional(),
  description: z.string().optional()
})

// Learning Task
export const learningTaskSchema = z.object({
  title: z.string().min(1),
  subject: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  completed: z.boolean().optional()
})

// Mock Interview
export const mockAnswerSchema = z.object({
  sessionId: z.string(),
  questionIdx: z.number(),
  question: z.string(),
  answerText: z.string().min(1)
})

// Group Message
export const groupMessageSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['message', 'announcement', 'resource']).default('message')
})