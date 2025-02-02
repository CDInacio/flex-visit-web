import { useQuery } from '@tanstack/react-query'
import { BookingService } from '@/services/booking'
import { queryConfig } from '@/config/queryConfig'

export function useGetUserBookings() {
  return useQuery({
    queryKey: ['userBookings'],
    queryFn: BookingService.getUserBookings,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
