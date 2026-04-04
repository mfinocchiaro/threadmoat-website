/**
 * Fire-and-forget client-side interaction tracking.
 * Calls POST /api/analytics/event — silently swallows errors.
 * Import this in any client component to log interaction events.
 */
export function trackInteraction(
  eventType: string,
  metadata: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return

  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      route: window.location.pathname,
      metadata,
    }),
    keepalive: true,
  }).catch(() => {
    // Best-effort — silently swallow analytics failures
  })
}
