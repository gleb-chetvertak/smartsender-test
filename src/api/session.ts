import { rotateToken } from './auth'
import { request, type RequestOptions } from './client'
import { isUnauthenticatedError } from './errors'
import { getFingerprint } from './fingerprint'

type SessionEndListener = () => void

const listeners = new Set<SessionEndListener>()
let rotation: Promise<void> | null = null

export async function protectedRequest<T>(path: string, options?: RequestOptions): Promise<T> {
  try {
    return await request<T>(path, options)
  } catch (error) {
    if (!isUnauthenticatedError(error)) {
      throw error
    }
    return retryAfterRotation<T>(path, options)
  }
}

export function onSessionEnd(listener: SessionEndListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

async function retryAfterRotation<T>(path: string, options?: RequestOptions): Promise<T> {
  try {
    await rotateSession()
  } catch (error) {
    endSession()
    throw error
  }
  try {
    return await request<T>(path, options)
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      endSession()
    }
    throw error
  }
}

function rotateSession(): Promise<void> {
  rotation ??= rotateToken({ fingerprint: getFingerprint() }).finally(() => {
    rotation = null
  })
  return rotation
}

function endSession(): void {
  for (const listener of listeners) {
    listener()
  }
}
