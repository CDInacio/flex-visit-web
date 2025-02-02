import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import useAuthStore from '@/store/user-auth.store'
import {
  IoNotificationsOutline,
  IoChevronDownOutline,
  IoCheckmarkCircle,
  IoPencilOutline,
} from 'react-icons/io5'
import { Separator } from '../ui/separator'
import { useGetNotifications } from '../../hooks/use-get-user-notifications'
import { useReadNotification } from '../../hooks/use-read-notification'
import { formatRelativeDate } from '../../utils/formate-date'
import { Notification } from '../../types/notification.type'
import { useUpdateUserImg } from '../../hooks/use-update-userImg'
import { useNavigate } from 'react-router-dom'

export function Nav() {
  const navigate = useNavigate()
  const { mutate: readNotification } = useReadNotification()
  const { user, logout, setUserData } = useAuthStore()
  const { data: notifications } = useGetNotifications()
  const { mutate: updateImage } = useUpdateUserImg()
  let notificationsLen = 0

  if (notifications) {
    notificationsLen = notifications?.filter(
      (item: Notification) => item.read === false
    ).length
  }

  const handleReadNotification = () => {
    if (notificationsLen === 0) return
    readNotification()
  }

  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0]
      const formData = new FormData()
      formData.append('image', file)

      updateImage(
        { id: user?.id, data: formData },
        {
          onSuccess: (data) => {
            // Atualize o estado do usuário com a nova imagem
            setUserData({ ...user!, profileImage: data.user.profileImage })
            localStorage.setItem('user', JSON.stringify(data.user))
          },
        }
      )
    }
  }

  const handleGoHome = () => {
    if (user?.role === 'USER') {
      navigate('/perfil')
      return
    }
    navigate('/')
  }

  return (
    <div className="w-full px-24 h-[80px] flex items-center bg-white fixed z-30 border border-b-[1px] ">
      <img
        onClick={handleGoHome}
        src={'/images/logo.png'}
        className="h-32  w-32 cursor-pointer"
      />
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="relative">
                  <IoNotificationsOutline className="w-6 h-6" />
                  {notificationsLen > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notificationsLen}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-[400px]  max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between ">
                  <p className="text-base leading-7 [&:not(:first-child)]:mt-6 font-bold">
                    Notificações
                  </p>
                  <p
                    onClick={handleReadNotification}
                    className="text-blue-400 font-bold cursor-pointer"
                  >
                    Marcar como lidas
                  </p>
                </div>
                <Separator className="w-full my-1" />
                {notifications?.map((item: Notification, i: number) => (
                  <div
                    key={i}
                    className="flex items-center  justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2w-full">
                      {item.type === 'success' ? (
                        <IoCheckmarkCircle className="text-green-400 w-5 h-5" />
                      ) : item.type === 'error' ? (
                        <IoCheckmarkCircle />
                      ) : null}
                      <div className="flex flex-col gap-y-1">
                        <h5 className="font-bold text-gray-800">
                          {item.message}
                        </h5>
                        <p className="text-gray-700">{item.description}</p>
                        <span className="text-gray-400">
                          {formatRelativeDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator className="h-[60px] mx-5" orientation="vertical" />
          <div className="flex flex-col items-end leading-5">
            <p className="mr-3 font-bold">{user?.fullname}</p>
            <p className="mr-3 text-gray-500">{user?.email}</p>
          </div>
          <Separator className="w-[20px]" orientation="vertical" />
          <div className="relative group ">
            <input
              type="file"
              className="opacity-0 absolute inset-0 z-20 cursor-pointer"
              onChange={handleUpdateImage}
            />
            <Avatar className="group-hover:brightness-75 transition-all duration-200">
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
                    : 'NN'}{' '}
                </AvatarFallback>
              )}
            </Avatar>
            <IoPencilOutline className="absolute inset-0 m-auto w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 " />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoChevronDownOutline className="w-5 h-5 ml-3 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
