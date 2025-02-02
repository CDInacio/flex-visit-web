import { IRoute } from './types/routes.type.ts'
import { Forms } from './pages/forms/index.tsx'
import { Users } from './pages/users/index.tsx'
import { Clients } from './pages/clients/index.tsx'
import { Bookings } from './pages/bookings/index.tsx'
import { Profile } from './pages/profile/index.tsx'
import { Home } from './pages/home/index.tsx'
import { Form } from './pages/form/index.tsx'
import { NewForm } from './pages/newForm/index.tsx'
import { NewBooking } from './pages/newBooking/index.tsx'
import { BookingDetails } from './pages/booking/index.tsx'
import { Schedules } from './pages/schedules/index.tsx'
import { NewSchedule } from './components/Schedule/new.tsx'
import { UserDetails } from './pages/userDetails/index.tsx'

export const privateRoutes: IRoute[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/formularios',
    element: <Forms />,
  },
  {
    path: '/formularios/novo',
    element: <NewForm />,
  },
  {
    path: '/formularios/:id',
    element: <Form />,
  },
  {
    path: '/usuarios',
    element: <Users />,
  },
  {
    path: '/usuarios/:id',
    element: <UserDetails />,
  },
  {
    path: '/clientes',
    element: <Clients />,
  },
  {
    path: '/agendamentos',
    element: <Bookings />,
  },
  {
    path: '/agendamentos/:id',
    element: <BookingDetails />,
  },
  {
    path: '/agendamentos/novo',
    element: <NewBooking />,
  },
  {
    path: '/perfil',
    element: <Profile />,
  },
  {
    path: '/horarios',
    element: <Schedules />,
  },
  {
    path: '/horarios/novo',
    element: <NewSchedule />,
  },
]
