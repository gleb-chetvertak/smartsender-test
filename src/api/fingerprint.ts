const STORAGE_KEY = 'fingerprint'
const FINGERPRINT_PATTERN = /^[0-9a-f]{32}$/

export function getFingerprint(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null && FINGERPRINT_PATTERN.test(stored)) {
    return stored
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const fingerprint = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  localStorage.setItem(STORAGE_KEY, fingerprint)
  return fingerprint
}
