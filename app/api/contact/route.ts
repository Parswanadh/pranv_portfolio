import { NextRequest, NextResponse } from 'next/server'
import { encode } from 'html-entities'
import { rateLimiters } from '@/lib/rate-limiter'
import { getClientIP, getSecurityHeaders, validateEmail, detectXSSPatterns } from '@/lib/security-utils'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot?: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check with improved IP extraction
    const ip = getClientIP(request)
    const rateLimitResult = rateLimiters.lenient.check(ip)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many messages. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    // Parse request body with error handling
    let body: ContactFormData
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const { name, email, subject, message, honeypot } = body

    // Check honeypot field - if filled, it's a bot
    if (honeypot && honeypot.trim().length > 0) {
      // Return success to bot but don't actually process
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200, headers: getSecurityHeaders() }
      )
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate email format with stricter validation
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate name length
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate message length
    if (typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Detect XSS patterns before sanitization
    const inputs = { name, email, subject, message }
    for (const [field, value] of Object.entries(inputs)) {
      if (detectXSSPatterns(value)) {
        console.warn('XSS attempt detected in contact form:', {
          ip,
          field,
          value: value.substring(0, 100),
        })
        return NextResponse.json(
          { error: 'Invalid content detected' },
          { status: 400, headers: getSecurityHeaders() }
        )
      }
    }

    // Sanitize inputs with XSS protection using html-entities
    const sanitizedName = encode(name.trim().slice(0, 100))
    const sanitizedEmail = encode(email.trim().slice(0, 255))
    const sanitizedSubject = encode(subject.trim().slice(0, 100))
    const sanitizedMessage = encode(message.trim().slice(0, 5000))

    // DEMO MODE: Contact form submissions are logged but not sent via email
    // To enable email sending, set up an email service and uncomment the code below
    //
    // Recommended email services:
    // - Resend (https://resend.com): Free tier available, easy setup
    // - SendGrid (https://sendgrid.com): Reliable, good for production
    // - AWS SES (https://aws.amazon.com/ses): Cost-effective for high volume
    // - Nodemailer (self-hosted): Free but requires SMTP server
    //
    // Setup steps for Resend (recommended):
    // 1. Install: npm install resend
    // 2. Set environment variable: RESEND_API_KEY=your_key_here
    // 3. Uncomment the email sending code below
    // 4. Verify your domain in Resend dashboard

    console.log('[DEMO] Contact form submission:', {
      timestamp: new Date().toISOString(),
      ip,
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      messageLength: sanitizedMessage.length,
    })

    // EMAIL SERVICE INTEGRATION (uncomment to enable):
    // if (process.env.RESEND_API_KEY) {
    //   try {
    //     const { Resend } = await import('resend')
    //     const resend = new Resend(process.env.RESEND_API_KEY)
    //
    //     await resend.emails.send({
    //       from: 'portfolio@yourdomain.com',
    //       to: 'prnvamara@gmail.com',
    //       subject: `Portfolio Contact: ${sanitizedSubject}`,
    //       replyTo: sanitizedEmail,
    //       html: `
    //         <h2>New Contact Form Submission</h2>
    //         <p><strong>Name:</strong> ${sanitizedName}</p>
    //         <p><strong>Email:</strong> ${sanitizedEmail}</p>
    //         <p><strong>Subject:</strong> ${sanitizedSubject}</p>
    //         <hr>
    //         <p><strong>Message:</strong></p>
    //         <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
    //       `
    //     })
    //     console.log('[SUCCESS] Email sent via Resend')
    //   } catch (emailError) {
    //     console.error('[ERROR] Failed to send email:', emailError)
    //     // Continue anyway - form was logged
    //   }
    // } else {
    //   console.warn('[WARN] RESEND_API_KEY not set - email not sent (demo mode)')
    // }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200, headers: getSecurityHeaders() }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
