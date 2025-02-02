import { Card, CardContent, CardTitle } from '../ui/card'
import { DashboardIcon } from './DashboardIcon'

export function DashboardItem({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: string
}) {
  return (
    <Card className="w-[280px]">
      <CardContent className="flex items-center justify-between">
        <div className=" text-start">
          <CardTitle className="mb-5">{value}</CardTitle>
          <p className="">{title}</p>
        </div>
        <DashboardIcon icon={icon} />
      </CardContent>
    </Card>
  )
}
