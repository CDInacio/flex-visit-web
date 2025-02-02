import { Navigate, Outlet } from 'react-router-dom'
import { Nav } from './navigation/nav'
import { Drawer } from './navigation/drawer'

export function PrivateRoute() {
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('userToken')

  const isAuth = user && token

  return (
    <>
      {isAuth ? (
        <>
          <header>
            <Nav />
          </header>
          <Drawer />
          <Outlet />
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}
