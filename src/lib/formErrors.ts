import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { isValidationError } from '../api/errors'

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): void {
  if (!isValidationError(error)) {
    setError('root', { message: error instanceof Error ? error.message : 'Something went wrong.' })
    return
  }
  const rootMessages: string[] = []
  for (const [field, messages] of Object.entries(error.payload)) {
    const knownField = fields.find((name) => name === field)
    if (knownField === undefined) {
      rootMessages.push(...messages)
    } else {
      setError(knownField, { message: messages.join(' ') })
    }
  }
  if (rootMessages.length > 0) {
    setError('root', { message: rootMessages.join(' ') })
  }
}
