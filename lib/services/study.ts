import { db } from '../db'
import { supabaseAdmin } from '../supabaseClient'

export async function createStudyMaterial(data: {
  ownerId: string
  title: string
  type: 'PDF' | 'YOUTUBE' | 'LINK'
  subject: string
  topics: string[]
  url?: string
  description?: string
}) {
  return await db.studyMaterial.create({
    data,
    include: {
      owner: {
        select: {
          displayName: true,
          email: true
        }
      }
    }
  })
}

export async function uploadPDFToStorage(file: File, userId: string) {
  const fileName = `${userId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabaseAdmin.storage
    .from('materials')
    .upload(fileName, file, {
      contentType: 'application/pdf',
      upsert: false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('materials')
    .getPublicUrl(fileName)

  return publicUrl
}

export async function listStudyMaterials(userId: string, filters: {
  subject?: string
  topics?: string[]
  type?: 'PDF' | 'YOUTUBE' | 'LINK'
  page?: number
  limit?: number
}) {
  const { subject, topics, type, page = 1, limit = 20 } = filters
  const skip = (page - 1) * limit

  const where: any = { ownerId: userId }
  
  if (subject) {
    where.subject = { contains: subject, mode: 'insensitive' }
  }
  
  if (topics && topics.length > 0) {
    where.topics = { hasSome: topics }
  }
  
  if (type) {
    where.type = type
  }

  const [materials, total] = await Promise.all([
    db.studyMaterial.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    }),
    db.studyMaterial.count({ where })
  ])

  return {
    materials,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}