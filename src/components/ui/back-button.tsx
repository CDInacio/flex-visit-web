import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Card } from './card'

export function GoBack() {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(-1)}
      className="flex relative w-fit cursor-pointer  py-2 px-8  items-center text-gray-500 hover:text-gray-700"
    >
      <IoChevronBack className="mr-2 absolute left-2 " />
      Voltar
    </Card>
  )
}
