import { Link, useLocation } from 'react-router'
import type { Webhook } from '../api/types'
import type { ReturnState } from '../lib/navigation'

interface WebhookTableProps {
  webhooks: Webhook[]
}

export function WebhookTable({ webhooks }: WebhookTableProps) {
  const location = useLocation()
  const state: ReturnState = { from: location }

  return (
    <div className="table-card">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
            <th scope="col">Active</th>
            <th scope="col" className="table-actions">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((webhook) => (
            <tr key={webhook.id}>
              <td>{webhook.name}</td>
              <td className="table-url">{webhook.url}</td>
              <td>
                <span className={webhook.active ? 'badge badge-active' : 'badge'}>
                  {webhook.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="table-actions">
                <Link to={`/webhooks/${webhook.id}/edit`} state={state} className="table-link">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
