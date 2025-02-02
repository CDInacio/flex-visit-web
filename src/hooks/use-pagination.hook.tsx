import { useState } from 'react'

export function usePagination<T>(data: T[] | undefined, numItens: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const itensPerPage = numItens
  const lastIndex = currentPage * itensPerPage
  const firstIndex = lastIndex - itensPerPage
  const itens = data?.slice(firstIndex, lastIndex)
  const nPage = Math.ceil((data?.length || 0) / itensPerPage)
  const numbers = data
    ? [...Array(Math.ceil(nPage)).keys()].map((n) => n + 1)
    : []

  return {
    currentPage,
    setCurrentPage,
    itens,
    numbers,
  }
}
