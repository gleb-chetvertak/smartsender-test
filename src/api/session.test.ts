import { describe, expect, it, vi } from 'vitest'
import { CREDENTIALS, SESSION_TTL_MS, USER } from '../mocks/db'
import { server } from '../mocks/server'
import { issueToken, login } from './auth'
import { getFingerprint } from './fingerprint'
import { getMe } from './me'
import { getWebhooks } from './webhooks'

describe('expired session', () => {
  it('rotates once for two parallel 401s and retries both', async () => {
    const fingerprint = getFingerprint()
    const { device_session_token } = await login({ ...CREDENTIALS, fingerprint })
    await issueToken({ device_session_token, fingerprint })

    const requestedPaths: string[] = []
    server.events.on('request:start', ({ request }) => {
      requestedPaths.push(new URL(request.url).pathname)
    })

    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + SESSION_TTL_MS + 1_000)

    const [me, webhooks] = await Promise.all([getMe(), getWebhooks({ page: 1, search: '' })])

    expect(me).toEqual(USER)
    expect(webhooks.data).toHaveLength(10)
    expect(requestedPaths.filter((path) => path === '/auth/token/rotate')).toHaveLength(1)
    expect(requestedPaths.filter((path) => path === '/v1/me')).toHaveLength(2)
    expect(requestedPaths.filter((path) => path === '/v1/webhooks')).toHaveLength(2)
  })
})
