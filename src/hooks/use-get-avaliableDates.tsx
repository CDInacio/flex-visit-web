import { queryConfig } from '@/config/queryConfig'
import { ScheduleService } from '@/services/schedule'
import { useQuery } from '@tanstack/react-query'

export function useGetAvaliableDates() {
  return useQuery({
    queryKey: ['avaliable-dates'],
    queryFn: ScheduleService.getAvailableDates,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
