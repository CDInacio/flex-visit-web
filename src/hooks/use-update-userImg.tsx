import { useMutation } from '@tanstack/react-query'
import { UserService } from '@/services/user'

export function useUpdateUserImg() {
  return useMutation({
    mutationFn: UserService.updateUserImg,
  })
}
