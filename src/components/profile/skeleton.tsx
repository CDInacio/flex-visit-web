import { Skeleton } from '@/components/ui/skeleton' // Importe o componente de Skeleton

export function ProfileAvatarSkeleton() {
  return (
    <div className="p-10 flex flex-col">
      <div className="text-center overflow-hidden pb-6">
        <div className="flex items-start justify-center">
          <div className="relative group">
            <Skeleton className="h-56 w-56 rounded-full" />
          </div>
          <div className="text-start ml-5 w-full">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-56 mb-2" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileBookingsSkeleton() {
  return (
    <div className="p-10 flex flex-col">
      <div className="w-[500px]">
        <Skeleton className="h-6 w-32 mb-3" />
        <div>
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-6 w-32 mb-3" />
        </div>
      </div>
    </div>
  )
}
