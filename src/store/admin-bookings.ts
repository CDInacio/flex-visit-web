import { create } from 'zustand'

import { Booking } from '@/types/booking'

interface State {
  bookings: Booking[] | null
}

interface Actions {
  setBookings: (bookings: Booking[]) => void
}

const useAdminBookingsStore = create<State & Actions>((set) => ({
  bookings: null,
  setBookings: (bookings) => {
    set({ bookings })
  },
}))

export default useAdminBookingsStore
