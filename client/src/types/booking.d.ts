interface Booking {
    _id: string
    propertyId: string
    startDate: Date
    endDate: Date
    totalPrice: number
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: Date
  }