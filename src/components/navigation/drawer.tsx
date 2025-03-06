import {
  IoDocumentTextOutline,
  IoPersonCircleOutline,
  IoPersonOutline,
  IoCalendarClearOutline,
  IoHomeOutline,
  IoTimeOutline,
} from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import useAuthStore from '@/store/user-auth.store'

interface DrawerItemProps {
  name: string
  icon: JSX.Element
  path: string
}

const drawerItems: DrawerItemProps[] = [
  {
    name: 'Home',
    icon: <IoHomeOutline className="w-5 h-5" />,
    path: '/',
  },
  {
    name: 'Perfil',
    icon: <IoPersonOutline className="w-5 h-5" />,
    path: '/perfil',
  },
  {
    name: 'Formulários',
    icon: <IoDocumentTextOutline className="w-5 h-5" />,
    path: '/formularios?q=todos',
  },
  {
    name: 'Agendamentos',
    icon: <IoCalendarClearOutline className="w-5 h-5" />,
    path: '/agendamentos?f=todos',
  },
  {
    name: 'Horários',
    icon: <IoTimeOutline className="w-5 h-5" />,
    path: '/horarios',
  },
  {
    name: 'Usuários',
    icon: <IoPersonCircleOutline className="w-5 h-5" />,
    path: '/usuarios',
  },
]

const renderDrawerItem = (item: DrawerItemProps, isAdmin: boolean) => {
  const adminActions = ['Usuários', 'Formulários', 'Home', 'Horários']
  if (adminActions.includes(item.name) && !isAdmin) return null

  return (
    <div
      className="hover:bg-[#383838] hover:text-[#111827] transition-colors my-3  rounded cursor-pointer focus:bg-accent 
  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <NavLink
        to={item.path}
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#383838' : 'transparent',
          color: isActive ? '#ffff' : '#9ca3af',
          borderRadius: '4px',
          // fontWeight: isActive ? '550' : '400',
        })}
        className={'flex items-center px-2 py-1.5'}
      >
        {item.icon}
        <p className="ml-2 ">{item.name}</p>
      </NavLink>
    </div>
  )
}

export const Drawer = () => {
  const { user } = useAuthStore()
  console.log(user)
  return (
    <div className="h-screen p-[20px] w-[250px] dark:bg-transparent bg-white border border-r-[1px] fixed left-0">
      <div className="flex flex-col justify-between  h-full my-[100px]">
        <div>
          {drawerItems.map((item) => (
            <div key={item.name}>
              {renderDrawerItem(
                item,
                user?.role === 'ADMIN' || user?.role === 'ATTENDANT'
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
