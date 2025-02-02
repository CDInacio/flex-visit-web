import { Skeleton } from '../ui/skeleton'

export function BookingSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-5">
      <Skeleton className="w-[50%] h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
    </div>
  )
}

export function BedgeSkeleton() {
  return <Skeleton className="w-12  h-6" />
}
