import { UserService } from '@/services/user'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useSignin() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: UserService.signin,
    onSuccess: (data) => {
      if (data) {
        const userRole = data.user.role
        if (userRole === 'USER' || userRole === 'COORDINATOR') {
          navigate('/perfil')
        } else {
          navigate('/')
        }
        localStorage.setItem('userToken', data.token as string)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Falha na Autenticação',
        description: error.message,
      })
    },
  })
}
