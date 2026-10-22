export function apiUrl(path: string): URL {
  return new URL(path, window.location.origin)
}
