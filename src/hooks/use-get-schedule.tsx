import { useQuery } from '@tanstack/react-query'
import { ScheduleService } from '@/services/schedule'
import { queryConfig } from '@/config/queryConfig'

export function useGetSchedule() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: ScheduleService.getSchedules,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
