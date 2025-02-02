import { queryConfig } from '@/config/queryConfig'
import { UserService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'

export function useGetAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: UserService.getAllUsers,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
