import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateWebhookRequest, WebhookListParams } from '../api/types'
import { getWebhook, getWebhooks, updateWebhook } from '../api/webhooks'

export const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  list: (params: WebhookListParams) => [...webhookKeys.lists(), params] as const,
  detail: (id: number) => [...webhookKeys.all, 'detail', id] as const,
}

export function useWebhooks(params: WebhookListParams) {
  return useQuery({
    queryKey: webhookKeys.list(params),
    queryFn: () => getWebhooks(params),
    placeholderData: keepPreviousData,
  })
}

export function useWebhook(id: number) {
  return useQuery({
    queryKey: webhookKeys.detail(id),
    queryFn: () => getWebhook(id),
  })
}

export function useUpdateWebhook(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateWebhookRequest) => updateWebhook(id, body),
    onSuccess: (webhook) => {
      queryClient.setQueryData(webhookKeys.detail(webhook.id), webhook)
      return queryClient.invalidateQueries({ queryKey: webhookKeys.lists() })
    },
  })
}
