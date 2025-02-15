import type { User } from '@/types/user.type'
import type { QueryClient } from '@tanstack/react-query'
import { create } from 'zustand'

interface State {
  user: User | null
}

interface Actions {
  setUserData: (data: User) => void
  logout: (queryClient: QueryClient) => void
}

const useAuthStore = create<State & Actions>((set) => ({
  user: null,
  setUserData: (data: User) => {
    set({ user: data })
  },
  logout: (queryClient) => {
    queryClient.clear()
    localStorage.removeItem('user')
    localStorage.removeItem('userToken')
    set({ user: null })
  },
}))

export default useAuthStore
