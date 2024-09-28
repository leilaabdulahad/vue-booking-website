interface Booking {
    _id: string
    userId: string
    propertyId: string
    startDate: string
    endDate: string
    guests: number
    totalPrice: number
    message: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    paymentId: string
}