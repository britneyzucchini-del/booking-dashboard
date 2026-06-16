'use client'

import { useQuery } from '@tanstack/react-query'

type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
}

async function fetchServices() {
  const res = await fetch('/api/services')
  if (!res.ok) throw new Error('Failed to fetch services')
  return res.json()
}

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  })

  if (isLoading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading services...</p>
    </main>
  )

  if (isError) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-lg">Failed to load services. Please try again.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-600 mb-8">Choose a service to get started.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <div key={service.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
              <p className="text-gray-500 mb-4">{service.description}</p>
              <p className="text-blue-600 font-bold mb-4">${service.price} - {service.duration} mins</p>
              <a href="/booking" className="block text-center bg-blue-600 text-white rounded-lg py-2">Book Now</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}