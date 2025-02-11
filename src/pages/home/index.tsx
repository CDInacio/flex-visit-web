import { Container } from '@/components/container'
import { useGetDataOverview } from '../../hooks/use-get-dataOverview'
import { Card } from '../../components/ui/card'
import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { CardContent } from '@mui/material'
import { DashboardItem } from '../../components/home/DashboardItem'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton } from '@/components/Dashboard/Skeleton'

export function Home() {
  const navigate = useNavigate()
  const { role } = JSON.parse(localStorage.getItem('user') || '{}')
  const { data, isLoading } = useGetDataOverview()
  const [bookinksByStatus, setBookingsByStatus] = useState([])

  if (role === 'USER') {
    navigate('/perfil')
  }
  useEffect(() => {
    if (!data) return
    const formattedData = data?.totalBookingsByStatus.map(
      (item: { status: string; _count: { status: number } }, index: number) => {
        // Definindo as cores para cada status
        let color
        switch (item.status) {
          case 'pendente':
            color = '#fbbf24'
            break
          case 'aprovado':
            color = '#4ade80'
            break
          case 'cancelado':
            color = '#fb7185' // Vermelho
            break
          case 'concluido':
            color = '#38bdf8' // Azul
            break
          default:
            color = 'gray' // Cinza como fallback
        }

        return {
          id: index,
          value: item._count.status,
          label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          color: color,
        }
      }
    )
    setBookingsByStatus(formattedData)
  }, [data])

  return (
    <Container className="p-10  flex flex-col ">
      {isLoading ? (
        <div className="w-[1000px] mx-auto">
          <DashboardSkeleton />
        </div>
      ) : (
        <div className="flex flex-col mx-auto  w-[1000px]">
          <div className="flex gap-5 justify-between">
            <DashboardItem
              title="Total de agendamentos"
              icon="bookings"
              value={data?.bookings}
            />
            <DashboardItem
              title="Agendamentos recentes"
              icon="recent bookings"
              value={data?.recentBookingsCount}
            />
            <DashboardItem
              title="Usuarios cadastrados"
              icon="user"
              value={data?.totalUsers}
            />
          </div>
          <Card className="mt-10 dark:text-white w-fit">
            <CardContent>
              <PieChart
                series={[
                  {
                    data: bookinksByStatus,
                  },
                ]}
                width={400}
                height={200}
              />
              <p className="mt-5">Agendamentos por Status</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  )
}
