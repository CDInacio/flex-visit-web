import { twMerge } from 'tailwind-merge'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={twMerge(
        'flex-1 -z-20  absolute  ml-[250px] mt-[80px]   min-h-[calc(100vh-80px)] w-[calc(100vw-250px)]',
        className
      )}
    >
      {children}
    </div>
  )
}
