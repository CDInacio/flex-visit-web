import { ScheduleService } from '@/services/schedule'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useCreateSchedule() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ScheduleService.createSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description:
          'Os horários foram cadastrados com sucesso e já estão disponíveis.',
      })
      navigate('/horarios')
    },
  })
}
