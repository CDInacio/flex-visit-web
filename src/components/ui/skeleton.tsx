import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted dark:bg-[#4b4b4b]',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
