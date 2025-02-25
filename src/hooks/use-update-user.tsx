import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../components/ui/use-toast'
import { UserService } from '@/services/user'

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: UserService.updateUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Informações do usuário atualizadas com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar usuário',
        description: e.message,
      })
    },
  })
}
