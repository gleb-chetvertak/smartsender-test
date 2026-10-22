import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { onSessionEnd } from './api/session'
import { App } from './app/App'
import { clearLocalSession } from './auth/store'
import { worker } from './mocks/browser'
import './index.css'

await worker.start({ onUnhandledFrame: 'bypass' })
onSessionEnd(clearLocalSession)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
