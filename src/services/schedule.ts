import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export class ScheduleService {
  static async createSchedules(schedules: any) {
    try {
      const response = await privateRequest.post('schedule/create', schedules)
      return response.data
    } catch (error) {
      ScheduleService.handleError(error)
    }
  }

  static async getAvailableDates() {
    try {
      const response = await privateRequest.get('/schedule/avaliableDates')
      return response.data
    } catch (error) {
      ScheduleService.handleError(error)
    }
  }

  static async getSchedules() {
    try {
      const schedules = await privateRequest.get('/schedule/get')
      return schedules.data
    } catch (error) {
      ScheduleService.handleError(error)
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
