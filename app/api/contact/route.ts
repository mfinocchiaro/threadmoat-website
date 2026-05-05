import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  category: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.category || !body.message) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Route to appropriate email based on category
    const categoryMap: Record<string, string> = {
      support: 'support@threadmoat.com',
      sales: 'sales@threadmoat.com',
      partnership: 'sales@threadmoat.com',
      feedback: 'team@threadmoat.com',
      other: 'team@threadmoat.com',
    }

    const recipientEmail = categoryMap[body.category] || 'team@threadmoat.com'

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'Contact Form <noreply@threadmoat.com>',
      to: recipientEmail,
      replyTo: body.email,
      subject: `[${body.category.toUpperCase()}] Message from ${body.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          <p><strong>Category:</strong> ${body.category}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <div style="white-space: pre-wrap; color: #374151;">
${body.message}
          </div>
        </div>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return Response.json(
        { message: 'Failed to send email' },
        { status: 500 }
      )
    }

    return Response.json(
      { message: 'Message sent successfully', id: result.data?.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
