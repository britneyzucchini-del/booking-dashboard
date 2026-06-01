export type Service = {
  id: string
  name: string
  description: string
  duration: number  // in minutes
  price: number
}

export type Booking = {
  id: string
  serviceId: string
  serviceName: string
  clientName: string
  clientEmail: string
  date: string
  time: string
  status: 'confirmed' | 'cancelled'
}
