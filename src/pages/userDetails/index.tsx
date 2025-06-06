import { useState, useEffect } from 'react'
import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetUserDetails } from '@/hooks/use-get-user-details'
import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useUpdateUser } from '@/hooks/use-update-user'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GoBack } from '@/components/ui/back-button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useDeleteUser } from '@/hooks/use-delete-user'
import { useToast } from '@/components/ui/use-toast'

export function UserDetails() {
  const { id } = useParams<{ id?: string }>()
  const { mutate: deleteUser, isPending: isLoadingDeleteUser } = useDeleteUser()
  const { toast } = useToast()

  const userQuery = id
    ? useGetUserDetails(id)
    : { data: null, isLoading: false }

  const userDetails = userQuery.data
  const isLoading = userQuery.isLoading

  const { mutate: updateUserDetails } = useUpdateUser()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    document: '',
    phoneNumber: '',
    role: 'User',
    profileImage: '',
  })

  useEffect(() => {
    if (userDetails) {
      setUserData({
        fullname: userDetails.fullname || '',
        email: userDetails.email || '',
        document: userDetails.document || '',
        phoneNumber: userDetails.phoneNumber || '',
        role: userDetails.role || 'User',
        profileImage: userDetails.profileImage || '',
      })
    }
  }, [userDetails])

  useEffect(() => {
    if (isLoadingDeleteUser) {
      toast({
        variant: 'default',
        title: 'Atualizando usuário',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoadingDeleteUser])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (id) {
      let data = { ...userData }
      updateUserDetails({ id, data })
      setIsEditing(false)
    }
  }
  console.log(updateUserDetails)
  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Container className="p-10 flex flex-col items-center">
      <div className="w-[1000px]">
        {/* Informações do usuário */}
        <div className="flex justify-between">
          <GoBack />
          <div className="flex gap-5">
            <Card
              className="p-3  hover:text-gray-700 cursor-pointer flex items-center gap-4"
              onClick={handleEdit}
            >
              <IoPencilOutline className="h-5 w-5 text-gray-500" />
            </Card>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Card className="p-3 cursor-pointer text-gray-500 hover:text-gray-700">
                  <IoTrashOutline className="h-5 w-5 " />
                </Card>
              </AlertDialogTrigger>
              {/* Remova esse espaço em branco extra */}
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
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteUser(id!)}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {isLoading ? (
          <div className="mt-5 relative w-[1000px]  ">
            <Skeleton className="w-24 h-24 rounded-full absolute right-10 -top-36" />
            <div className="flex flex-col gap-3 mt-40">
              <Skeleton className=" h-10" />
              <Skeleton className=" h-10" />
              <Skeleton className=" h-10" />
              <Skeleton className=" h-10" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mt-5">
              <Title>Perfil</Title>
              <div className="text-center">
                <div className="flex items-center">
                  <div className="relative group">
                    <Avatar className="w-24 h-24">
                      {userDetails?.profileImage ? (
                        <AvatarImage
                          src={userDetails?.profileImage}
                          alt="Profile Image"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {userDetails?.fullname
                            ? userDetails.fullname
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
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="fullname">Nome Completo</Label>
              <Input
                className="mt-2 mb-4"
                id="fullname"
                type="text"
                value={userData.fullname}
                disabled={!isEditing}
                onChange={(e) => handleChange('fullname', e.target.value)}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                className="mt-2 mb-4"
                id="email"
                type="email"
                value={userData.email}
                disabled={!isEditing}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Label htmlFor="document">Documento</Label>
              <Input
                className="mt-2 mb-4"
                id="document"
                type="text"
                value={userData.document}
                disabled={!isEditing}
                onChange={(e) => handleChange('document', e.target.value)}
              />
              <Label htmlFor="phone">Telefone</Label>
              <Input
                className="mt-2 mb-4"
                id="phone"
                type="text"
                value={userData.phoneNumber}
                disabled={!isEditing}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
              <Label>Role</Label>
              {isEditing ? (
                <Select
                  value={userData.role}
                  onValueChange={(value: string) => handleChange('role', value)}
                >
                  <SelectTrigger className="w-[100px]">
                    {userData.role}
                  </SelectTrigger>
                  <SelectContent className="w-[100px]">
                    <SelectGroup>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">Usuário</SelectItem>
                      <SelectItem value="ATTENDANT">Atendente</SelectItem>
                      <SelectItem value="COORDINATOR">Coordenador</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-400">{userData.role}</p>
              )}
              {isEditing && (
                <div>
                  <Button onClick={handleSave} className="mt-4">
                    Salvar
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="mt-4 ml-3 bg-destructive hover:bg-destructive/90"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
            <Separator className="my-8" />
            {/* Informações extras (discretas) */}
            <p className="text-sm text-gray-500 my-5">
              {userDetails?.createdAt &&
                `Conta criada em: ${format(
                  new Date(userDetails.createdAt),
                  'dd/MM/yyyy',
                  { locale: ptBR }
                )}`}
            </p>
            {userDetails?.role === 'VISITOR' ? (
              <>
                {/* Agendamentos do usuário */}
                <h1 className="text-lg font-bold tracking-tight lg:text-xl">
                  Agendamentos
                </h1>
                {userDetails?.bookings && userDetails.bookings.length > 0 ? (
                  userDetails.bookings.map((booking) => (
                    <Card key={booking.id} className=" p-4 my-4">
                      <p>
                        <strong>Status:</strong> {booking.status}
                      </p>
                      <p>
                        <strong>Data:</strong> {booking.data.data}
                      </p>
                      <p>
                        <strong>Horário:</strong> {booking.data.starttime} -{' '}
                        {booking.data.endtime}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Nenhum agendamento encontrado.
                  </p>
                )}
              </>
            ) : null}
          </>
        )}
      </div>
    </Container>
  )
}
