import { FormService } from '@/services/form'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: FormService.deleteForm,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Formulário Removido!',
        description:
          'O formulário foi excluído com sucesso e não pode mais ser acessado.',
      })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro !',
        description: error.message,
      })
    },
  })
}
