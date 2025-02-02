import { UserSigninCredentials, UserSignupCredentials } from '@/types/auth.type'
import type { User } from '@/types/user.type'
import { api, privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

interface SigninResponse {
  token: string
  user: {
    name: string
    email: string
    role: string
  }
}

export class UserService {
  static async signup(credentials: UserSignupCredentials) {
    try {
      const response = await api.post('/user/signup', credentials)
      return response.data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async signin(
    credentials: UserSigninCredentials
  ): Promise<SigninResponse> {
    try {
      const response = await api.post('/user/signin', credentials)
      return response.data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async getAllUsers() {
    try {
      const response = await privateRequest.get('/user/getAll')
      return response.data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async deleteUser(id: string) {
    try {
      const response = await privateRequest.delete(`/user/delete/${id}`)
      return response.data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async getUserDetails(id: string): Promise<User> {
    try {
      const { data } = await privateRequest.get(`/user/userDetails/${id}`)
      return data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async getUser(): Promise<User> {
    try {
      const { data } = await privateRequest.get(`/user/getUser`)
      return data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async updateUser({
    id,
    data,
  }: {
    id: string | undefined
    data: unknown
  }) {
    try {
      const response = await privateRequest.put(`/user/updateUser/${id}`, data)
      return response.data
    } catch (error) {
      UserService.handleError(error)
    }
  }

  static async updateUserImg({
    id,
    data,
  }: {
    id: string | undefined
    data: any
  }) {
    try {
      const response = await privateRequest.put(
        `/user/updateUserImg/${id}`,
        data
      )
      return response.data
    } catch (error) {
      UserService.handleError(error)
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
