import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '../mocks/server'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
  vi.restoreAllMocks()
})

afterAll(() => server.close())
