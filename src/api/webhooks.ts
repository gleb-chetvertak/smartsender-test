import { protectedRequest } from './session'
import type { UpdateWebhookRequest, Webhook, WebhookList, WebhookListParams } from './types'

export const PAGE_SIZE = 10

export function getWebhooks({ page, search }: WebhookListParams): Promise<WebhookList> {
  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
  if (search !== '') {
    params.set('search', search)
  }
  return protectedRequest(`/v1/webhooks?${params}`)
}

export function getWebhook(id: number): Promise<Webhook> {
  return protectedRequest(`/v1/webhooks/${id}`)
}

export function updateWebhook(id: number, body: UpdateWebhookRequest): Promise<Webhook> {
  return protectedRequest(`/v1/webhooks/${id}`, { method: 'PUT', body })
}
