import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export class BookingService {
  static async createBooking(data: any) {
    try {
      const response = await privateRequest.post('/booking/create', data)
      return response.data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async getBookings() {
    try {
      const response = await privateRequest.get('/booking/getAll')
      return response.data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async deleteBooking(bookingId: string) {
    try {
      const response = await privateRequest.delete(
        `/booking/delete/${bookingId}`
      )
      return response.data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async getBooking(queryKey: [string, string]) {
    const id = queryKey[1]
    if (!id) return
    try {
      const { data } = await privateRequest.get(`/booking/getBookingById/${id}`)
      return data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async getDataOverview() {
    try {
      const { data } = await privateRequest.get('/booking/overview')
      return data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async getUserBookings() {
    try {
      const { data } = await privateRequest.get('/booking/user')
      return data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async updateBooking(bookingId: string, data: any) {
    try {
      const response = await privateRequest.put(
        `/booking/update/${bookingId}`,
        data
      )
      return response.data
    } catch (error) {
      BookingService.handleError(error)
    }
  }

  static async updateBookingStatus({
    id,
    status,
    userId,
    role,
    booking,
    observation,
  }: {
    id: string
    status: string
    userId: string
    role: string
    booking: any
    observation?: string
  }) {
    try {
      const response = await privateRequest.put(`/booking/updateStatus/${id}`, {
        status,
        userId,
        role,
        booking,
        observation,
      })
      return response.data
    } catch (error) {
      BookingService.handleError(error)
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
