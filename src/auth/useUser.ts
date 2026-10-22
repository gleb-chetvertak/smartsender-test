import { useSyncExternalStore } from 'react'
import type { User } from '../api/types'
import { getUser, subscribe } from './store'

export function useUser(): User | null {
  return useSyncExternalStore(subscribe, getUser)
}
