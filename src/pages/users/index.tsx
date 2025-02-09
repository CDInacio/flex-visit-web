import { Container } from '@/components/container'
import { useGetAllUsers } from '@/hooks/use-get-all-users.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { usePagination } from '@/hooks/use-pagination.hook'
import {
  IoAddOutline,
  IoFilterOutline,
  IoPencilOutline,
  IoTrashOutline,
} from 'react-icons/io5'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'
import { User } from '../../types/user.type'
import { Button } from '../../components/ui/button'
import { useDeleteUser } from '../../hooks/use-delete-user'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { SignupForm } from '../signup/signup-form'
import { useUpdateUser } from '../../hooks/use-update-user'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/user-auth.store'
import { useToast } from '@/components/ui/use-toast'
import { BookingSkeleton } from '@/components/Booking/Skeleton'
import { useEffect } from 'react'

export function Users() {
  const { user: auth } = useAuthStore()
  const navigate = useNavigate()
  const { data, isLoading } = useGetAllUsers()
  const { mutate: deleteUser, isPending: isLoadingDeleteUser } = useDeleteUser()
  const { mutate: updateUser, isPending: isLoadingUpdateUser } = useUpdateUser()
  const { toast } = useToast()
  // Função para lidar com a navegação e aplicar filtros de usuário e período
  const handleNavigate = (queryParam: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set(queryParam, value)
    const url = `/usuarios?${currentParams.toString()}`
    navigate(url)
  }

  // Função para filtrar os dados com base nos parâmetros
  const getFilteredData = (data: User[]) => {
    const param = new URLSearchParams(window.location.search)
    const usuario = param.get('role')
    const periodo = param.get('periodo')

    let filteredData = data

    if (usuario && usuario !== 'todos') {
      filteredData = filteredData?.filter(
        (user) => user.role.toLowerCase() === usuario
      )
    }

    if (periodo && periodo !== 'todos') {
      const currentDate = new Date()
      const today = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      )
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const thisWeek = new Date(today)
      thisWeek.setDate(thisWeek.getDate() - today.getDay())
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisYear = new Date(today.getFullYear(), 0, 1)

      switch (periodo) {
        case 'hoje':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= today
          )
          break
        case 'ontem':
          filteredData = filteredData?.filter(
            (user) =>
              new Date(user.createdAt) >= yesterday &&
              new Date(user.createdAt) < today
          )
          break
        case 'essa-semana':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisWeek
          )
          break
        case 'esse-mes':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisMonth
          )
          break
        case 'esse-ano':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisYear
          )
          break
        default:
          break
      }
    }
    return filteredData
  }

  // Adicionando paginação
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<User>(
    getFilteredData(data),
    5
  )

  const handleGoToDetailsPage = (id: string) => {
    navigate(`/usuarios/${id}`)
  }

  useEffect(() => {
    if (isLoadingDeleteUser) {
      toast({
        variant: 'default',
        title: 'Deletando usuário',
        description: 'Aguarde um momento...',
      })
    }

    if (isLoadingUpdateUser) {
      toast({
        variant: 'default',
        title: 'Atualizando usuário',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoadingDeleteUser, isLoadingUpdateUser])

  return (
    <Container className="flex flex-col items-center ">
      <div className="w-[1000px]  mt-10">
        <div className="mb-5">
          <div className="flex justify-between items-end">
            <div>
              <Title>Usuários</Title>
              <Subtitle>Lista de usuários cadastrados no sistema.</Subtitle>
            </div>
            {auth?.role === 'ADMIN' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <IoAddOutline className="mr-3 h-6 w-6" />
                    Adicionar usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <SignupForm />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <IoFilterOutline className="w-5 h-5" />
          {/* Filtrar por função de usuário */}
          <Select onValueChange={(value) => handleNavigate('role', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="attendant">Atendente</SelectItem>
                <SelectItem value="coordinator">Coordenador</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Filtrar por período */}
          <Select onValueChange={(value) => handleNavigate('periodo', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="essa-semana">Essa semana</SelectItem>
                <SelectItem value="esse-mes">Esse mês</SelectItem>
                <SelectItem value="esse-ano">Esse ano</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="w-[1000px] mt-5">
          <BookingSkeleton />
        </div>
      ) : (
        <>
          <Table className="w-[1000px] mx-auto mt-5">
            <TableHeader>
              <TableRow>
                <TableHead> Nome</TableHead>
                <TableHead> Email</TableHead>
                <TableHead> Telefone</TableHead>
                <TableHead> Nível de acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {itens?.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    <Avatar>
                      {user?.profileImage ? (
                        <AvatarImage
                          src={user?.profileImage}
                          alt="Profile Image"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.fullname
                            ? user.fullname
                                .split(' ')
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                            : 'NN'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p
                      className="cursor-pointer"
                      onClick={() => user?.id && handleGoToDetailsPage(user.id)}
                    >
                      {user.fullname}
                    </p>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell className="flex items-center">
                    <Select
                      onValueChange={(value) => {
                        if (auth?.role !== 'ADMIN') {
                          toast({
                            variant: 'destructive',
                            title: 'Erro ao atualizar usuário',
                            description:
                              'Você não pode alterar o nível de acesso de um usuário',
                          })
                          return
                        }
                        updateUser({ id: user.id, data: { role: value } })
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder={user.role} />
                      </SelectTrigger>
                      {auth?.role === 'ADMIN' && (
                        <SelectContent className="min-w-[100px]">
                          <SelectGroup>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="USER">Usuário</SelectItem>
                            <SelectItem value="ATTENDANT">Atendente</SelectItem>
                            <SelectItem value="COORDINATOR">
                              Coordenador
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      )}
                    </Select>
                    {auth?.role === 'ADMIN' && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <IoTrashOutline className="text-gray-500 cursor-pointer mx-5" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja deletar essa conta?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(user.id!)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <IoPencilOutline className="text-gray-500 cursor-pointer " />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {numbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === num}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, numbers.length))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </Container>
  )
}
