import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { isNotFoundError } from '../api/errors'
import { getReturnTo } from '../lib/navigation'
import { ErrorState } from '../ui/ErrorState'
import { WebhookForm } from './WebhookForm'
import { useUpdateWebhook, useWebhook } from './queries'

export function EditWebhookPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = getReturnTo(location.state, '/webhooks')
  const webhook = useWebhook(id)
  const update = useUpdateWebhook(id)

  if (webhook.isPending) {
    return <p className="status">Loading...</p>
  }
  if (webhook.isError) {
    if (isNotFoundError(webhook.error)) {
      return (
        <p className="status">
          Webhook not found. <Link to={returnTo}>Back to the list</Link>
        </p>
      )
    }
    return <ErrorState message={webhook.error.message} onRetry={() => void webhook.refetch()} />
  }

  return (
    <section className="edit-page">
      <h2 className="page-title">Edit webhook</h2>
      <WebhookForm
        webhook={webhook.data}
        cancelTo={returnTo}
        onSubmit={async (values) => {
          await update.mutateAsync(values)
          void navigate(returnTo)
        }}
      />
    </section>
  )
}
