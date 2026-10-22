import { protectedRequest } from './session'
import type { User } from './types'

export function getMe(): Promise<User> {
  return protectedRequest('/v1/me')
}
