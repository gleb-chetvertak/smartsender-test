interface PaginationProps {
  current: number
  last: number
  onChange: (page: number) => void
}

export function Pagination({ current, last, onChange }: PaginationProps) {
  if (last <= 1) {
    return null
  }
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button button-secondary"
        disabled={current <= 1}
        onClick={() => onChange(Math.min(current - 1, last))}
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {current} of {last}
      </span>
      <button
        type="button"
        className="button button-secondary"
        disabled={current >= last}
        onClick={() => onChange(current + 1)}
      >
        Next
      </button>
    </nav>
  )
}
