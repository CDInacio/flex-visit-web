import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../components/ui/use-toast'
import { BookingService } from '@/services/booking'

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: BookingService.updateBookingStatus,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['userBookings'] }),
        queryClient.invalidateQueries({ queryKey: ['user-historic'] }),
      ])
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Status atualizado com sucesso!',
      })
    },
  })
}
