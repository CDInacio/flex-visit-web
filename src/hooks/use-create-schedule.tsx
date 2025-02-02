import { ScheduleService } from '@/services/schedule'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateSchedule() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ScheduleService.createSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      toast({
        variant: 'success',
        title: 'Prontinho!!',
        description: 'Os horários foram criados com sucesso.',
      })
    },
  })
}
