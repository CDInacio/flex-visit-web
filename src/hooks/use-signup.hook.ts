import { UserService } from '@/services/user'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

export function useSignup() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: UserService.signup,
    onSuccess: () => {
      navigate('/login')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Erro ao cadastrar',
          description: error.response.data.message,
        })
      }
    },
  })
}
