import { NextResponse } from 'next/server'

export function jsonOk<T>(data: T) {
  return NextResponse.json(data, { status: 200 })
}

export function jsonError(
  status: number,
  message: string,
  details?: Record<string, any>
) {
  return NextResponse.json(
    {
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

export function jsonBadRequest(message: string, details?: Record<string, any>) {
  return jsonError(400, message, details)
}

export function jsonUnauthorized(message = 'Unauthorized') {
  return jsonError(401, message)
}

export function jsonForbidden(message = 'Forbidden') {
  return jsonError(403, message)
}

export function jsonNotFound(message = 'Not found') {
  return jsonError(404, message)
}

export function jsonInternalError(message = 'Internal server error') {
  return jsonError(500, message)
}