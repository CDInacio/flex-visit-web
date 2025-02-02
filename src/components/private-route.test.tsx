import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './private-route'

// Mock the components used in PrivateRoute
jest.mock('./navigation/nav', () => ({
  Nav: () => <div>Mocked Nav</div>,
}))

jest.mock('./navigation/drawer', () => ({
  Drawer: () => <div>Mocked Drawer</div>,
}))

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders Nav, Drawer, and Outlet when authenticated', () => {
    localStorage.setItem('user', 'testUser')
    localStorage.setItem('userToken', 'testToken')

    const { getByText } = render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />} />
        </Routes>
      </MemoryRouter>
    )

    expect(getByText('Mocked Nav')).toBeInTheDocument()
    expect(getByText('Mocked Drawer')).toBeInTheDocument()
  })

  test('redirects to /login when not authenticated', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(container.innerHTML).toContain('Login Page')
  })
})
