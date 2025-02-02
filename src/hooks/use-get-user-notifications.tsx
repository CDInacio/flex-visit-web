import { useQuery } from '@tanstack/react-query'
import { NotificationService } from '@/services/notification'
import { queryConfig } from '@/config/queryConfig'

export function useGetNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getNotifications,
    refetchOnWindowFocus: false,
    ...queryConfig,
  })
}
