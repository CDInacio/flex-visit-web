import { Container } from '@/components/container'
import { IoAddOutline } from 'react-icons/io5'
import { All } from '../../components/Form/all'
import { Link } from 'react-router-dom'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'
import { Button } from '../../components/ui/button'
import useAuthStore from '@/store/user-auth.store'

export function Forms() {
  const { user } = useAuthStore()

  return (
    <Container className="p-10  flex flex-col items-center">
      <div>
        <div className="mb-5">
          <Title>Formulários</Title>
          <Subtitle>Veja todos os formulários disponíveis</Subtitle>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex justify-end bg-red-5 w-full mb-3">
            <Link to="/formularios/novo">
              <Button>
                <IoAddOutline className="mr-3 h-6 w-6" />
                Adicionar formulário
              </Button>
            </Link>
          </div>
        )}
        <All />
      </div>
    </Container>
  )
}
