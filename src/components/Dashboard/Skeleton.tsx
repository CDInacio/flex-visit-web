import { Skeleton } from '../ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-2 mt-10">
      <div className="flex gap-5 justify-between">
        <Skeleton className="h-28 w-[280px]" />
        <Skeleton className="h-28 w-[280px]" />
        <Skeleton className="h-28 w-[280px]" />
      </div>
      <div className="mt-10">
        <Skeleton className="h-60 w-[500px] " />
      </div>
    </div>
  )
}
