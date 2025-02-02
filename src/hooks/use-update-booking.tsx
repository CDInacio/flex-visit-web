/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../components/ui/use-toast'
import { BookingService } from '@/services/booking'

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: any }) =>
      BookingService.updateBooking(bookingId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['booking'] }),
        queryClient.invalidateQueries({ queryKey: ['userBookings'] }),
      ])
      toast({
        variant: 'success',
        title: 'Pronto!',
        description: 'Agendamento atualizado com sucesso!',
      })
    },
  })
}
