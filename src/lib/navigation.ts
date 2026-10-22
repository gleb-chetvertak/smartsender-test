import type { Location, To } from 'react-router'

export interface ReturnState {
  from: Location
}

export function getReturnTo(state: unknown, fallback: To): To {
  const from = (state as Partial<ReturnState> | null)?.from
  return from ?? fallback
}
