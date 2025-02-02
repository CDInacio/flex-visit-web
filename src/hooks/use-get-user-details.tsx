import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/user'
import { queryConfig } from '@/config/queryConfig'

export function useGetUserDetails(id: string) {
  return useQuery({
    queryKey: ['user-details', id],
    queryFn: () => UserService.getUserDetails(id),
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
