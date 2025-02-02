import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export class NotificationService {
  static async getNotifications() {
    try {
      const { data } = await privateRequest.get('/notifications/get/')
      return data
    } catch (error) {
      NotificationService.handleError(error)
    }
  }

  static async readNotification() {
    try {
      await privateRequest.put('/notifications/markAsRead')
    } catch (error) {
      NotificationService.handleError(error)
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
