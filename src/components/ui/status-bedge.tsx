import { capitalizeFirstLetter } from '@/utils/formate-name'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const capitalizedStatus = capitalizeFirstLetter(status)

  switch (status) {
    case 'pendente':
      return (
        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
          {capitalizedStatus}
        </span>
      )
    case 'aprovado':
      return (
        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
          {capitalizedStatus}
        </span>
      )
    case 'cancelado':
      return (
        <span className="px-2 py-1 bg-red-200 text-red-900  text-xs font-semibold rounded-full">
          {capitalizedStatus}
        </span>
      )
    case 'concluido':
      return (
        <span className="px-2 py-1 bg-sky-200 text-sky-800 text-xs font-semibold rounded-full">
          {capitalizedStatus}
        </span>
      )
    default:
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
          {capitalizedStatus}
        </span>
      )
  }
}
