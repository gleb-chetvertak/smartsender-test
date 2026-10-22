import type { UpdateWebhookRequest, User, Webhook, WebhookList } from '../api/types'

export const CSRF_TOKEN = 'mock-csrf-token'
export const SESSION_TTL_MS = 30_000
export const PAGE_SIZE = 10

export const CREDENTIALS = { email: 'demo@example.com', password: 'password123' }

export const USER: User = {
  id: 1,
  email: CREDENTIALS.email,
  first_name: 'Demo',
  last_name: 'User',
  name: 'Demo User',
}

const WEBHOOK_NAMES = [
  'Order created',
  'Order paid',
  'Order shipped',
  'Order cancelled',
  'Payment failed',
  'Payment refunded',
  'Customer registered',
  'Customer updated',
  'Cart abandoned',
  'Subscription started',
  'Subscription renewed',
  'Subscription cancelled',
  'Invoice issued',
  'Invoice overdue',
  'Message delivered',
  'Message opened',
  'Message bounced',
  'Contact subscribed',
  'Contact unsubscribed',
  'Campaign started',
  'Campaign finished',
  'Lead captured',
  'Deal won',
  'Deal lost',
  'Ticket opened',
  'Ticket resolved',
  'Inventory low',
]

const webhooks: Webhook[] = WEBHOOK_NAMES.map((name, index) => ({
  id: index + 1,
  name,
  url: `https://hooks.example.com/${name.toLowerCase().replaceAll(' ', '-')}`,
  active: index % 3 !== 0,
  created_at: new Date(Date.UTC(2026, 0, 1 + index, 9, 0, 0)).toISOString(),
}))

interface DeviceSessionToken {
  value: string
  fingerprint: string
}

interface Session {
  fingerprint: string
  expiresAt: number
}

let deviceSessionToken: DeviceSessionToken | null = null
let session: Session | null = null

export function credentialsMatch(email: string, password: string): boolean {
  return email === CREDENTIALS.email && password === CREDENTIALS.password
}

export function createDeviceSessionToken(fingerprint: string): string {
  const value = crypto.randomUUID()
  deviceSessionToken = { value, fingerprint }
  return value
}

export function startSession(token: string, fingerprint: string): boolean {
  if (
    deviceSessionToken === null ||
    deviceSessionToken.value !== token ||
    deviceSessionToken.fingerprint !== fingerprint
  ) {
    return false
  }
  deviceSessionToken = null
  session = { fingerprint, expiresAt: Date.now() + SESSION_TTL_MS }
  return true
}

export function extendSession(fingerprint: string): boolean {
  if (session === null || session.fingerprint !== fingerprint) {
    return false
  }
  session = { fingerprint, expiresAt: Date.now() + SESSION_TTL_MS }
  return true
}

export function revokeSession(): void {
  session = null
}

export function hasActiveSession(): boolean {
  return session !== null && session.expiresAt > Date.now()
}

export function listWebhooks(page: number, search: string): WebhookList {
  const query = search.toLowerCase()
  const matched =
    query === '' ? webhooks : webhooks.filter((webhook) => webhook.name.toLowerCase().includes(query))
  const start = (page - 1) * PAGE_SIZE
  return {
    data: matched.slice(start, start + PAGE_SIZE),
    paging: {
      pages: { current: page, last: Math.max(1, Math.ceil(matched.length / PAGE_SIZE)) },
      results: { total: matched.length, limitation: PAGE_SIZE },
    },
  }
}

export function findWebhook(id: number): Webhook | undefined {
  return webhooks.find((webhook) => webhook.id === id)
}

export function updateWebhook(id: number, input: UpdateWebhookRequest): Webhook | undefined {
  const index = webhooks.findIndex((webhook) => webhook.id === id)
  const current = webhooks[index]
  if (current === undefined) {
    return undefined
  }
  const updated: Webhook = { ...current, name: input.name, url: input.url }
  webhooks[index] = updated
  return updated
}
