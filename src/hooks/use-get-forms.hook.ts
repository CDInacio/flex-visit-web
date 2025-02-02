import { queryConfig } from '@/config/queryConfig'
import { FormService } from '@/services/form'
import { useQuery } from '@tanstack/react-query'

export function useGetForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: FormService.getForms,
    ...queryConfig,
  })
}
