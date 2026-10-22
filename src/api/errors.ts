import type { ApiErrorBody, ErrorType, ValidationPayload } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly type: ErrorType
  readonly payload: ValidationPayload | undefined

  constructor(status: number, body: ApiErrorBody['error']) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.type = body.type
    this.payload = body.payload
  }
}

export function isValidationError(
  error: unknown,
): error is ApiError & { payload: ValidationPayload } {
  return error instanceof ApiError && error.status === 422 && error.payload !== undefined
}

export function isNotFoundError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 404
}

export function isUnauthenticatedError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401
}
