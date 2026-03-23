# Phase 4: Transactional Email Polish - Research

**Researched:** 2026-03-23
**Domain:** Transactional email with Resend + React Email in Next.js
**Confidence:** HIGH

## Summary

ThreadMoat already has a working Resend integration in `lib/email.ts` that sends verification and password-reset emails using raw HTML strings. The Phase 4 goal is to (1) add two new email types (welcome on subscription, receipt on payment), (2) upgrade all email templates to professionally branded React Email components, and (3) wire the new emails into the existing Stripe webhook handler.

The existing Stripe webhook at `app/api/webhooks/stripe/route.ts` already handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed`. The welcome email should fire on `checkout.session.completed` for subscription mode, and the receipt email should fire on `invoice.payment_succeeded` (a new event to handle). The webhook already resolves user identity via `session.metadata.user_id` and `profiles.stripe_customer_id`, so email sending can be added directly into these handlers.

**Primary recommendation:** Install `@react-email/components` (no need for the full `react-email` dev server in production). Create a shared email layout component with ThreadMoat branding (dark background, violet accent `#7c3aed`, logo). Build 4 templates total (verification, password reset, welcome, receipt) as React components in an `emails/` directory. Refactor `lib/email.ts` to render these components via Resend's native React support. Wire welcome/receipt sends into the Stripe webhook handler.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EMAIL-01 | Welcome email sent on successful subscription | Stripe webhook `checkout.session.completed` already handled; add `sendWelcomeEmail()` call after subscription insert. User email available via `session.customer_details.email` or DB lookup. |
| EMAIL-02 | Payment receipt email on successful charge | Add `invoice.payment_succeeded` event handler to webhook. Invoice object contains amount, currency, hosted_invoice_url, period dates. |
| EMAIL-03 | Email templates professionally styled with ThreadMoat branding | Use `@react-email/components` with shared layout component. Brand colors: `#7c3aed` (violet), dark backgrounds (`#0a0a0a`), `#e5e5e5` text. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | 6.9.3 (installed) | Email sending API | Already in use, native React Email support via `react` param |
| @react-email/components | 1.0.10 | Email-safe React components (Html, Head, Body, Container, Text, Button, etc.) | Official companion to Resend; compiles to cross-client HTML |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-email | 5.2.10 | Dev preview server for templates | Optional dev convenience (`npx email dev`); NOT needed in production |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @react-email/components | Raw HTML strings | Already in use; works but harder to maintain, no component reuse, no preview |
| @react-email/components | MJML | Heavier, separate syntax, no React ecosystem benefit |

**Installation:**
```bash
npm install @react-email/components
```

The `react-email` dev server package is optional. It provides a local preview UI (`npx email dev`) which is useful during template development but is not required for production. Install only if preview workflow is desired:
```bash
npm install -D react-email
```

## Architecture Patterns

### Recommended Project Structure
```
emails/
  components/
    layout.tsx          # Shared branded layout (header, footer, colors)
  welcome.tsx           # Welcome email template
  receipt.tsx           # Payment receipt template
  verification.tsx      # Verification email template (migrated from HTML)
  password-reset.tsx    # Password reset template (migrated from HTML)
lib/
  email.ts              # Refactored: uses React templates, exports send functions
app/api/webhooks/stripe/
  route.ts              # Extended: adds welcome + receipt email sends
```

### Pattern 1: Shared Email Layout Component
**What:** A reusable layout wrapping all emails with ThreadMoat branding (dark header with logo, body container, footer with unsubscribe/company info).
**When to use:** Every email template wraps its content in this layout.
**Example:**
```typescript
// emails/components/layout.tsx
import {
  Html, Head, Body, Container, Section, Text, Img, Hr,
  Preview, Font
} from '@react-email/components'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header with brand */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Text style={{ color: '#7c3aed', fontSize: '24px', fontWeight: 'bold' }}>
              ThreadMoat
            </Text>
          </Section>
          {/* Content */}
          <Section style={{
            backgroundColor: '#171717',
            borderRadius: '8px',
            padding: '32px',
            border: '1px solid #262626',
          }}>
            {children}
          </Section>
          {/* Footer */}
          <Section style={{ textAlign: 'center', marginTop: '32px' }}>
            <Text style={{ color: '#737373', fontSize: '12px' }}>
              ThreadMoat Inc. - Market Intelligence for Industrial AI
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

### Pattern 2: Resend with React Components
**What:** Resend's `send()` method accepts a `react` parameter instead of `html`, rendering React Email components server-side.
**When to use:** All email sends.
**Example:**
```typescript
// lib/email.ts
import { Resend } from 'resend'
import { WelcomeEmail } from '@/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string, planName: string) {
  const { data, error } = await resend.emails.send({
    from: 'ThreadMoat <noreply@threadmoat.com>',
    to: email,
    subject: 'Welcome to ThreadMoat',
    react: WelcomeEmail({ name, planName }),  // React component, not HTML string
  })
  if (error) throw new Error(`Email send failed: ${error.message}`)
  return data
}
```

### Pattern 3: Webhook Email Trigger
**What:** Send emails from within Stripe webhook handlers, after DB operations succeed.
**When to use:** Welcome email after `checkout.session.completed`, receipt after `invoice.payment_succeeded`.
**Example:**
```typescript
// In webhook handler, after subscription insert:
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session
  await handleCheckoutCompleted(session, stripe)
  // Send welcome email (non-blocking, log errors but don't fail webhook)
  if (session.mode === 'subscription' && session.customer_details?.email) {
    sendWelcomeEmail(
      session.customer_details.email,
      session.customer_details.name || '',
      'your subscription'
    ).catch(err => console.error('[Webhook] Welcome email failed:', err))
  }
  break
}
```

### Anti-Patterns to Avoid
- **Blocking webhook on email send:** Never `await` the email send in the webhook response path. Use fire-and-forget with `.catch()` logging. Stripe expects 2xx within 20 seconds; email delivery should not block this.
- **Sending receipt email on `checkout.session.completed`:** This fires once at initial checkout. For recurring payments, receipts must trigger on `invoice.payment_succeeded`, which fires on every billing cycle.
- **Inline CSS classes in emails:** Email clients strip `<style>` tags. React Email uses inline styles by design. Never use Tailwind classes in email templates (even though `@react-email/tailwind` exists, inline styles are more reliable cross-client).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-client HTML email | Custom HTML with media queries | @react-email/components | Gmail, Outlook, Apple Mail all render HTML differently; React Email handles the quirks |
| Email preview/testing | Sending test emails to yourself | `npx email dev` preview server | Instant hot-reload preview without burning Resend API calls |
| Receipt formatting | Manual currency/date formatting | `Intl.NumberFormat` + Stripe's `hosted_invoice_url` | Stripe already generates a hosted invoice page; link to it rather than recreating |
| Unsubscribe handling | Custom unsubscribe logic | Resend's built-in `List-Unsubscribe` header | Required for email deliverability; Resend handles this |

**Key insight:** Stripe already provides a `hosted_invoice_url` on every invoice object. The receipt email should link to this rather than attempting to recreate invoice details. Include key facts (amount, plan, date) in the email body, but link out for the full invoice.

## Common Pitfalls

### Pitfall 1: Missing `invoice.payment_succeeded` webhook event
**What goes wrong:** Receipt emails never send because the webhook only handles `checkout.session.completed` (first payment) but not `invoice.payment_succeeded` (every payment including recurring).
**Why it happens:** The existing webhook does not handle `invoice.payment_succeeded`. The roadmap requires receipts on every charge, not just the first.
**How to avoid:** Add `invoice.payment_succeeded` to the webhook switch statement. Also register this event type in the Stripe dashboard webhook configuration.
**Warning signs:** Receipts work for first payment but not month-2 renewals.

### Pitfall 2: Stripe webhook event not registered in dashboard
**What goes wrong:** Code handles the event but Stripe never sends it.
**Why it happens:** Stripe only sends events that are explicitly enabled in the webhook endpoint configuration (Dashboard > Developers > Webhooks).
**How to avoid:** After adding `invoice.payment_succeeded` handler in code, also enable the event type in the Stripe webhook settings.
**Warning signs:** Handler code exists but never executes.

### Pitfall 3: Email rendering differences across clients
**What goes wrong:** Emails look great in Gmail but broken in Outlook.
**Why it happens:** Outlook uses Word's rendering engine. It does not support many CSS properties (flexbox, padding on inline elements, background images).
**How to avoid:** Use React Email's components which output email-safe HTML. Stick to `<table>` layout (React Email handles this internally). Test with the preview server. Use inline styles only.
**Warning signs:** Visual QA only done in one email client.

### Pitfall 4: Webhook timeout from slow email sends
**What goes wrong:** Stripe marks webhook as failed, retries, sends duplicate emails.
**Why it happens:** Email API call takes >20 seconds (Resend latency, cold start, etc.) and blocks the webhook response.
**How to avoid:** Fire-and-forget pattern: call `sendEmail().catch(console.error)` without `await` in the webhook handler. Return 200 immediately after DB operations.
**Warning signs:** Stripe dashboard shows webhook timeouts; users receive duplicate emails.

### Pitfall 5: No user name available for personalization
**What goes wrong:** Welcome email says "Hi ," with empty name.
**Why it happens:** The `users` table only has `email` and `password_hash`. The `profiles` table has `full_name` but it may be null. Stripe's `customer_details.name` may also be null.
**How to avoid:** Fall back gracefully: use `session.customer_details.name || profile.full_name || 'there'`. Design templates to work without a name.
**Warning signs:** Test with a user who never filled in profile name.

## Code Examples

### Welcome Email Template
```typescript
// emails/welcome.tsx
import { Text, Button, Section } from '@react-email/components'
import { EmailLayout } from './components/layout'

interface WelcomeEmailProps {
  name?: string
  planName: string
  dashboardUrl: string
}

export function WelcomeEmail({ name, planName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to ThreadMoat - your ${planName} is active`}>
      <Text style={{ color: '#e5e5e5', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' }}>
        Welcome to ThreadMoat{name ? `, ${name}` : ''}
      </Text>
      <Text style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: '24px' }}>
        Your {planName} subscription is now active. You have full access to 44+ interactive
        market intelligence visualizations covering 500+ startups in the industrial AI landscape.
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button
          href={dashboardUrl}
          style={{
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Open Your Dashboard
        </Button>
      </Section>
    </EmailLayout>
  )
}
```

### Receipt Email Template
```typescript
// emails/receipt.tsx
import { Text, Button, Section, Hr } from '@react-email/components'
import { EmailLayout } from './components/layout'

interface ReceiptEmailProps {
  name?: string
  amountFormatted: string  // e.g., "$49.00"
  planName: string
  periodStart: string      // e.g., "March 23, 2026"
  periodEnd: string
  invoiceUrl: string       // Stripe hosted invoice URL
}

export function ReceiptEmail({
  name, amountFormatted, planName, periodStart, periodEnd, invoiceUrl
}: ReceiptEmailProps) {
  return (
    <EmailLayout preview={`Payment receipt - ${amountFormatted} for ${planName}`}>
      <Text style={{ color: '#e5e5e5', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' }}>
        Payment Receipt
      </Text>
      <Text style={{ color: '#a3a3a3', fontSize: '14px' }}>
        {name ? `Hi ${name}, ` : ''}Your payment has been processed successfully.
      </Text>
      <Hr style={{ borderColor: '#262626', margin: '16px 0' }} />
      <Text style={{ color: '#e5e5e5', fontSize: '14px', margin: '4px 0' }}>
        <strong>Amount:</strong> {amountFormatted}
      </Text>
      <Text style={{ color: '#e5e5e5', fontSize: '14px', margin: '4px 0' }}>
        <strong>Plan:</strong> {planName}
      </Text>
      <Text style={{ color: '#e5e5e5', fontSize: '14px', margin: '4px 0' }}>
        <strong>Period:</strong> {periodStart} - {periodEnd}
      </Text>
      <Hr style={{ borderColor: '#262626', margin: '16px 0' }} />
      <Section style={{ textAlign: 'center', margin: '16px 0' }}>
        <Button
          href={invoiceUrl}
          style={{
            backgroundColor: '#262626',
            color: '#e5e5e5',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            textDecoration: 'none',
            border: '1px solid #404040',
          }}
        >
          View Full Invoice
        </Button>
      </Section>
    </EmailLayout>
  )
}
```

### Webhook Integration for Receipt
```typescript
// invoice.payment_succeeded handler in webhook
case 'invoice.payment_succeeded': {
  const invoice = event.data.object as Stripe.Invoice
  if (!invoice.customer_email) break

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.currency,
  }).format((invoice.amount_paid ?? 0) / 100)

  sendReceiptEmail(
    invoice.customer_email,
    invoice.customer_name || undefined,
    amountFormatted,
    invoice.lines.data[0]?.description || 'ThreadMoat Subscription',
    new Date((invoice.period_start ?? 0) * 1000),
    new Date((invoice.period_end ?? 0) * 1000),
    invoice.hosted_invoice_url || ''
  ).catch(err => console.error('[Webhook] Receipt email failed:', err))
  break
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw HTML strings in email sends | React Email components with `react` param in Resend | 2023-2024 | Type-safe, composable, previewable templates |
| Separate render step (`render()` then `html` param) | Direct `react` param in Resend SDK | Resend SDK v1+ | No need to manually render; Resend renders React server-side |
| `@react-email/components` individual packages | Single `@react-email/components` meta-package | 2024 | One install instead of 15+ separate component packages |

**Deprecated/outdated:**
- Individual `@react-email/button`, `@react-email/html`, etc. packages: Use `@react-email/components` instead (single package exports all)
- `render()` from `@react-email/render`: Not needed when using Resend's `react` param directly

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual testing + Stripe CLI |
| Config file | none |
| Quick run command | `stripe trigger checkout.session.completed` |
| Full suite command | Manual: trigger each webhook event, verify email received |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EMAIL-01 | Welcome email on subscription | smoke | `stripe trigger checkout.session.completed` then check Resend dashboard | N/A |
| EMAIL-02 | Receipt email on payment | smoke | `stripe trigger invoice.payment_succeeded` then check Resend dashboard | N/A |
| EMAIL-03 | Templates styled with branding | manual | `npx email dev` then visual inspection | N/A |

### Sampling Rate
- **Per task commit:** Visual check via `npx email dev` preview
- **Per wave merge:** Stripe CLI webhook trigger + Resend dashboard verification
- **Phase gate:** All 4 templates render in preview; welcome + receipt fire on Stripe events

### Wave 0 Gaps
- [ ] Install `@react-email/components` dependency
- [ ] Create `emails/` directory structure
- [ ] Optionally install `react-email` as devDependency for preview server
- [ ] Add `invoice.payment_succeeded` event to Stripe webhook endpoint configuration in dashboard

## Open Questions

1. **Stripe dashboard webhook events configuration**
   - What we know: Code currently handles 4 event types. `invoice.payment_succeeded` is needed for receipts.
   - What's unclear: Whether the Stripe dashboard webhook endpoint has additional events enabled or only the 4 currently handled.
   - Recommendation: Check Stripe dashboard during implementation; add `invoice.payment_succeeded` to enabled events.

2. **One-time payment (market report) receipt**
   - What we know: The checkout flow supports `mode: 'payment'` for the $4,999 market report. `invoice.payment_succeeded` fires for subscriptions but not one-time payments.
   - What's unclear: Whether receipt emails should also cover one-time report purchases.
   - Recommendation: For one-time payments, send a receipt from the `checkout.session.completed` handler when `session.mode === 'payment'`. This is a minor extension to EMAIL-02.

3. **ThreadMoat logo image**
   - What we know: Emails need branding. A text-based logo ("ThreadMoat" in violet) works without image hosting.
   - What's unclear: Whether a logo image file exists and is hosted at a public URL.
   - Recommendation: Use text-based logo initially. If a logo image is available, host it on the public site domain and reference via absolute URL.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** — `lib/email.ts`, `app/api/webhooks/stripe/route.ts`, `app/actions/stripe.ts`, `lib/products.ts`, `scripts/000_initial_schema.sql`
- **npm registry** — Verified versions: resend@6.9.4, @react-email/components@1.0.10, react-email@5.2.10

### Secondary (MEDIUM confidence)
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) — React param usage, server action integration
- [React Email GitHub](https://github.com/resend/react-email) — Component library, project structure conventions
- [FreeCodeCamp React Email + Resend guide](https://www.freecodecamp.org/news/create-and-send-email-templates-using-react-email-and-resend-in-nextjs/) — Template patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Resend already installed, React Email is its official companion
- Architecture: HIGH - Clear integration points in existing webhook and email code
- Pitfalls: HIGH - Well-documented Stripe webhook patterns; email rendering quirks are well-known

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable domain, libraries mature)
