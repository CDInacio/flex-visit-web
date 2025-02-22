import { useEffect } from 'react'

interface TitleProps {
  title: string
}

export const PageTitle = ({ title }: TitleProps) => {
  useEffect(() => {
    document.title = title || 'Flex Visit'
  }, [title])

  return null
}
