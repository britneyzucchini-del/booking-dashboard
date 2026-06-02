import { NextResponse } from 'next/server'

const services = [
  { id: '1', name: 'Haircut', description: 'A fresh cut tailored to your style.', duration: 30, price: 30 },
  { id: '2', name: 'Consultation', description: 'Talk to an expert about your needs.', duration: 45, price: 50 },
  { id: '3', name: 'Deep Clean', description: 'Full deep clean for your space.', duration: 60, price: 80 },
]

export async function GET() {
  return NextResponse.json(services)
}