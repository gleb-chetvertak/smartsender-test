interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="status status-error">
      <p>{message}</p>
      <button type="button" className="button button-secondary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
