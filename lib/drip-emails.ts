import { sql } from '@/lib/db'
import { Resend } from 'resend'

const FROM_EMAIL = process.env.FROM_EMAIL || 'ThreadMoat <noreply@threadmoat.com>'

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(process.env.RESEND_API_KEY)
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

function emailWrapper(content: string) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;background:#0a0a0a;">
    <h2 style="color:#7c3aed;text-align:center;margin:0 0 32px;">ThreadMoat</h2>
    <div style="background:#171717;border-radius:8px;padding:32px;border:1px solid #262626;">
      ${content}
    </div>
    <p style="color:#737373;font-size:12px;text-align:center;margin-top:32px;">ThreadMoat Inc. - Market Intelligence for Industrial AI</p>
    <p style="color:#525252;font-size:11px;text-align:center;margin-top:8px;">You're receiving this because you signed up for a ThreadMoat trial.</p>
  </div>`
}

interface DripConfig {
  key: string
  dayOffset: number  // days after trial start
  subject: string
  html: (name: string, daysLeft: number) => string
}

const dashboardUrl = () => `${getBaseUrl()}/dashboard`
const pricingUrl = () => `${getBaseUrl()}/en/pricing`

const DRIP_EMAILS: DripConfig[] = [
  {
    key: 'trial_welcome',
    dayOffset: 1,
    subject: 'Your ThreadMoat trial is live — here\'s where to start',
    html: (name, _daysLeft) => emailWrapper(`
      <h3 style="color:#e5e5e5;font-size:18px;margin:0 0 16px;">Welcome${name ? `, ${name}` : ''}!</h3>
      <p style="color:#a3a3a3;font-size:14px;line-height:24px;">Your 30-day Explorer trial is active. Here are the three things most users find valuable first:</p>
      <ol style="color:#a3a3a3;font-size:14px;line-height:28px;padding-left:20px;">
        <li><strong style="color:#e5e5e5;">Periodic Table</strong> — see all 500+ startups in one view, click any cell for details</li>
        <li><strong style="color:#e5e5e5;">Heatmap</strong> — spot market momentum by category and funding stage</li>
        <li><strong style="color:#e5e5e5;">Company Profiles</strong> — deep-dive into any startup with scenario narratives</li>
      </ol>
      <p style="text-align:center;margin:24px 0;">
        <a href="${dashboardUrl()}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;">Open Dashboard</a>
      </p>
    `),
  },
  {
    key: 'trial_midpoint',
    dayOffset: 14,
    subject: 'You\'re halfway through your trial — have you tried these?',
    html: (name, daysLeft) => emailWrapper(`
      <h3 style="color:#e5e5e5;font-size:18px;margin:0 0 16px;">${name ? `Hi ${name},` : 'Hi,'}</h3>
      <p style="color:#a3a3a3;font-size:14px;line-height:24px;">You have <strong style="color:#f59e0b;">${daysLeft} days</strong> left in your Explorer trial. Here are features you might have missed:</p>
      <ul style="color:#a3a3a3;font-size:14px;line-height:28px;padding-left:20px;">
        <li><strong style="color:#e5e5e5;">Investor Network</strong> — see who's co-investing and where the smart money flows</li>
        <li><strong style="color:#e5e5e5;">Acquirer Fit</strong> — rank startups by strategic fit for your organization</li>
        <li><strong style="color:#e5e5e5;">Market Concentration</strong> — understand competitive dynamics with HHI analysis</li>
      </ul>
      <p style="color:#a3a3a3;font-size:14px;line-height:24px;">These advanced views are available on paid plans.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${pricingUrl()}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;">View Plans</a>
      </p>
    `),
  },
  {
    key: 'trial_ending',
    dayOffset: 25,
    subject: 'Your trial ends in 5 days',
    html: (name, daysLeft) => emailWrapper(`
      <h3 style="color:#e5e5e5;font-size:18px;margin:0 0 16px;">${name ? `Hi ${name},` : 'Hi,'}</h3>
      <p style="color:#a3a3a3;font-size:14px;line-height:24px;">Your Explorer trial expires in <strong style="color:#ef4444;">${daysLeft} days</strong>. After that, you'll lose access to the dashboard and company data.</p>
      <p style="color:#a3a3a3;font-size:14px;line-height:24px;">Upgrade now to keep your access and unlock advanced analysis views, AI narratives, and custom reports.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${pricingUrl()}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;">Upgrade Now</a>
      </p>
      <p style="color:#737373;font-size:12px;line-height:20px;">Questions? Reply to this email or request a demo at <a href="${getBaseUrl()}/en/demo" style="color:#7c3aed;">threadmoat.com/demo</a>.</p>
    `),
  },
]

/**
 * Process drip emails for all active trial users.
 * Called by the cron endpoint daily.
 * Returns count of emails sent.
 */
export async function processDripEmails(): Promise<{ sent: number; errors: number }> {
  const resend = getResend()
  let sent = 0
  let errors = 0

  // Find all trial users (subscriptions with product_id containing 'explorer' and status = 'active')
  const trialUsers = await sql`
    SELECT
      u.id,
      u.email,
      p.full_name,
      s.current_period_start,
      s.current_period_end
    FROM users u
    JOIN profiles p ON p.id = u.id
    JOIN subscriptions s ON s.user_id = u.id
    WHERE s.status = 'active'
      AND (s.product_id = 'explorer_trial' OR s.product_id = 'explorer')
      AND u.email_verified = true
  `

  const now = new Date()

  for (const user of trialUsers) {
    const trialStart = new Date(user.current_period_start as string)
    const trialEnd = new Date(user.current_period_end as string)
    const daysSinceStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    for (const drip of DRIP_EMAILS) {
      if (daysSinceStart < drip.dayOffset) continue

      // Check if already sent
      const existing = await sql`
        SELECT 1 FROM drip_emails_sent
        WHERE user_id = ${user.id as string} AND email_key = ${drip.key}
      `
      if (existing.length > 0) continue

      try {
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email as string,
          subject: drip.subject,
          html: drip.html(user.full_name as string || '', daysLeft),
        })

        if (error) {
          console.error(`[Drip] Failed to send ${drip.key} to ${user.email}:`, error)
          errors++
          continue
        }

        // Record as sent
        await sql`
          INSERT INTO drip_emails_sent (user_id, email_key)
          VALUES (${user.id as string}, ${drip.key})
          ON CONFLICT (user_id, email_key) DO NOTHING
        `
        sent++
        console.log(`[Drip] Sent ${drip.key} to ${user.email}`)
      } catch (err) {
        console.error(`[Drip] Error sending ${drip.key} to ${user.email}:`, err)
        errors++
      }
    }
  }

  return { sent, errors }
}
