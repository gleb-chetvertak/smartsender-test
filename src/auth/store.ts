import { issueToken, login, revokeToken } from '../api/auth'
import { getFingerprint } from '../api/fingerprint'
import { getMe } from '../api/me'
import type { User } from '../api/types'
import { queryClient } from '../lib/queryClient'

export interface Credentials {
  email: string
  password: string
}

type Listener = () => void

let user: User | null = null
const listeners = new Set<Listener>()

function setUser(next: User | null): void {
  if (user === next) {
    return
  }
  user = next
  for (const listener of listeners) {
    listener()
  }
}

export function getUser(): User | null {
  return user
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function signIn({ email, password }: Credentials): Promise<void> {
  const fingerprint = getFingerprint()
  const { device_session_token } = await login({ email, password, fingerprint })
  await issueToken({ device_session_token, fingerprint })
  setUser(await getMe())
}

export async function signOut(): Promise<void> {
  await revokeToken({ fingerprint: getFingerprint() })
  clearLocalSession()
}

export function clearLocalSession(): void {
  setUser(null)
  queryClient.clear()
}
