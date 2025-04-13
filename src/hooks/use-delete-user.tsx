import { UserService } from '@/services/user'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Usuário Excluído!',
        description:
          'O usuário foi removido permanentemente e não pode mais acessar o sistema.',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setTimeout(() => {
        window.location.href = '/usuarios'
      }, 2000)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro !!!',
        description: error.message,
      })
    },
  })
}
