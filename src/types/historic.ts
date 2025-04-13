import type { User } from './user.type'

export interface Historic {
  id: string
  dateTime: string
  userId: string
  action: string
  details: string
  user: User
}
