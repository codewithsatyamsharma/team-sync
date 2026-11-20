# Team Sync

Team Sync is a small employee workspace built with React, Vite, Redux Toolkit, React Query, Tailwind CSS, and a Node.js HTTP API. It provides email/password authentication, role-aware admin and employee views, employee directory management, and private one-to-one coworker chat.

## Features

- Registration and sign-in with server-side scrypt password hashes and an HTTP-only session cookie.
- Session lookup (`/api/auth/me`) and sign-out; protected frontend routes and admin-only employee management endpoints.
- Employee listing, pagination, search, filtering, creation, and status/profile updates for administrators.
- Coworker directory and employee-to-employee direct messages. Messages are stored and refreshed by polling every 2.5 seconds.
- Role-aware dashboard summaries, administrator task assignment, employee task status updates, and self-service profile edits.
- Responsive chat layout, coworker search, message timestamps, server validation, and empty/loading/error states.
- MongoDB persistence for employee accounts, sessions, chat, tasks, attendance, departments, and shared documents.

## Requirements

- Node.js 20.19 or newer (Node 22 LTS recommended).
- npm 10 or newer.

## Run locally

```bash
npm install
cp .env.example .env
```

Create a free MongoDB Atlas cluster, a database user, and an IP access-list entry. Put the Atlas application connection URI in `.env` as `MONGODB_URI`; encode reserved characters in the database user's password for a URI. Never commit `.env`.

Start the API and UI in separate terminals:

```bash
npm run api
```

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:3001`.

On first API launch with an empty MongoDB database, the server seeds demo accounts. If you leave the sample password values, local credentials are:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@teamsync.local` | `password123` |
| Employee | `aarav@teamsync.local` | `password123` |

Set `DEMO_ADMIN_PASSWORD` and `DEMO_EMPLOYEE_PASSWORD` before the first API run to choose your own demo passwords. The inactive Maya sample account cannot sign in. Never use the sample passwords on a public deployment.

For a production-style local run:

```bash
npm run build
NODE_ENV=production SERVE_STATIC=true npm start
```

Then open `http://localhost:3001`. The same Node process serves the frontend build and `/api` on one origin.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3001` |
| `MONGODB_URI` | MongoDB Atlas application connection URI | Required |
| `MONGODB_DB_NAME` | MongoDB database name | `team_sync` |
| `DEMO_ADMIN_PASSWORD` | Initial demo admin password (only used when the initial seed has no hash) | `password123` |
| `DEMO_EMPLOYEE_PASSWORD` | Initial demo employee password (same seed-only behavior) | `password123` |
| `NODE_ENV` | Enables the `Secure` session cookie when set to `production` | unset |
| `SERVE_STATIC` | Serve `dist/` alongside API when `true` | unset |
| `APP_ORIGIN` | Exact allowed origin for credentialed cross-origin API use | unset |

To reset a demo database, stop the app and clear the app's MongoDB collections in a disposable development database. The next start seeds the demo accounts again. This permanently deletes the selected database's users, sessions, messages, tasks, attendance, departments, and documents.

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
| `GET`, `POST`, `PATCH`, `DELETE` | `/attendance`, `/departments`, `/documents` | Signed in/admin | Attendance and team resource CRUD, with role checks |

## Architecture notes

The Vite client uses React Router for pages, Redux Toolkit for auth/theme state, and React Query for employee directory queries. `server/team-sync-api.js` contains the API and serves the Vite build when `SERVE_STATIC=true`. The API uses the official MongoDB Node.js driver and stores data in separate `employees`, `sessions`, `messages`, `tasks`, `attendance`, `departments`, and `documents` collections. Passwords are hashed with Node's built-in scrypt and a per-password random salt. Session IDs are stored in MongoDB and sent in HTTP-only, same-site cookies. Chat is direct employee-to-employee messaging with client polling rather than WebSockets.

## Known production boundaries

This is an interview/demo project, not a hardened HR system. The free Atlas tier is appropriate for development and low-throughput demos and has storage and performance limits. The in-memory cache in the current API is designed for a single app instance; do not scale the service horizontally without moving reads/writes to request-level database queries and adding concurrency controls. The app has no email verification, password reset, rate limiting, audit trail, attachment handling, message deletion, group chat, or WebSocket delivery. Public self-registration creates employee-role accounts; do not treat it as a verified company identity flow.

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a MongoDB Atlas + free Render setup, post-deploy checks, data migration instructions, and interview talking points.

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
  team-sync-api.js     API, auth, chat, MongoDB persistence, production static server
  migrate-json-to-mongodb.js  One-time import of legacy local JSON data
```
