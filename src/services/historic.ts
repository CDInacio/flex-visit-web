import type { Historic } from '@/types/historic'
import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export class HistoricService {
  static async getUserHistoric(): Promise<Historic[]> {
    try {
      const { data } = await privateRequest.get(`/historic/get`)
      return data
    } catch (error) {
      HistoricService.handleError(error)
    }
  }

  private static handleError(error: unknown): never {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || 'Erro desconhecido na API'
      )
    } else {
      throw new Error('Ocorreu um erro inesperado')
    }
  }
}
