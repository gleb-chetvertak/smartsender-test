import { apiUrl } from './url'

const CSRF_HEADER = 'X-CSRF-TOKEN'

let token: string | null = null
let pending: Promise<string> | null = null

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(apiUrl('/csrf'), {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })
  const value = response.headers.get(CSRF_HEADER)
  if (!response.ok || value === null) {
    throw new Error('Failed to get CSRF token')
  }
  token = value
  return value
}

export function ensureCsrfToken(): Promise<string> {
  if (token !== null) {
    return Promise.resolve(token)
  }
  pending ??= fetchCsrfToken().finally(() => {
    pending = null
  })
  return pending
}

export function invalidateCsrfToken(): void {
  token = null
}
