interface Location {
  city: string
  country: string
}

interface Property {
  _id: string
  title: string
  description: string
  location: Location
  maxGuests: number
  userId: string
  username: string
  createdAt: string
  pricePerNight: number
  rooms: number
  beds: number
  amenities: string[]
  images: string[]
  rating: number
  isFavorite?: boolean 
  checkInDate?: string
  checkOutDate?: string
  isOffer?: boolean
}

