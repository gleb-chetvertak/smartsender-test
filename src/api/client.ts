import { ensureCsrfToken, invalidateCsrfToken } from './csrf'
import { ApiError } from './errors'
import type { ApiErrorBody } from './types'
import { apiUrl } from './url'

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT'
  body?: unknown
  headers?: Record<string, string>
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response = await send(path, options)
  if (response.status === 419) {
    invalidateCsrfToken()
    response = await send(path, options)
  }
  if (!response.ok) {
    throw await toError(response)
  }
  return parseBody<T>(response)
}

async function send(path: string, { method = 'GET', body, headers }: RequestOptions): Promise<Response> {
  const csrfToken = await ensureCsrfToken()
  const requestHeaders = new Headers({ 'X-Requested-With': 'XMLHttpRequest', ...headers })
  if (method !== 'GET') {
    requestHeaders.set('X-CSRF-TOKEN', csrfToken)
    requestHeaders.set('Content-Type', 'application/json')
  }
  return fetch(apiUrl(path), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function parseBody<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('Content-Type')?.includes('application/json') ?? false
  return (isJson ? await response.json() : undefined) as T
}

async function toError(response: Response): Promise<Error> {
  const body = await parseBody<ApiErrorBody | undefined>(response)
  if (body === undefined) {
    return new Error(`Request failed with status ${response.status}`)
  }
  return new ApiError(response.status, body.error)
}
