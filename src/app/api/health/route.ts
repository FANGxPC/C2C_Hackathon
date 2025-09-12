import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(
      {
        ok: true,
        ts: new Date().toISOString(),
        status: 'healthy',
        service: 'StudentConnect API'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        ts: new Date().toISOString(),
        status: 'error',
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}