import type { ValidationPayload } from '../api/types'

interface StringFields<K extends string> {
  values: Record<K, string>
  errors: ValidationPayload
}

export function readStringFields<K extends string>(body: unknown, keys: readonly K[]): StringFields<K> {
  const source = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const values = {} as Record<K, string>
  const errors: ValidationPayload = {}
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim() !== '') {
      values[key] = value
    } else {
      errors[key] = [`The ${key.replaceAll('_', ' ')} field is required.`]
    }
  }
  return { values, errors }
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export function hasErrors(errors: ValidationPayload): boolean {
  return Object.keys(errors).length > 0
}
