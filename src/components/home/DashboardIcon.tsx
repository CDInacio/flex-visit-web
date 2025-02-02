import {
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
} from 'react-icons/io5'

export function DashboardIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'bookings':
      return <IoCalendarClearOutline className="w-10 h-10 text-yellow-400" />
    case 'recent bookings':
      return <IoCalendarOutline className="w-10 h-10 text-sky-400" />
    case 'user':
      return <IoPersonOutline className="w-10 h-10 text-green-400" />
    case 'form':
      return <IoDocumentTextOutline className="w-10 h-10 text-blue-400" />
    default:
      return null
  }
}
