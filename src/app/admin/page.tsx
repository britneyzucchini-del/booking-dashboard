'use client'

import { useQuery } from '@tanstack/react-query'

type Booking = {
  id: string
  clientName: string
  clientEmail: string
  date: string
  time: string
  status: string
}

async function fetchBookings() {
  const res = await fetch('/api/bookings')
  return res.json()
}

export default function AdminPage() {
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  })

  if (isLoading) return <main className="p-8"><p>Loading bookings...</p></main>
  if (isError) return <main className="p-8"><p>Failed to load bookings.</p></main>

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
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
                  <td className="px-4 py-3">{booking.clientName}</td>
                  <td className="px-4 py-3">{booking.clientEmail}</td>
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