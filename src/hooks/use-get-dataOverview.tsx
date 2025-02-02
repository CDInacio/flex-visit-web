import { useQuery } from '@tanstack/react-query'
import { BookingService } from '@/services/booking'
import { queryConfig } from '@/config/queryConfig'

export function useGetDataOverview() {
  return useQuery({
    queryKey: ['bookingsOverview'],
    queryFn: BookingService.getDataOverview,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
