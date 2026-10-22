import { useSearchParams } from 'react-router'

interface ListParams {
  page: number
  search: string
  setPage: (page: number) => void
  setSearch: (search: string) => void
}

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

export function useListParams(): ListParams {
  const [searchParams, setSearchParams] = useSearchParams()

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams)
    if (page > 1) {
      next.set('page', String(page))
    } else {
      next.delete('page')
    }
    setSearchParams(next)
  }

  const setSearch = (search: string) => {
    const next = new URLSearchParams(searchParams)
    const trimmed = search.trim()
    next.delete('page')
    if (trimmed !== '') {
      next.set('search', trimmed)
    } else {
      next.delete('search')
    }
    setSearchParams(next)
  }

  return {
    page: parsePage(searchParams.get('page')),
    search: searchParams.get('search') ?? '',
    setPage,
    setSearch,
  }
}
