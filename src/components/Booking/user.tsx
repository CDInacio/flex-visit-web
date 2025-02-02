import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Title } from '../title'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

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

import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import { useDeleteBooking } from '@/hooks/use-delete-booking'
import { StatusBadge } from '../ui/status-bedge'
import { BookingsSkeleton } from '../Bookings/Skeleton'

export function User() {
  const { mutate: deleteBooking } = useDeleteBooking()
  const navigate = useNavigate()
  const { data: bookings, isLoading } = useGetUserBookings()
  // Aplicando a paginação
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<
    Record<string, unknown>
  >(
    bookings,
    5 // Mostrando 5 itens por página
  )

  return (
    <div className="w-[1000px] ">
      <div className="flex items-center justify-between mb-6">
        <Title>Meus agendamentos</Title>
        <Button>
          <Link to="/agendamentos/novo">Novo agendamento</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="w-[1000px]">
          <BookingsSkeleton />
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div>
          <Table className="w-full mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens?.map((booking: Record<string, unknown>, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {(booking.data as { data: string }).data}
                  </TableCell>
                  <TableCell className="font-medium">
                    {
                      (booking.data as { starttime: string; endtime: string })
                        .starttime
                    }
                    -
                    {
                      (booking.data as { starttime: string; endtime: string })
                        .endtime
                    }
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/agendamentos/${booking.id}`)}
                  >
                    {(booking.form as { form_name: string }).form_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={booking.status as string} />
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <IoPencilOutline
                      onClick={() =>
                        navigate(`/agendamentos/${booking.id}/editar`)
                      }
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                    />
                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <IoTrashOutline className="cursor-pointer text-gray-500 hover:text-gray-700" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza que deseja excluir?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Deseja realmente
                            excluir este agendamento permanentemente?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBooking(booking.id as string)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    setCurrentPage((prev) => Math.min(prev + 1, numbers.length))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <div className="w-[1000px]">
          <p>Você ainda não possui agendamentos</p>
        </div>
      )}
    </div>
  )
}
