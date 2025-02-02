import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../components/ui/use-toast'
import { FormService } from '@/services/form'

export function useUpdateFormStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      FormService.updateFormStatus(id, isActive),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Status atualizado!',
        description: 'O status foi atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}
