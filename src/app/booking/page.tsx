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
            <p className="rounded-lg bg-red-50 p-3