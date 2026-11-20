# Team Sync

Team Sync is a small employee workspace built with React, Vite, Redux Toolkit, React Query, Tailwind CSS, and a Node.js HTTP API. It provides email/password authentication, role-aware admin and employee views, employee directory management, and private one-to-one coworker chat.

## Features

- Registration and sign-in with server-side scrypt password hashes and an HTTP-only session cookie.
- Session lookup (`/api/auth/me`) and sign-out; protected frontend routes and admin-only employee management endpoints.
- Employee listing, pagination, search, filtering, creation, and status/profile updates for administrators.
- Coworker directory and employee-to-employee direct messages. Messages are stored and refreshed by polling every 2.5 seconds.
- Role-aware dashboard summaries, administrator task assignment, employee task status updates, and self-service profile edits.
- Responsive chat layout, coworker search, message timestamps, server validation, and empty/loading/error states.
- JSON-backed persistence so the sample app runs without a database service.

## Requirements

- Node.js 20 or newer (Node 22 LTS recommended).
- npm 10 or newer.

## Run locally

```bash
npm ci
```

Start the API and UI in separate terminals:

```bash
npm run api
```

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:3001`.

On first API launch, the server creates `data/team-sync.json` and seeds demo accounts. The default local credentials are:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@teamsync.local` | `password123` |
| Employee | `aarav@teamsync.local` | `password123` |

Set `DEMO_ADMIN_PASSWORD` and `DEMO_EMPLOYEE_PASSWORD` before the first API run to choose safer demo passwords. The inactive Maya sample account cannot sign in. Do not expose the default credentials on a public deployment.

For a production-style local run:

```bash
npm run build
DEMO_ADMIN_PASSWORD='choose-a-long-password' DEMO_EMPLOYEE_PASSWORD='choose-another-long-password' npm start
```

Then open `http://localhost:3001`. The same Node process serves the frontend build and `/api` on one origin.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3001` |
| `DATA_FILE` | Persistent JSON database path | `./data/team-sync.json` |
| `DEMO_ADMIN_PASSWORD` | Initial demo admin password (only used when the initial seed has no hash) | `password123` |
| `DEMO_EMPLOYEE_PASSWORD` | Initial demo employee password (same seed-only behavior) | `password123` |
| `NODE_ENV` | Enables the `Secure` session cookie when set to `production` | unset |
| `SERVE_STATIC` | Serve `dist/` alongside API when `true` | unset |
| `APP_ORIGIN` | Exact allowed origin for credentialed cross-origin API use | unset |

To reset the local demo, stop the server and remove `data/team-sync.json`; the next start will seed it again. This deletes local accounts and messages.

## API overview

All API routes are rooted at `/api`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Health check |
| `POST` | `/auth/register` | Public | Create employee account |
| `POST` | `/auth/login` | Public | Start session |
| `GET` | `/auth/me` | Signed in | Current employee |
| `POST` | `/auth/logout` | Public | End current session |
| `GET` | `/employee` | Admin | Search/filter/paginate employees |
| `POST` | `/employee/create` | Admin | Create employee |
| `PATCH` | `/employee/update/:id` | Admin | Update employee fields |
| `GET` | `/chat/people` | Signed in | Active coworkers |
| `GET` | `/chat/messages?with=:employeeId&after=:sequence` | Signed in | Conversation messages |
| `POST` | `/chat/messages` | Signed in | Send `{ "receiverId": "…", "text": "…" }` |
| `GET` | `/tasks` | Signed in | Get all tasks for admins or assigned tasks for employees |
| `POST` | `/tasks` | Admin | Assign a task with `{ "title": "…", "assignedTo": "employee-id" }` |
| `PATCH` | `/tasks/:id` | Admin or assignee | Update task status (`todo`, `in_progress`, `done`) |
| `PATCH` | `/profile` | Signed in | Update the current user's name, bio, or avatar URL |

## Architecture notes

The Vite client uses React Router for pages, Redux Toolkit for auth/theme state, and React Query for employee directory queries. `server/team-sync-api.js` contains the API and serves the Vite build when `SERVE_STATIC=true`. Passwords are hashed with Node's built-in scrypt and a per-password random salt. The session ID is an HTTP-only, same-site cookie; the server stores the session mapping in the JSON data file. Chat is direct employee-to-employee messaging, persisted in that same file, with client polling rather than a WebSocket connection.

## Known production boundaries

This is an interview/demo-ready project scaffold, not a hardened HR system. The JSON file store is suitable for a single server process and low traffic only. It has no concurrent multi-instance locking, database migrations, email verification, password reset, rate limiting, audit trail, attachment handling, message deletion, group chat, or WebSocket delivery. For a larger deployment, use PostgreSQL, durable managed sessions, rate limiting, backups, and a WebSocket or managed realtime service. Public self-registration creates employee-role accounts; do not treat it as a verified company identity flow.

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a complete Render deployment guide, persistent storage setup, post-deploy checks, and interview talking points.

## Project structure

```text
src/
  app/                 routes, layouts, access guards, Redux store
  features/auth/       login, registration, authentication state
  features/chats/      employee direct chat UI
  features/dashboard/  workspace views and navigation
  features/admin module/employee directory and forms
  features/employee module/employee pages
server/
  team-sync-api.js     API, auth, chat, data persistence, production static server
```
