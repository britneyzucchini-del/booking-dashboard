'use client'

import { useState } from 'react'

type Booking = {
  id: number
  name: string
  email: string
  date: string
  time: string
  status: string
}

const initialBookings: Booking[] = [
  { id: 1, name: 'Jane Smith', email: 'jane@example.com', date: '2026-06-01', time: '10:00', status: 'confirmed' },
  { id: 2, name: 'John Doe', email: 'john@example.com', date: '2026-06-02', time: '11:00', status: 'confirmed' },
  { id: 3, name: 'Sara Lee', email: 'sara@example.com', date: '2026-06-03', time: '14:00', status: 'confirmed' },
]

export default function AdminPage() {
  const [bookings, setBookings] = useState(initialBookings)

  function cancelBooking(id: number) {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

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
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-3">{booking.name}</td>
                  <td className="px-4 py-3">{booking.email}</td>
                  <td className="px-4 py-3">{booking.date}</td>
                  <td className="px-4 py-3">{booking.time}</td>
                  <td className="px-4 py-3">
                    <span className={booking.status === 'confirmed' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="bg-red-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
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