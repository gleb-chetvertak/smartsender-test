interface FieldErrorProps {
  message: string | undefined
}

export function FieldError({ message }: FieldErrorProps) {
  if (message === undefined) {
    return null
  }
  return (
    <p role="alert" className="field-error">
      {message}
    </p>
  )
}
