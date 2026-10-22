import { Link, Outlet } from 'react-router'
import { UserMenu } from '../auth/UserMenu'

export function Layout() {
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/webhooks" className="brand">
            SmartSenderTest
          </Link>
          <UserMenu />
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}
