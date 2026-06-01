export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-600 mb-8">Choose a service to get started.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Haircut</h2>
            <p className="text-gray-500 mb-4">A fresh cut tailored to your style.</p>
            <a href="/booking" className="block text-center bg-blue-600 text-white rounded-lg py-2">Book Now</a>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Consultation</h2>
            <p className="text-gray-500 mb-4">Talk to an expert about your needs.</p>
            <a href="/booking" className="block text-center bg-blue-600 text-white rounded-lg py-2">Book Now</a>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Deep Clean</h2>
            <p className="text-gray-500 mb-4">Full deep clean for your space.</p>
            <a href="/booking" className="block text-center bg-blue-600 text-white rounded-lg py-2">Book Now</a>
          </div>
        </div>
      </div>
    </main>
  )
}
