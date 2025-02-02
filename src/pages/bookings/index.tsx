/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin } from '@/components/Booking/admin'
import { Container } from '../../components/container'

import useAuthStore from '../../store/user-auth.store'
import { User } from '@/components/Booking/user'

export function Bookings() {
  const { user } = useAuthStore()

  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'COORDINATOR' ||
    user?.role === 'ATTENDANT'

  return (
    <Container className="p-10  flex flex-col items-center  overflow-hidden">
      {!isAdmin ? <User /> : <Admin />}
    </Container>
  )
}
