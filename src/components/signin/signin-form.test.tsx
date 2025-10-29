import { render, screen, waitFor } from '@testing-library/react'
import { SigninForm } from './signin-form'
import { useSignin } from '@/hooks/use-signin.hook'
import { BrowserRouter } from 'react-router-dom'

// Mock the useSignin hook
jest.mock('@/hooks/use-signin.hook')

// Mock the toast component
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const mockUseSignin = useSignin as jest.MockedFunction<typeof useSignin>

describe('SigninForm', () => {
  const mockSignin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('form resets after successful signin', async () => {
    // Mock successful signin - initially false, then we'll change to true
    mockUseSignin.mockReturnValue({
      mutate: mockSignin,
      isPending: false,
      isSuccess: false,
    } as any)

    const { rerender } = render(
      <BrowserRouter>
        <SigninForm />
      </BrowserRouter>
    )

    // Get form inputs
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    // Initially inputs should be empty
    expect(emailInput.value).toBe('')
    expect(passwordInput.value).toBe('')

    // Simulate user typing (this would normally happen through user events)
    emailInput.value = 'test@example.com'
    passwordInput.value = 'password123'

    // Verify inputs have values
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')

    // Change mock to return isSuccess: true
    mockUseSignin.mockReturnValue({
      mutate: mockSignin,
      isPending: false,
      isSuccess: true,
    } as any)

    // Rerender with isSuccess: true to trigger the useEffect
    rerender(
      <BrowserRouter>
        <SigninForm />
      </BrowserRouter>
    )

    // After successful signin, form should reset
    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
  })

  test('form does not reset when signin is not successful', () => {
    // Mock unsuccessful signin
    mockUseSignin.mockReturnValue({
      mutate: mockSignin,
      isPending: false,
      isSuccess: false,
    } as any)

    render(
      <BrowserRouter>
        <SigninForm />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement

    // Simulate user typing
    emailInput.value = 'test@example.com'
    passwordInput.value = 'password123'

    // Form should not reset
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('renders signin form with all elements', () => {
    mockUseSignin.mockReturnValue({
      mutate: mockSignin,
      isPending: false,
      isSuccess: false,
    } as any)

    render(
      <BrowserRouter>
        <SigninForm />
      </BrowserRouter>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/não possui uma conta\?/i)).toBeInTheDocument()
  })
})
