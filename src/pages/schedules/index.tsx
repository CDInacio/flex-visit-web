import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { useGetSchedule } from '@/hooks/use-get-schedule'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Title } from '@/components/title'
import useAuthStore from '@/store/user-auth.store'
import { IoFilterOutline } from 'react-icons/io5'
import { usePagination } from '@/hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { ScheduleSkeleton } from '@/components/Schedule/Skeleton'
import { PageTitle } from '@/utils/pageTitle'

export function Schedules() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: schedules, isLoading } = useGetSchedule()
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleNavigate = () => {
    navigate('/horarios/novo')
  }

  const parseDate = (date: string) => {
    const [day, month, year] = date.split('/')
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10)
    )
  }

  const filteredSchedules = schedules
    ?.filter(
      (schedule: {
        date: {
          split: (arg0: string) => {
            (): any
            new (): any
            map: { (arg0: NumberConstructor): [any, any, any]; new (): any }
          }
        }
      }) => {
        if (!selectedMonth && !selectedYear) return true

        const [, month, year] = schedule.date.split('/').map(Number)

        const monthMatches = selectedMonth ? month === selectedMonth : true
        const yearMatches = selectedYear ? year === selectedYear : true

        return monthMatches && yearMatches
      }
    )
    .sort((a: { date: string }, b: { date: string }) =>
      sortOrder === 'asc'
        ? parseDate(a.date).getTime() - parseDate(b.date).getTime()
        : parseDate(b.date).getTime() - parseDate(a.date).getTime()
    )

  const { currentPage, setCurrentPage, itens, numbers } = usePagination(
    filteredSchedules,
    3
  ) // Mostra 5 itens por página

  return (
    <>
      <PageTitle title="Horários" />
      <Container className="p-10">
        <div className="w-[1000px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Title>Horários</Title>
            {user?.role === 'ADMIN' && (
              <Button onClick={handleNavigate}>Novo</Button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4 mb-6">
            <IoFilterOutline className="w-5 h-5" />
            <Select onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="w-40  ">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#383838] dark:text-white">
                {[...Array(12)].map((_, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {new Date(0, index).toLocaleString('pt-BR', {
                      month: 'long',
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="w-40  ">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#383838] dark:text-white">
                {[2023, 2024, 2025].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
            >
              <SelectTrigger className="w-40  ">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#383838] dark:text-white">
                <SelectItem value="asc">Mais antigo</SelectItem>
                <SelectItem value="desc">Mais recente</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setSelectedMonth(null)
                setSelectedYear(null)
                setSortOrder('desc')
              }}
            >
              Limpar Filtros
            </Button>
          </div>

          {isLoading ? (
            <ScheduleSkeleton />
          ) : (
            <>
              <div className="space-y-4">
                {itens?.map((schedule: any, index: number) => (
                  <Card
                    key={index}
                    className="border rounded-lg p-4 bg-white dark:bg-transparent dark:border-[#4b4b4b] shadow-sm space-y-2"
                  >
                    <h2 className="text-lg font-semibold">
                      Data: {schedule.date}
                    </h2>
                    <ul>
                      {schedule.timeslots.map((slot: any, i: number) => (
                        <li key={i} className="my-1">
                          <Badge
                            className={
                              !slot.available
                                ? 'bg-red-200 text-red-800 hover:bg-red-100 hover:text-red-900'
                                : 'bg-green-200 text-green-800 hover:bg-green-100 hover:text-green-900'
                            }
                          >
                            {slot.starttime} - {slot.endtime}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
                {itens?.length === 0 && (
                  <p className="text-gray-500">Nenhum horário encontrado.</p>
                )}
              </div>

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
      </Container>
    </>
  )
}
