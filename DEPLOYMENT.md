# Deployment and launch guide

This guide deploys the Vite frontend and Node API together as one web service. A single origin keeps the HTTP-only session cookie and API requests straightforward. Because the project stores accounts, sessions, and messages in a JSON file, the service needs persistent disk storage.

The repository includes [`render.yaml`](./render.yaml) for a Render Blueprint deployment. In Render, choose **New → Blueprint**, connect this GitHub repository, review the service and persistent disk plan (Render requires a paid service plan for persistent disks), and enter unique values for `DEMO_ADMIN_PASSWORD` and `DEMO_EMPLOYEE_PASSWORD` when prompted. Once the first deploy is healthy, use its `onrender.com` URL as the live link.

## Before deployment

1. Replace the demo credentials. `DEMO_ADMIN_PASSWORD` and `DEMO_EMPLOYEE_PASSWORD` only apply when the data file is first created and the seeded accounts do not already have password hashes.
2. Review the contents of `data/team-sync.json` before publishing. `.gitignore` excludes the runtime data directory; never commit real employee data or secrets.
3. Run the local build and check the auth and chat flows (see the verification section below).
4. Push the source repository to GitHub. Keep `node_modules`, `dist`, runtime data, and local environment files out of Git.

## Render deployment (recommended for this file-backed version)

1. Create a **Web Service** in Render and connect the GitHub repository.
2. Choose the Node runtime.
3. Set **Build Command** to `npm ci && npm run build`.
4. Set **Start Command** to `npm start`.
5. Add a persistent disk mounted at `/var/data`. A persistent disk may require a paid Render plan; if persistent disks are unavailable in your plan or region, use a managed database version of the app instead. Deploying this JSON-backed version on an ephemeral filesystem loses user data on restart/redeploy.
6. Add environment variables:
   - `NODE_ENV=production`
   - `SERVE_STATIC=true`
   - `DATA_FILE=/var/data/team-sync.json`
   - `DEMO_ADMIN_PASSWORD=<long unique password>`
   - `DEMO_EMPLOYEE_PASSWORD=<long unique password>`
7. Deploy. Render supplies `PORT`; the server listens on it and serves both UI and API.
8. Open the generated `https://<service>.onrender.com` URL. The server's production cookie includes `Secure`, so use HTTPS.
9. Verify `https://<service>.onrender.com/api/health` returns `{"status":"ok",...}`.
10. Sign in with the configured admin and employee seed accounts, then send a message between them in separate browsers or private windows. Confirm it appears on the other side.

The initial seed credentials are fixed emails: `admin@teamsync.local` and `aarav@teamsync.local`. The two password environment variables are applied only when the seed is created for the first time. If the data file already exists, changing those values will not rotate passwords. To rotate them in a deployed app, implement a password-change/admin-reset flow or edit the hashed account through a deliberate administrative migration; do not delete a production data file.

## Other hosts

Any Node host can run this app if it supports a persistent writable volume. Use build command `npm ci && npm run build`, start command `npm start`, and the environment variables above. Configure SPA fallback to `index.html` only if the host serves static files separately; with `npm start`, the Node server already provides that fallback. Do not deploy the current JSON data store across multiple replicas.

A static-only host such as GitHub Pages or a basic static Vercel project cannot run the API process and cannot provide working authentication/chat. Those platforms require a separate API deployment and a durable database/session solution. For this project as currently implemented, choose one Node service with persistent storage.

## Local verification checklist

Run `npm run lint` and `npm run build`. Then run `npm run api` and `npm run dev` in separate terminals. Confirm:

- Health endpoint responds successfully.
- Valid admin login succeeds; bad password returns an error; inactive accounts are denied.
- Registration rejects invalid email/short password and duplicate email, then lands in the dashboard.
- Refreshing a signed-in browser restores the session; logout returns to sign-in.
- Admin can list, filter, create, and update employees; employee accounts receive a 403 from admin-only routes.
- Two active users can exchange direct messages; an unauthenticated request receives 401.
- Admins can assign tasks to active employees; employees can update their own task status but cannot read or change another employee's assignments.
- Profile changes persist through reloads; appearance preferences remain saved in the browser.
- Production run (`npm run build && npm start`) serves the app and API from the same port.

## Interview preparation

Be prepared to explain:

- **Authentication:** password hashing uses scrypt with a random salt; the browser stores only an HTTP-only, same-site cookie; protected APIs derive identity from the server-side session mapping.
- **Authorization:** frontend guards improve navigation, while the server enforces role checks on privileged employee routes.
- **Chat:** each message records sender, receiver, timestamp, and monotonically increasing sequence; the client polls for new conversation messages. Explain the trade-off between simple polling and WebSockets.
- **Persistence:** the JSON store avoids an external database for easy local setup, but is single-process and unsuitable for horizontal scale. Describe how normalized `users`, `sessions`, `conversations/messages` tables in PostgreSQL and a database-backed session store would replace it.
- **Deployment:** one Node service serves the SPA and API, while persistent storage keeps data across restarts; secure cookies require HTTPS.
- **Next steps:** add rate limits, password reset/email verification, audit logs, database migrations, message pagination, and automated integration tests.

Avoid claiming OAuth, SSO, password recovery, group chat, or WebSocket delivery: those are not implemented in this repository.
