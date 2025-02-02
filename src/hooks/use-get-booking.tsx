import { useQuery } from '@tanstack/react-query'
import { BookingService } from '@/services/booking'
import { queryConfig } from '@/config/queryConfig'

export function useGetBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: ({ queryKey }) =>
      BookingService.getBooking(queryKey as [string, string]),
    ...queryConfig,
  })
}
