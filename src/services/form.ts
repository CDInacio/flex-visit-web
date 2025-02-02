import type { Form } from '@/types/form.typep'
import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export class FormService {
  static async createForm(form: Form) {
    try {
      const response = await privateRequest.post('/form/create', form)
      return response.data
    } catch (error) {
      FormService.handleError(error)
    }
  }

  static async deleteForm(id: string) {
    try {
      const response = await privateRequest.delete(`/form/delete/${id}`)
      return response.data
    } catch (error) {
      FormService.handleError(error)
    }
  }

  static async getForms() {
    try {
      const response = await privateRequest.get('/form/getAll')
      return response.data
    } catch (error) {
      FormService.handleError(error)
    }
  }

  static async getForm(id: string) {
    try {
      const response = await privateRequest.get(`/form/get/${id}`)
      return response.data
    } catch (error) {
      FormService.handleError(error)
    }
  }

  static async updateForm(id: string, data: any) {
    try {
      const response = await privateRequest.put(`/form/update/${id}`, data)
      return response.data
    } catch (error) {
      FormService.handleError(error)
    }
  }

  static async updateFormStatus(id: string, isActive: boolean) {
    try {
      const response = await privateRequest.put(`/form/updateStatus/${id}`, {
        isActive,
      })
      return response.data
    } catch (error) {
      FormService.handleError(error)
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
