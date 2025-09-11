import { NextResponse } from 'next/server'

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { 
      success: false, 
      error: { message, code } 
    }, 
    { status }
  )
}

export function handleError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    if (error.message === 'Authentication required') {
      return jsonError('Authentication required', 401, 'AUTH_REQUIRED')
    }
    return jsonError(error.message, 500, 'INTERNAL_ERROR')
  }
  
  return jsonError('An unexpected error occurred', 500, 'UNKNOWN_ERROR')
}