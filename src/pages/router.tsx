import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PrivateRoute } from '../components/private-route.tsx'
import { privateRoutes } from '../routes.tsx'
import { IRoute } from '../types/routes.type.ts'
import useAuthStore from '@/store/user-auth.store.ts'
import { useEffect } from 'react'
import { Signup } from './signup/index.tsx'
import { Signin } from './signin/index.tsx'

export function Router() {
  const { user, setUserData } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setUserData(JSON.parse(user as string))
    }
  }, [location])

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {privateRoutes.map((route: IRoute, i: number) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Signin />} />
      <Route path="/cadastro" element={<Signup />} />
    </Routes>
  )
}
