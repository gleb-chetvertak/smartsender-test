# SmartSenderTest

Test task: login, webhooks list (search + pagination), edit webhook. API is mocked with MSW, same handlers in browser and in tests.

## Stack

- React 19, TypeScript
- Vite
- react-router
- TanStack Query
- react-hook-form
- MSW
- Vitest, ESLint

## Setup

```bash
npm install
npm run dev
```

http://localhost:5173

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Test credentials

```
demo@example.com
password123
```

## Project structure

```bash
|--public
|  |--mockServiceWorker.js
|
|--src
   |--api          fetch client, csrf, session (401 -> rotate -> retry), endpoints
   |--app          router, layout
   |--auth         login page, user store, RequireAuth
   |--lib          queryClient, form errors, navigation
   |--mocks        msw handlers, in-memory db
   |--test         vitest setup (msw node server)
   |--ui           FieldError, ErrorState
   |--webhooks     list, search, pagination, edit form
```

## Notes

- `src/api` - no react. `client.ts` adds `X-Requested-With` to every request, `X-CSRF-TOKEN` to POST/PUT, on 419 gets a new token from `GET /csrf` and retries once
- `csrf.ts` - token is fetched before the first request and cached, parallel calls wait for the same fetch
- `session.ts` - on 401: `POST /auth/token/rotate`, then retry once. Parallel 401s share one rotate. Rotate failed or 401 again -> logout
- `device_session_token` exists only inside the login flow, not stored. Fingerprint - 32 hex chars, generated once, localStorage
- session token never reaches the client, mock keeps it in memory
- react-query with `retry: false`, retries live only in `src/api`
- current user - small store + `useSyncExternalStore`, logout clears it and the query cache
- `page` and `search` are only in the url. Reload / back / forward work, new search drops page
- after reload the mock session is gone, login redirects back to the same list url
- edit - separate route, `GET /v1/webhooks/{id}`, 404 handled
- react-hook-form without client validation, 422 -> errors under fields
- mock: `db.ts` state + operations, `handlers.ts` http. CSRF is checked first on POST/PUT. Expired session -> 401 but rotate still works. Rotate before issue / after revoke -> 400

## Test

`src/api/session.test.ts` - login, move `Date.now` past 30s, call `/v1/me` and `/v1/webhooks` in parallel. Expect 1 rotate and both requests ok.
