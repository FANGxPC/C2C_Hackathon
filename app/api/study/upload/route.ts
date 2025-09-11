import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { uploadPDFToStorage, createStudyMaterial } from '@/lib/services/study'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subject = formData.get('subject') as string
    const topics = JSON.parse(formData.get('topics') as string || '[]')
    const description = formData.get('description') as string
    
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Please upload a valid PDF file')
    }

    if (!title || !subject) {
      throw new Error('Title and subject are required')
    }

    // Upload to Supabase Storage
    const publicUrl = await uploadPDFToStorage(file, user.id)
    
    // Create database record
    const material = await createStudyMaterial({
      ownerId: user.id,
      title,
      type: 'PDF',
      subject,
      topics,
      url: publicUrl,
      description
    })
    
    return jsonOk(material)
  } catch (error) {
    return handleError(error)
  }
}