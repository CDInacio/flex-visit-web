import { useQuery } from '@tanstack/react-query'
import { FormService } from '@/services/form'
import { queryConfig } from '@/config/queryConfig'

export function useGetForm(id: string) {
  return useQuery({
    queryKey: ['form', id],
    queryFn: ({ queryKey }) => FormService.getForm(queryKey[1]),
    ...queryConfig,
  })
}
