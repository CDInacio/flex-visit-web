/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../components/ui/use-toast'
import { FormService } from '@/services/form'

export function useUpdateForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      FormService.updateForm(id, data),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Formulário atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['form'] })
    },
  })
}
