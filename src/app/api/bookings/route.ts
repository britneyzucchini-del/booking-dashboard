import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  return NextResponse.json(data, { status: 201 })
}
