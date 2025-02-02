import { queryConfig } from '@/config/queryConfig'
import { BookingService } from '@/services/booking'
import { useQuery } from '@tanstack/react-query'

export function useGetBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: BookingService.getBookings,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
