import { signOut } from './store'
import { useUser } from './useUser'

export function UserMenu() {
  const user = useUser()

  if (user === null) {
    return null
  }
  return (
    <div className="user-menu">
      <span className="user-name">{user.name}</span>
      <button
        type="button"
        className="button button-secondary button-sm"
        onClick={() => void signOut()}
      >
        Log out
      </button>
    </div>
  )
}
