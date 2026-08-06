'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import HomeButton from '@/components/HomeButton'

async function createBooking(data: {
  clientName: string
  clientEmail: string
  date: string
  time: string
}) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error ?? 'Unable to create booking')
  }

  return result
}

export default function BookingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const mutation = useMutation({
    mutationFn: createBooking,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ clientName: name, clientEmail: email, date, time })
  }

  if (mutation.isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Thanks {name}, we will see you on {date} at {time}.</p>
          <a href="/" className="mt-6 inline-block bg-blue-600 text-white rounded-lg px-6 py-2">Go Home</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <HomeButton />
        <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mutation.isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {mutation.error.message}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          >
            {mutation.isPending ? 'Booking...' : 'Book Now'}
          </button>
        </form>
        </div>
      </div>
    </main>
  )
}
