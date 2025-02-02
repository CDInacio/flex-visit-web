import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/user'

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: UserService.getUser,
    staleTime: 1000 * 60 * 1, // 1 minuto
    refetchInterval: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  })
}
