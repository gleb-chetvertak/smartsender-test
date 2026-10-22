import { request } from './client'
import type { FingerprintRequest, IssueTokenRequest, LoginRequest, LoginResponse } from './types'

const CAPTCHA_TOKEN = 'captcha-not-required'

export function login(body: LoginRequest): Promise<LoginResponse> {
  return request('/auth/login', {
    method: 'POST',
    body,
    headers: { 'X-Captcha-Token': CAPTCHA_TOKEN },
  })
}

export function issueToken(body: IssueTokenRequest): Promise<void> {
  return request('/auth/token/issue', { method: 'POST', body })
}

export function rotateToken(body: FingerprintRequest): Promise<void> {
  return request('/auth/token/rotate', { method: 'POST', body })
}

export function revokeToken(body: FingerprintRequest): Promise<void> {
  return request('/auth/token/revoke', { method: 'POST', body })
}
