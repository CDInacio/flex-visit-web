import { useQuery } from '@tanstack/react-query'
import { queryConfig } from '@/config/queryConfig'
import { HistoricService } from '@/services/historic'

export function useGetHistoric() {
  return useQuery({
    queryKey: ['user-historic'],
    queryFn: () => HistoricService.getUserHistoric(),
    ...queryConfig,
    refetchOnWindowFocus: false,
  })
}
