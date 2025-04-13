import { FormService } from '@/services/form'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useCreateForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: FormService.createForm,
    onSuccess: () => {
      navigate('/formularios?q=todos')
      queryClient.invalidateQueries({ queryKey: ['form'] })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      queryClient.invalidateQueries({ queryKey: ['user-historic'] })
      toast({
        variant: 'success',
        title: 'Formulário Criado!',
        description:
          'O formulário personalizado foi criado e está pronto para ser utilizado.',
      })
    },
  })
}
