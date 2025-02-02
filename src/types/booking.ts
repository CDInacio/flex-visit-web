import { User } from './user.type'

export interface Booking {
  id: string
  createdAt: string
  data: unknown
  form: unknown
  formId: string
  user: User
  status: string
  userId: string
}
