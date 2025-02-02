import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/user'
import { queryConfig } from '@/config/queryConfig'

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: UserService.getUser,
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
