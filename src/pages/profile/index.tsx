import {
  IoIdCardOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
} from 'react-icons/io5'
import { Container } from '../../components/container'
import { Separator } from '../../components/ui/separator'
import { useGetUser } from '../../hooks/use-get-user'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getFirstNames } from '@/utils/formate-name'
import { Title } from '@/components/title'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateUser } from '../../hooks/use-update-user'
import useAuthStore from '@/store/user-auth.store'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/status-bedge'
import { UserBadge } from '@/components/ui/user-bedge'
import {
  ProfileAvatarSkeleton,
  ProfileBookingsSkeleton,
} from '@/components/profile/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { toast } from '@/components/ui/use-toast'
import { PageTitle } from '@/utils/pageTitle'
import { useQueryClient } from '@tanstack/react-query'
import { useGetHistoric } from '@/hooks/use-get-historic'
import { formateDate } from '@/utils/formate-date'
import type { Historic } from '@/types/historic'

export function Profile() {
  const queryClient = useQueryClient()
  const storedUser = useAuthStore()
  const { data: historic } = useGetHistoric()
  const navigate = useNavigate()
  const { data: user, isLoading: loadingUser } = useGetUser()
  const { data: bookings, isLoading: loadingBookings } = useGetUserBookings()
  const { mutate: updateUser, isPending: loadingUpdateUser } = useUpdateUser()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Número de registros por página

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = currentPage * itemsPerPage
  const currentHistoric = historic?.slice(startIndex, endIndex) || []

  const handleLogout = () => {
    storedUser.logout(queryClient)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    document: '',
  })

  useEffect(() => {
    if (user) {
      setUserData({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        document: user.document || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (loadingUpdateUser) {
      toast({
        variant: 'default',
        title: 'Atualizando as informações',
        description: 'Aguarde um momento...',
      })
    }
  }, [loadingUpdateUser])

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (Object.values(userData).some((value) => !value)) {
      return toast({
        variant: 'destructive',
        title: 'Erro ao atualizar informações',
        description: 'Preencha todos os campos para continuar.',
      })
    }

    if (storedUser.user) {
      updateUser(
        { id: storedUser.user.id, data: userData },
        {
          onSuccess(data) {
            if (data.logoutRequired) {
              toast({
                variant: 'default',
                title: 'Informações atualizadas',
                description:
                  'Suas informações foram atualizadas com sucesso. Faça login novamente para continuar.',
              })
              setTimeout(() => {
                handleLogout()
              }, 2000)
              return
            }
            toast({
              variant: 'success',
              title: 'Informações atualizadas',
              description: 'Suas informações foram atualizadas com sucesso.',
            })
          },
          onError() {
            setUserData({
              fullname: user?.fullname || '',
              email: user?.email || '',
              phoneNumber: user?.phoneNumber || '',
              document: user?.document || '',
            })
          },
        }
      )
    }

    setIsEditing(false)
  }

  const goToDetailsPage = (path: string, id: string) => {
    navigate(`/${path}/${id}`)
  }

  return (
    <>
      <PageTitle title="Perfil" />
      <Container className="p-10 flex flex-col ">
        <div className="flex flex-col gap-10">
          {loadingUser ? (
            <ProfileAvatarSkeleton />
          ) : (
            <div className="text-center overflow-hidden pb-6">
              <div className="flex items-start">
                <div className="relative group">
                  <Avatar className="w-56 h-56 ">
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
                </div>
                <div className="text-start ml-5 w-full">
                  {!isEditing ? (
                    <>
                      <UserBadge userAccesLevel={user?.role || ''} />
                      <h1 className="font-semibold text-2xl mt-2">
                        {getFirstNames(userData.fullname, 2)}
                      </h1>
                      <div className="flex items-center">
                        <IoMailOutline />
                        <p className="text-gray-500 ml-2">{userData.email}</p>
                      </div>
                      <div className="flex items-center">
                        <IoPhonePortraitOutline />
                        <p className="text-gray-500 ml-2">
                          {userData.phoneNumber}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <IoIdCardOutline />
                        <p className="text-gray-500 ml-2">
                          {userData.document}
                        </p>
                      </div>
                      <Button
                        className="mt-4"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mt-4">
                        <label className="block font-medium text-sm">
                          Nome Completo
                        </label>
                        <Input
                          value={userData.fullname}
                          onChange={(e) =>
                            handleChange('fullname', e.target.value)
                          }
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block font-medium text-sm">
                          Email
                        </label>
                        <Input
                          value={userData.email}
                          onChange={(e) =>
                            handleChange('email', e.target.value)
                          }
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block font-medium text-sm">
                          Telefone
                        </label>
                        <Input
                          value={userData.phoneNumber}
                          onChange={(e) =>
                            handleChange('phoneNumber', e.target.value)
                          }
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block font-medium text-sm">
                          Documento
                        </label>
                        <Input
                          value={userData.document}
                          onChange={(e) =>
                            handleChange('document', e.target.value)
                          }
                        />
                      </div>
                      <div className="mt-4 flex gap-4">
                        <Button onClick={handleSave}>Salvar</Button>
                        <Button
                          variant="destructive"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator />
          {/* Agendamentos do Usuário */}
          {(user?.role === 'ADMIN' || user?.role === 'ATTENDANT') && (
            <>
              <Title> Histórico de atividades</Title>
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Data</TableHead>
                    <TableHead className="w-[400px]">Responsável</TableHead>
                    <TableHead className="w-[400px]">Ação</TableHead>
                    <TableHead className="">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentHistoric.map((data: Historic) => (
                    <TableRow key={data.id}>
                      <TableCell>
                        {formateDate(data.dateTime, 'dd/mm/yyyy hh:mm')}
                      </TableCell>
                      <TableCell
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          data.user?.id && goToDetailsPage('usuarios', user.id)
                        }
                      >
                        <Avatar>
                          {data.user?.profileImage ? (
                            <AvatarImage
                              src={data.user?.profileImage}
                              alt="Profile Image"
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              {data.user?.fullname
                                ? data.user.fullname
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
                        {data.user.fullname}
                      </TableCell>
                      <TableCell>{data.action}</TableCell>
                      <TableCell className="">{data.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination className="">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {[
                    ...Array(Math.ceil((historic?.length || 0) / itemsPerPage)),
                  ].map((_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil((historic?.length ?? 0) / itemsPerPage)
                          )
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
          {storedUser.user?.role === 'VISITOR' && loadingBookings ? (
            <ProfileBookingsSkeleton />
          ) : (
            user?.role === 'VISITOR' && (
              <div className="w-[500px]">
                <Title>Meus Agendamentos</Title>
                <Separator className="my-3" />
                <div>
                  {bookings?.map(
                    (data: {
                      id: string
                      form: { form_name: string }
                      data: { data: string }
                      status: string
                    }) => (
                      <div
                        key={data.id}
                        className="my-3 "
                        onClick={() => goToDetailsPage('agendamentos', data.id)}
                      >
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 cursor-pointer">
                          <div>
                            <p className="font-medium">{data.form.form_name}</p>
                            <p className="text-gray-500">{data.data.data}</p>
                          </div>
                          <div>
                            <StatusBadge status={data.status} />
                          </div>
                        </div>
                        <Separator className="my-3" />
                      </div>
                    )
                  )}
                  {bookings?.length === 0 && (
                    <p className="text-center text-gray-500">
                      Nenhum agendamento encontrado.
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </Container>
    </>
  )
}
