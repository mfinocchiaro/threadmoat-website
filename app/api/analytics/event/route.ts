import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { trackEvent } from '@/lib/analytics'
import { z } from 'zod'

const EventSchema = z.object({
  event_type: z.string().max(50),
  route: z.string().max(255),
  metadata: z.record(z.unknown()).optional().default({}),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse(null, { status: 401 })
  }

  let data: z.infer<typeof EventSchema>
  try {
    data = EventSchema.parse(await req.json())
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  // Fire and forget — don't block response on DB write
  trackEvent(session.user.id, data.event_type, data.route, data.metadata).catch((err) => {
    console.error('[analytics] Failed to track event:', err)
  })

  return new NextResponse(null, { status: 204 })
}
