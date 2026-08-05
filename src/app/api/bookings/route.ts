import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const resend = new Resend(process.env.RESEND_API_KEY)

type BookingPayload = {
  clientName?: unknown
  clientEmail?: unknown
  date?: unknown
  time?: unknown
}

export async function GET() {
  const { data, error } = await supabase.from("bookings").select("*").order("date", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let payload: BookingPayload

  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Invalid request body")
    }
    payload = body as BookingPayload
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const clientName = typeof payload.clientName === "string" ? payload.clientName.trim() : ""
  const clientEmail = typeof payload.clientEmail === "string" ? payload.clientEmail.trim() : ""
  const date = typeof payload.date === "string" ? payload.date : ""
  const time = typeof payload.time === "string" ? payload.time : ""

  if (!clientName || !clientEmail || !date || !time) {
    return NextResponse.json({ error: "Name, email, date, and time are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      client_name: clientName,
      client_email: clientEmail,
      date,
      time,
      status: "confirmed",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send confirmation email — booking is already saved, so we don't fail
  // the whole request if the email fails to send. We just log it.
  try {
    await resend.emails.send({
      from: "BookEasy <onboarding@resend.dev>",
      to: clientEmail,
      subject: "Your booking is confirmed!",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">Booking Confirmed</h2>
          <p>Hi ${clientName},</p>
          <p>Your appointment has been booked. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Date</td>
              <td style="padding: 8px 0; font-weight: 600;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Time</td>
              <td style="padding: 8px 0; font-weight: 600;">${time}</td>
            </tr>
          </table>
          <p>If you need to cancel or make changes, please contact us directly.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Thanks for booking with BookEasy!</p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError)
  }

  return NextResponse.json(data, { status: 201 })
}