import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { studyMaterialSchema } from '@/lib/validation'
import { createStudyMaterial } from '@/lib/services/study'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    
    const body = await request.json()
    const data = studyMaterialSchema.parse(body)
    
    if (!data.url) {
      throw new Error('URL is required for link materials')
    }
    
    const material = await createStudyMaterial({
      ownerId: user.id,
      ...data
    })
    
    return jsonOk(material)
  } catch (error) {
    return handleError(error)
  }
}