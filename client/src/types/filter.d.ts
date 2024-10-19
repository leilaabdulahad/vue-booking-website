interface FilterState {
    searchQuery: string
    checkInDate: string | null
    checkOutDate: string | null
    guestCount: number
}
export type FilterUpdateEvent = (event: 'filterUpdated', value: FilterState) => void
