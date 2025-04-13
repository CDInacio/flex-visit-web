interface StatusBadgeProps {
  userAccesLevel: string
}

const translateAccesLevel = (text: string) => {
  switch (text) {
    case 'ADMIN':
      return 'Administrador'
    case 'VISITOR':
      return 'Visitante'
    case 'ATTENDANT':
      return 'Atendente'
    case 'COORDINATOR':
      return 'Coordenador'
    default:
      return 'Desconhecido'
  }
}

export function UserBadge({ userAccesLevel }: StatusBadgeProps) {
  switch (userAccesLevel) {
    case 'ADMIN':
      return (
        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
          {translateAccesLevel(userAccesLevel)}
        </span>
      )
    case 'VISITOR':
      return (
        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
          {translateAccesLevel(userAccesLevel)}
        </span>
      )
    case 'ATTENDANT':
      return (
        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded-full">
          {translateAccesLevel(userAccesLevel)}
        </span>
      )
    case 'COORDINATOR':
      return (
        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">
          {translateAccesLevel(userAccesLevel)}
        </span>
      )
    default:
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
          {translateAccesLevel(userAccesLevel)}
        </span>
      )
  }
}
