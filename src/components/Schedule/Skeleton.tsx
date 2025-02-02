import { Skeleton } from '../ui/skeleton'

export function ScheduleSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}
