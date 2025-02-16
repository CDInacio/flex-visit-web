import { Booking } from '@/types/booking'
import { Title } from '../../components/title'
import { useGetBookings } from '../../hooks/use-get-bookings.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '../../utils/formate-date'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useUpdateBookingStatus } from '../../hooks/use-update-bookingStatus'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useNavigate } from 'react-router-dom'
import { IoFilterOutline } from 'react-icons/io5'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useAuthStore from '@/store/user-auth.store'
import { BookingsSkeleton } from '../Bookings/Skeleton'
import { toast } from '../ui/use-toast'

interface SelectedBooking {
  id: string
  status: string
  userId: string
  role: string
  booking: Booking
}

function getFilteredData(data: Booking[]) {
  const cParams = new URLSearchParams(window.location.search)
  const filter = cParams.get('f')
  const periodo = cParams.get('periodo')

  let filteredData = data

  if (filter && filter !== 'todos') {
    filteredData = filteredData?.filter(
      (booking: Booking) => booking.status === filter
    )
  }

  if (periodo && periodo !== 'todos') {
    const currentDate = new Date()
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - today.getDay())
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const thisYear = new Date(today.getFullYear(), 0, 1)

    switch (periodo) {
      case 'hoje':
        filteredData = filteredData?.filter(
          (booking) => new Date(booking.createdAt) >= today
        )
        break
      case 'ontem':
        filteredData = filteredData?.filter(
          (booking) =>
            new Date(booking.createdAt) >= yesterday &&
            new Date(booking.createdAt) < today
        )
        break
      case 'essa-semana':
        filteredData = filteredData?.filter(
          (booking) => new Date(booking.createdAt) >= thisWeek
        )
        break
      case 'esse-mes':
        filteredData = filteredData?.filter(
          (booking) => new Date(booking.createdAt) >= thisMonth
        )
        break
      case 'esse-ano':
        filteredData = filteredData?.filter(
          (booking) => new Date(booking.createdAt) >= thisYear
        )
        break
      default:
        break
    }
  }

  return filteredData
}

export function Admin() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: bookings, isLoading } = useGetBookings()
  const { mutate: updateStatus, isPending: isLoadingUpdateStatus } =
    useUpdateBookingStatus()

  const currentParams = new URLSearchParams(window.location.search)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const [observation, setObservation] = useState('')
  const [selectedBooking, setSelectedBooking] =
    useState<SelectedBooking | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const handleNavigate = useCallback(
    (queryParam: string, value: string) => {
      currentParams.delete(queryParam)
      currentParams.append(queryParam, value)
      const url = `/agendamentos?${currentParams.toString()}`
      navigate(url)
    },
    [navigate, currentParams]
  )

  const handleClearFilters = () => {
    setSelectedStatus(null)
    setSelectedPeriod(null)
    navigate('/agendamentos')
  }

  useEffect(() => {
    if (isLoadingUpdateStatus) {
      toast({
        variant: 'default',
        title: 'Atualizando status do agendamento',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoadingUpdateStatus])

  const getFilteredData = useMemo(() => {
    let filteredData = bookings || []

    if (selectedStatus && selectedStatus !== 'todos') {
      filteredData = filteredData.filter(
        (booking: { status: string }) => booking.status === selectedStatus
      )
    }

    if (selectedPeriod && selectedPeriod !== 'todos') {
      const today = new Date()
      const thisWeek = new Date(today)
      thisWeek.setDate(today.getDate() - today.getDay())
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisYear = new Date(today.getFullYear(), 0, 1)

      filteredData = filteredData.filter(
        (booking: { createdAt: string | number | Date }) => {
          const bookingDate = new Date(booking.createdAt)
          switch (selectedPeriod) {
            case 'hoje':
              return bookingDate.toDateString() === today.toDateString()
            case 'essa-semana':
              return bookingDate >= thisWeek
            case 'esse-mes':
              return bookingDate >= thisMonth
            case 'esse-ano':
              return bookingDate >= thisYear
            default:
              return true
          }
        }
      )
    }

    return filteredData
  }, [bookings, selectedStatus, selectedPeriod])

  const { currentPage, setCurrentPage, itens, numbers } =
    usePagination<Booking>(getFilteredData, 6)

  const handleGoToUserDetailsPage = (id: string) => {
    navigate(`/usuarios/${id}`)
  }

  const handleGoToBookingDetailsPage = (id: string) => {
    navigate(`/agendamentos/${id}`)
  }

  const handleUpdateStatus = () => {
    if (selectedBooking) {
      updateStatus({
        ...selectedBooking,
        observation,
      })
      setOpenDialog(false)
      setObservation('')
    }
  }

  return (
    <>
      <div className="overflow-hidden relative">
        <div className="flex justify-between items-end mb-5">
          <Title>Agendamentos</Title>
        </div>
        <div>
          <div className="flex items-center gap-5">
            <IoFilterOutline className="w-5 h-5" />
            {/* Filtro por status */}
            <Select
              value={selectedStatus || undefined}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#383838] dark:text-white">
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluido</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Filtro por data de criação */}
            <Select
              value={selectedPeriod || undefined}
              onValueChange={(value) => setSelectedPeriod(value)}
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#383838] dark:text-white">
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ontem">Ontem</SelectItem>
                  <SelectItem value="essa-semana">Essa semana</SelectItem>
                  <SelectItem value="esse-mes">Esse mês</SelectItem>
                  <SelectItem value="esse-ano">Esse ano</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={handleClearFilters}>Limpar Filtros</Button>
          </div>
        </div>
        <div className="mt-5">
          {isLoading ? (
            <div className="w-[1000px]">
              <BookingsSkeleton />
            </div>
          ) : (
            <>
              <Table className="w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead className="w-[100px]">Hora</TableHead>
                    <TableHead>Agendado por</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Feito em</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens?.map((booking: Booking) => (
                    <TableRow key={booking.id}>
                      <TableCell
                        className="cursor-pointer font-medium"
                        onClick={() => handleGoToBookingDetailsPage(booking.id)}
                      >
                        {(booking.data as { data: string }).data}
                      </TableCell>
                      <TableCell className="font-medium">
                        {
                          (
                            booking.data as {
                              starttime: string
                              endtime: string
                            }
                          ).starttime
                        }{' '}
                        - {(booking.data as { endtime: string }).endtime}
                      </TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Avatar>
                          {booking?.user?.profileImage ? (
                            <AvatarImage
                              src={booking?.user?.profileImage}
                              alt="Profile Image"
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              {booking?.user?.fullname
                                ? booking?.user.fullname
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
                        <p
                          className="cursor-pointer"
                          onClick={() =>
                            booking.user?.id &&
                            handleGoToUserDetailsPage(booking.user.id)
                          }
                        >
                          {booking?.user?.fullname}
                        </p>
                      </TableCell>
                      <TableCell>{booking?.user?.phoneNumber}</TableCell>
                      <TableCell>{formateDate(booking?.createdAt)}</TableCell>
                      <TableCell className="">
                        <Select
                          onValueChange={(value) => {
                            setOpenDialog(true)
                            setSelectedBooking({
                              id: booking.id,
                              status: value,
                              userId: booking.user.id!,
                              role: booking.user.role,
                              booking: booking,
                            })
                            // updateStatus({
                            //   id: booking.id,
                            //   status: value,
                            //   userId: booking.user.id!,
                            //   role: booking.user.role,
                            //   booking: booking,
                            // })
                          }}
                        >
                          <SelectTrigger className="w-[140px]  dark:border-[#4b4b4b]">
                            <SelectValue
                              placeholder={
                                booking?.status?.charAt(0).toUpperCase() +
                                booking?.status?.slice(1).toLowerCase()
                              }
                            />
                          </SelectTrigger>
                          {user?.role === 'ADMIN' ||
                          user?.role === 'ATTENDANT' ? (
                            <SelectContent className="dark:bg-[#383838] dark:text-white dark:border-[#383838]">
                              <SelectGroup className="">
                                <SelectItem value="aprovado" className="">
                                  Aprovar
                                </SelectItem>
                                <SelectItem value="cancelado">
                                  Cancelar
                                </SelectItem>
                                <SelectItem value="concluido">
                                  Concluir
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          ) : null}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {numbers.map((num) => (
                    <PaginationItem key={num}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === num}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, numbers.length)
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Observação</DialogTitle>
              <DialogDescription>
                Adicione uma observação para o agendamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observation" className="text-right">
                  Observação
                </Label>
                <Input
                  id="observation"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleUpdateStatus}>
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
