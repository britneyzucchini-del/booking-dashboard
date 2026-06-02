import { NextResponse } from 'next/server'

type Booking = {
  id: string
  clientName: string
  clientEmail: string
  date: string
  time: string
  status: string
}

const bookings: Booking[] = [
  { id: '1', clientName: 'Jane Smith', clientEmail: 'jane@example.com', date: '2026-06-01', time: '10:00', status: 'confirmed' },
  { id: '2', clientName: 'John Doe', clientEmail: 'john@example.com', date: '2026-06-02', time: '11:00', status: 'confirmed' },
  { id: '3', clientName: 'Sara Lee', clientEmail: 'sara@example.com', date: '2026-06-03', time: '14:00', status: 'confirmed' },
]

export async function GET() {
  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newBooking: Booking = {
    id: String(bookings.length + 1),
    clientName: body.clientName,
    clientEmail: body.clientEmail,
    date: body.date,
    time: body.time,
    status: 'confirmed',
  }
  bookings.push(newBooking)
  return NextResponse.json(newBooking)
}