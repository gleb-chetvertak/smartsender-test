import { http, HttpResponse } from 'msw'
import type { ApiErrorBody, ErrorType, ValidationPayload } from '../api/types'
import {
  CSRF_TOKEN,
  USER,
  createDeviceSessionToken,
  credentialsMatch,
  extendSession,
  findWebhook,
  hasActiveSession,
  listWebhooks,
  revokeSession,
  startSession,
  updateWebhook,
} from './db'
import { hasErrors, isValidHttpUrl, readStringFields } from './validation'

function apiError(status: number, type: ErrorType, message: string, payload?: ValidationPayload) {
  const body: ApiErrorBody = { error: payload === undefined ? { type, message } : { type, message, payload } }
  return HttpResponse.json(body, { status })
}

const csrfMismatch = () => apiError(419, 'TokenMismatchException', 'CSRF token mismatch.')
const unauthenticated = () => apiError(401, 'AuthenticationException', 'Unauthenticated.')
const notFound = () => apiError(404, 'NotFoundException', 'Resource not found.')
const badRequest = (message: string) => apiError(400, 'BadRequestException', message)
const validationFailed = (payload: ValidationPayload) =>
  apiError(422, 'ValidationException', 'The given data was invalid.', payload)

function hasValidCsrf(request: Request): boolean {
  return request.headers.get('X-CSRF-TOKEN') === CSRF_TOKEN
}

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

export const handlers = [
  http.get('/csrf', () => new HttpResponse(null, { status: 204, headers: { 'X-CSRF-TOKEN': CSRF_TOKEN } })),

  http.post('/auth/login', async ({ request }) => {
    if (!hasValidCsrf(request)) return csrfMismatch()
    if (!request.headers.get('X-Captcha-Token')) {
      return validationFailed({ captcha_token: ['The captcha token is required.'] })
    }
    const { values, errors } = readStringFields(await request.json(), ['email', 'password', 'fingerprint'])
    if (hasErrors(errors)) return validationFailed(errors)
    if (!credentialsMatch(values.email, values.password)) {
      return validationFailed({ password: ['These credentials do not match our records.'] })
    }
    return HttpResponse.json({ device_session_token: createDeviceSessionToken(values.fingerprint) })
  }),

  http.post('/auth/token/issue', async ({ request }) => {
    if (!hasValidCsrf(request)) return csrfMismatch()
    const { values, errors } = readStringFields(await request.json(), ['device_session_token', 'fingerprint'])
    if (hasErrors(errors)) return validationFailed(errors)
    if (!startSession(values.device_session_token, values.fingerprint)) {
      return validationFailed({ device_session_token: ['The device session token is invalid.'] })
    }
    return new HttpResponse(null, { status: 200 })
  }),

  http.post('/auth/token/rotate', async ({ request }) => {
    if (!hasValidCsrf(request)) return csrfMismatch()
    const { values, errors } = readStringFields(await request.json(), ['fingerprint'])
    if (hasErrors(errors) || !extendSession(values.fingerprint)) {
      return badRequest('The session cannot be rotated.')
    }
    return new HttpResponse(null, { status: 200 })
  }),

  http.post('/auth/token/revoke', ({ request }) => {
    if (!hasValidCsrf(request)) return csrfMismatch()
    revokeSession()
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/v1/me', () => {
    if (!hasActiveSession()) return unauthenticated()
    return HttpResponse.json(USER)
  }),

  http.get('/v1/webhooks', ({ request }) => {
    if (!hasActiveSession()) return unauthenticated()
    const { searchParams } = new URL(request.url)
    return HttpResponse.json(listWebhooks(parsePage(searchParams.get('page')), searchParams.get('search') ?? ''))
  }),

  http.get('/v1/webhooks/:id', ({ params }) => {
    if (!hasActiveSession()) return unauthenticated()
    const webhook = findWebhook(Number(params.id))
    return webhook === undefined ? notFound() : HttpResponse.json(webhook)
  }),

  http.put('/v1/webhooks/:id', async ({ request, params }) => {
    if (!hasValidCsrf(request)) return csrfMismatch()
    if (!hasActiveSession()) return unauthenticated()
    if (findWebhook(Number(params.id)) === undefined) return notFound()
    const { values, errors } = readStringFields(await request.json(), ['name', 'url'])
    if (errors.url === undefined && !isValidHttpUrl(values.url)) {
      errors.url = ['The url must be a valid URL.']
    }
    if (hasErrors(errors)) return validationFailed(errors)
    const webhook = updateWebhook(Number(params.id), values)
    return webhook === undefined ? notFound() : HttpResponse.json(webhook)
  }),
]
