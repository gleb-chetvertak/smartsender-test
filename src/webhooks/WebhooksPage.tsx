import type { UseQueryResult } from '@tanstack/react-query'
import type { WebhookList } from '../api/types'
import { ErrorState } from '../ui/ErrorState'
import { Pagination } from './Pagination'
import { SearchInput } from './SearchInput'
import { WebhookTable } from './WebhookTable'
import { useListParams } from './useListParams'
import { useWebhooks } from './queries'

export function WebhooksPage() {
  const { page, search, setPage, setSearch } = useListParams()
  const list = useWebhooks({ page, search })

  return (
    <section>
      <div className="toolbar">
        <h2>Webhooks</h2>
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <WebhookListContent list={list} onPageChange={setPage} />
    </section>
  )
}

interface WebhookListContentProps {
  list: UseQueryResult<WebhookList>
  onPageChange: (page: number) => void
}

function WebhookListContent({ list, onPageChange }: WebhookListContentProps) {
  if (list.isPending) {
    return <p className="status">Loading...</p>
  }
  if (list.isError) {
    return <ErrorState message={list.error.message} onRetry={() => void list.refetch()} />
  }
  const { data: webhooks, paging } = list.data
  if (webhooks.length === 0) {
    return <p className="status">No webhooks found.</p>
  }
  return (
    <div className={list.isPlaceholderData ? 'list is-stale' : 'list'}>
      <WebhookTable webhooks={webhooks} />
      <Pagination current={paging.pages.current} last={paging.pages.last} onChange={onPageChange} />
    </div>
  )
}
