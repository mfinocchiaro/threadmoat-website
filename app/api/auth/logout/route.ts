import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await deleteSession()
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Logout error:', error)
    // Still return success even if DB delete fails
    return NextResponse.json({ success: true })
  }
}
