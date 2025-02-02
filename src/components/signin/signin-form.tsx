import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link } from 'react-router-dom'
import { useSignin } from '@/hooks/use-signin.hook'

const userFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(4, { message: 'Senha inválida' }),
})

type UserFormData = z.infer<typeof userFormSchema>

export function SigninForm() {
  const { toast } = useToast()
  const { mutate: signin, isPending: isLoading, isError } = useSignin()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    signin(data)
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !isError) {
      form.reset({
        email: '',
        password: '',
      })
    }
  }, [form.formState, form, toast, isError])

  return (
    <>
      <Form {...form}>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </Form>
      <p className="text-center mt-5 text-neutral-600">
        Não possui uma conta?{' '}
        <Link to="/cadastro" className="text-neutral-800 font-bold">
          Cadastre-se aqui
        </Link>
      </p>
    </>
  )
}
