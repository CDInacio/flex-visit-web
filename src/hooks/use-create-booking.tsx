import { BookingService } from '@/services/booking'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useCreateBooking() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: BookingService.createBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userBookings'] }),
        queryClient.invalidateQueries({ queryKey: ['bookings'] }),
      ])
      toast({
        variant: 'success',
        title: 'Agendamento realizado com sucesso!',
        description: 'Seu agendamento foi realizado com sucesso!',
      })
      navigate('/agendamentos')
    },
  })
}
