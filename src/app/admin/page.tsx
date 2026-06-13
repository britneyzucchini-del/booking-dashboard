'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Booking = {
  id: string
  client_name: string
  client_email: string
  date: string
  time: string
  status: string
}

async function fetchBookings() {
  const res = await fetch('/api/bookings')
  return res.json()
}

export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    enabled: !checking,
  })

  if (checking) return <main className="p-8"><p>Checking authentication...</p></main>
  if (isLoading) return <main className="p-8"><p>Loading bookings...</p></main>
  if (isError) return <main className="p-8"><p>Failed to load bookings.</p></main>

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Time</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: Booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-3">{booking.client_name}</td>
                  <td className="px-4 py-3">{booking.client_email}</td>
                  <td className="px-4 py-3">{booking.date}</td>
                  <td className="px-4 py-3">{booking.time}</td>
                  <td className="px-4 py-3">
                    <span className={booking.status === 'confirmed' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}