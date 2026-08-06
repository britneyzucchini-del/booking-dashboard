'use client'

import { useQuery } from '@tanstack/react-query'
import type { Service } from '@/types'
import HomeButton from '@/components/HomeButton'

async function fetchServices(): Promise<Service[]> {
  const res = await fetch('/api/services')
  if (!res.ok) throw new Error('Failed to fetch services')
  return res.json()
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <HomeButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-600 mb-8">Choose a service to get started.</p>

        {isLoading && (
          <p className="text-gray-500">Loading services...</p>
        )}

        {isError && (
          <p className="text-red-500">Couldn&apos;t load services right now. Please try again shortly.</p>
        )}

        {services && services.length === 0 && (
          <p className="text-gray-500">No services are available yet. Check back soon.</p>
        )}

        {services && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h2>
                <p className="text-gray-500 mb-4 flex-grow">{service.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{formatDuration(service.duration)}</span>
                  <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
                </div>
                
                  href={`/booking?service=${encodeURIComponent(service.id)}`}
                  className="block text-center bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                >
                  Book Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
