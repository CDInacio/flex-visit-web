import { useEffect, useMemo } from 'react'
import { useGetForms } from '@/hooks/use-get-forms.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { formateDate } from '@/utils/formate-date'
import { useUpdateFormStatus } from '../../hooks/use-update-formstatus'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { FormResponse } from '../../types/form.typep'
import useAuthStore from '@/store/user-auth.store'
import { useNavigate } from 'react-router-dom'
import { BookingSkeleton as Skeleton } from '../Booking/Skeleton'
import { toast } from '../ui/use-toast'

export function All() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: forms, isError, error, isLoading } = useGetForms()
  const { mutate: updateStatus, isPending: isLoadingUpdateFormStatus } =
    useUpdateFormStatus()

  const orderedForms = useMemo(() => {
    // Ordenação das formas de forma mais eficiente
    return (
      forms?.sort(
        (
          a: { createdAt: string | number | Date },
          b: { createdAt: string | number | Date }
        ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || []
    )
  }, [forms])

  const { currentPage, setCurrentPage, itens, numbers } =
    usePagination<FormResponse>(orderedForms, 5)

  useEffect(() => {
    if (isLoadingUpdateFormStatus) {
      toast({
        variant: 'default',
        title: 'Atualizando o status do formulário',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoadingUpdateFormStatus])

  if (isError && error) {
    return (
      <p className="text-gray-500 w-[1000px] ">{(error as Error).message}</p>
    )
  }

  const handleStatusChange = (form: FormResponse) => {
    if (user?.role === 'ADMIN') {
      updateStatus({
        id: form.id,
        isActive: !form.isActive,
      })
    }
  }

  return (
    <div className="w-[1000px]">
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens?.map((form: FormResponse) => (
                <TableRow key={form.id}>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/formularios/${form.id}`)}
                  >
                    {form.form_name}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/usuarios/${form.user.id}`)}
                  >
                    {form.user.fullname}
                  </TableCell>
                  <TableCell>
                    {formateDate(form.createdAt, 'dd/mm/yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="form-status-switch"
                        checked={form.isActive}
                        onCheckedChange={() => handleStatusChange(form)}
                      />
                      <Label htmlFor="form-status-switch">
                        {form.isActive ? 'Ativado' : 'Desativado'}
                      </Label>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
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
        </>
      )}
    </div>
  )
}
