import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

// Resend email client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Sends a nicely formatted contact email to the portfolio owner via Resend.
async function sendContactEmail({ name, email, message }) {
  if (!resend) return { sent: false, error: 'RESEND_API_KEY not configured' }
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'niloyroy555@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

  const html = `
  <div style="margin:0;padding:24px;background:#0b0b0e;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
      <div style="padding:22px 28px;background:linear-gradient(135deg,#3E63F5,#5B8CFF);">
        <h1 style="margin:0;color:#fff;font-size:18px;letter-spacing:0.2px;">New portfolio enquiry</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Someone reached out via niloyroy.com</p>
      </div>
      <div style="padding:28px;color:#e7e7ea;">
        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#8a8a92;">From</p>
        <p style="margin:0 0 4px;font-size:18px;font-weight:600;color:#fff;">${safeName}</p>
        <p style="margin:0 0 22px;font-size:14px;">
          <a href="mailto:${safeEmail}" style="color:#5B8CFF;text-decoration:none;">${safeEmail}</a>
        </p>
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#8a8a92;">Message</p>
        <div style="padding:16px 18px;background:#1a1a1f;border:1px solid #2b2b31;border-radius:12px;font-size:15px;line-height:1.65;color:#dcdce0;white-space:normal;">
          ${safeMessage}
        </div>
        <a href="mailto:${safeEmail}?subject=Re:%20your%20message" style="display:inline-block;margin-top:24px;padding:12px 22px;background:#5B8CFF;color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Reply to ${safeName}</a>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #26262b;color:#6b6b73;font-size:12px;">
        Sent automatically from your portfolio contact form.
      </div>
    </div>
  </div>`

  const text = `New portfolio enquiry\n\nFrom: ${name} <${email}>\n\nMessage:\n${message}`

  const { data, error } = await resend.emails.send({
    from,
    to: [recipient],
    replyTo: email,
    subject: `New enquiry from ${name}`,
    html,
    text,
  })
  if (error) return { sent: false, error: error.message || 'Resend send failed' }
  return { sent: true, id: data?.id }
}

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!process.env.MONGO_URL) {
    // Fail clearly instead of letting the driver crash on `undefined.startsWith(...)`
    throw new Error('MONGO_URL environment variable is not set')
  }
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME || 'portfolio')
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }

    // Contact form - POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const name = String(body?.name || '').trim().slice(0, 200)
      const email = String(body?.email || '').trim().slice(0, 200)
      const message = String(body?.message || '').trim().slice(0, 4000)
      if (!name || !email || !message) {
        return handleCORS(NextResponse.json(
          { error: "name, email and message are required" },
          { status: 400 }
        ))
      }
      const contact = { id: uuidv4(), name, email, message, createdAt: new Date() }

      // 1) Persist to MongoDB (non-fatal if DB/env is unavailable)
      let saved = false
      try {
        const db = await connectToMongo()
        await db.collection('contacts').insertOne({ ...contact })
        saved = true
      } catch (e) {
        console.error('Contact DB save failed:', e?.message || e)
      }

      // 2) Email the enquiry to the portfolio owner (non-fatal if RESEND env is missing)
      let emailed = false
      try {
        const result = await sendContactEmail(contact)
        emailed = result.sent
        if (!result.sent) console.error('Contact email not sent:', result.error)
      } catch (e) {
        console.error('Contact email error:', e?.message || e)
      }

      // If neither channel worked, the message would be lost — report a clear error.
      if (!saved && !emailed) {
        return handleCORS(NextResponse.json(
          { success: false, error: 'Message could not be delivered. Email and database are not configured on the server.' },
          { status: 503 }
        ))
      }

      return handleCORS(NextResponse.json({ success: true, emailed, saved, contact }))
    }

    // Contact list - GET /api/contact
    if (route === '/contact' && method === 'GET') {
      const db = await connectToMongo()
      const contacts = await db.collection('contacts')
        .find({})
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray()
      const cleaned = contacts.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const db = await connectToMongo()
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const db = await connectToMongo()
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    const msg = error?.message || String(error)
    // Surface configuration problems (missing env vars) clearly instead of a generic 500.
    if (/MONGO_URL|environment variable|startsWith/i.test(msg)) {
      return handleCORS(NextResponse.json(
        { error: "Server is not fully configured. A required environment variable is missing.", detail: msg },
        { status: 503 }
      ))
    }
    return handleCORS(NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute