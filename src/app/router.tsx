import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '../auth/LoginPage'
import { RequireAuth } from '../auth/RequireAuth'
import { EditWebhookPage } from '../webhooks/EditWebhookPage'
import { WebhooksPage } from '../webhooks/WebhooksPage'
import { Layout } from './Layout'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/webhooks', element: <WebhooksPage /> },
          { path: '/webhooks/:id/edit', element: <EditWebhookPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/webhooks" replace /> },
])
