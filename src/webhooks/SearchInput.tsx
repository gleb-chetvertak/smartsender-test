import { useEffect, useRef, type ChangeEvent } from 'react'

const DEBOUNCE_MS = 300

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const input = inputRef.current
    if (input !== null && input.value.trim() !== value) {
      input.value = value
    }
  }, [value])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS)
  }

  return (
    <input
      ref={inputRef}
      type="search"
      className="search-input"
      defaultValue={value}
      onChange={handleChange}
      placeholder="Search by name"
      aria-label="Search by name"
    />
  )
}
