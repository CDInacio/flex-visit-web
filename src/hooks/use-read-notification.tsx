import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationService } from '@/services/notification'

export function useReadNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: NotificationService.readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error)
    },
  })
}
