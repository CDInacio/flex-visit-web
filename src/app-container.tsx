import App from './App.tsx'
import { Toaster } from './components/ui/toaster.tsx'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Criação de uma instância do QueryClient
const client = new QueryClient()

export function AppContainer() {
  return (
    <QueryClientProvider client={client}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <App />
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  )
}
