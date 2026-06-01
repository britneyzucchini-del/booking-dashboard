import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BookEasy
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Book your appointment in minutes. Simple, fast, and easy.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/services"
            className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition"
          >
            <h2 className="text-xl font-semibold mb-2">View Services</h2>
            <p className="text-blue-100">Browse what we offer and pick what fits you.</p>
          </Link>

          <Link
            href="/admin"
            className="bg-gray-800 text-white rounded-xl p-6 hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">View and manage all bookings.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
