import { useState, useEffect } from 'react'
import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetUserDetails } from '@/hooks/use-get-user-details'
// import { useUpdateUserDetails } from '@/hooks/use-update-user-details'
import { IoChevronDownOutline, IoPencilOutline } from 'react-icons/io5'
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
import { useUpdateUserImg } from '@/hooks/use-update-userImg'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GoBack } from '@/components/ui/back-button'
import { Skeleton } from '@/components/ui/skeleton'

export function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: userDetails, isLoading } = id
    ? useGetUserDetails(id)
    : { data: null }
  const { mutate: updateUserDetails } = useUpdateUser()
  const { mutate: updateImg } = useUpdateUserImg()
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

  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0]
      const formData = new FormData()
      formData.append('image', file)

      updateImg(
        { id: userDetails?.id, data: formData },
        {
          onSuccess: (data) => {
            setUserData({
              ...userDetails!,
              profileImage: data.user.profileImage,
            })
            localStorage.setItem('user', JSON.stringify(data.user))
          },
        }
      )
    }
  }

  return (
    <Container className="p-10 flex flex-col items-center">
      <div className="w-[1000px]">
        {/* Informações do usuário */}
        <GoBack />
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
                    <input
                      type="file"
                      className="opacity-0 absolute inset-0 z-20 cursor-pointer"
                      onChange={handleUpdateImage}
                    />
                    <Avatar className="w-24 h-24 group-hover:brightness-75 transition-all duration-200">
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
                    <IoPencilOutline className="absolute inset-0 m-auto w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IoChevronDownOutline className="w-5 h-5 ml-3 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="">
                      <DropdownMenuItem
                        className="cursor-pointer "
                        onClick={handleEdit}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="fullname">Nome Completo</Label>
              <Input
                id="fullname"
                type="text"
                value={userData.fullname}
                disabled={!isEditing}
                onChange={(e) => handleChange('fullname', e.target.value)}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                disabled={!isEditing}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                type="text"
                value={userData.document}
                disabled={!isEditing}
                onChange={(e) => handleChange('document', e.target.value)}
              />
              <Label htmlFor="phone">Telefone</Label>
              <Input
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
            {userDetails?.role === 'USER' ? (
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
            ) : (
              <p>outros</p>
            )}
          </>
        )}
      </div>
    </Container>
  )
}
