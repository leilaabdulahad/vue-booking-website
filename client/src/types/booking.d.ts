interface Booking {
  _id: string
  propertyId: string
  userId: string
  clerkUserId: string
  firstName: string
  lastName: string
  address: string
  postalCode: string
  city: string
  email: string
  phoneNumber: string
  startDate: Date
  endDate: Date
  totalPrice: number
  numberOfNights: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
  username: string
}
