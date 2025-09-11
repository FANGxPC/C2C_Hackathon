import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { jsonOk, handleError } from '@/lib/responses'
import { reviewResume } from '@/lib/services/ai'
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    await requireUser()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Please upload a valid PDF file')
    }

    // Extract text from PDF
    const buffer = await file.arrayBuffer()
    const pdfData = await pdfParse(Buffer.from(buffer))
    
    if (!pdfData.text.trim()) {
      throw new Error('Could not extract text from resume')
    }

    // Review using Gemini
    const review = await reviewResume(pdfData.text)
    
    return jsonOk(review)
  } catch (error) {
    return handleError(error)
  }
}