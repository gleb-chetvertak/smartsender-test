import { Navigate, Outlet, useLocation } from 'react-router'
import type { ReturnState } from '../lib/navigation'
import { useUser } from './useUser'

export function RequireAuth() {
  const user = useUser()
  const location = useLocation()

  if (user === null) {
    const state: ReturnState = { from: location }
    return <Navigate to="/login" replace state={state} />
  }
  return <Outlet />
}
