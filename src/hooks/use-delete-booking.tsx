import { BookingService } from '@/services/booking'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useDeleteBooking() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: BookingService.deleteBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userBookings'] }),
      ])
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Agendamento deletado com sucesso!',
      })
      navigate('/agendamentos')
    },
  })
}
