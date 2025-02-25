import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Card } from './card'

export function GoBack() {
  const navigate = useNavigate()

  return (
    <Card
      className="p-3 cursor-pointer flex items-center gap-4"
      onClick={() => navigate(-1)}
    >
      <IoChevronBack className="h-5 w-5 text-gray-500" />
      <p className="text-gray-500 hover:text-gray-700">Voltar</p>
    </Card>
  )
}
