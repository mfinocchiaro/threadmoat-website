import { sql } from '@/lib/db'

/**
 * Track an analytics event (server-side).
 * Fire-and-forget — callers should not await this in the request path
 * unless they need confirmation.
 */
export async function trackEvent(
  userId: string,
  eventType: string,
  route: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await sql`
    INSERT INTO analytics_events (user_id, event_type, route, metadata)
    VALUES (${userId}, ${eventType}, ${route}, ${JSON.stringify(metadata)})
  `
}
