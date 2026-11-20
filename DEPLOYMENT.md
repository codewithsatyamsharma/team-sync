# Free deployment guide (MongoDB + Render)

Team Sync is a Vite frontend served by its Node.js API in one web service. The API stores employees, messages, tasks, attendance, departments, documents, and sessions in MongoDB. There is no PostgreSQL dependency. The repository includes [`render.yaml`](./render.yaml) for a Render Blueprint.

## What you need

- A GitHub repository containing this project.
- A free MongoDB Atlas account and free cluster. Create a database user with a strong unique password and grant it access only to the `team_sync` database.
- A free Render account.

Atlas free clusters are intended for small development/demo workloads and have storage and feature limits. Check the current [Atlas free/shared cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) before using this for real company data.

## 1. Create MongoDB Atlas database

1. Create a free cluster in [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Under **Database Access**, create an application database user. Do not use your Atlas account password; store the new password securely.
3. Under **Network Access**, add the network access rule required by your app host. Render free instances do not have fixed outbound IP addresses, so a demo deployment often needs `0.0.0.0/0`. This allows any IP to reach the database endpoint; reduce exposure with a unique long password and a database user limited to this app's database, and never reuse the credential elsewhere.
4. From **Connect → Drivers**, copy the connection URI. Replace the password placeholder with the URL-encoded database-user password and put `/team_sync` before the query string. It should look like `mongodb+srv://<user>:<password>@<cluster-host>/team_sync?retryWrites=true&w=majority`.
5. Keep this URI private. Do not commit it to GitHub or paste it into a public issue.

## 2. Deploy the app to Render for free

1. Push the project to GitHub.
2. In Render, choose **New → Blueprint** and connect the repository. Render reads `render.yaml` and creates the free Node web service.
3. In the Blueprint environment-variable form, enter:
   - `MONGODB_URI`: the private Atlas connection URI.
   - `DEMO_ADMIN_PASSWORD`: a unique, strong password for the seeded admin account.
   - `DEMO_EMPLOYEE_PASSWORD`: a different unique, strong password for the seeded employee account.
4. Apply the Blueprint and wait for the deploy to finish. The build command is `npm install --omit=optional && npm run build`; the service starts with `npm start`.
5. Open the service URL shown by Render, such as `https://team-sync-app.onrender.com`. The app and `/api` endpoints share that HTTPS origin.
6. Verify `https://<service-name>.onrender.com/api/health` returns JSON with `"status":"ok"`, then sign in and try the workflows below.

The first startup seeds demo accounts only when the MongoDB `employees` collection is empty. Seed emails are `admin@teamsync.local` and `aarav@teamsync.local`; their passwords are the values you supplied to Render. Changing these environment variables after seeding does not change existing password hashes. Use the app's password management flow or a deliberate administrative reset to rotate credentials; do not delete the production database to reset a password.

## Free hosting behavior and data

Render Free web services can spin down after a period without traffic and take time to start again on the next request. They do not provide a persistent disk, so local files must not be used for production data. This deployment stores application data in Atlas; redeploying or restarting the web process does not erase the database. Free instances are intended for low-volume demos and can be suspended for unusually high outbound traffic. Review [Render's current free service details](https://render.com/docs/free) before relying on availability.

The API currently keeps a cache of collection data in process memory and synchronizes writes to MongoDB. Run a single service instance; multiple API instances could overwrite stale cache snapshots. For a production multi-instance service, move reads/writes to direct MongoDB operations or add change-aware concurrency control before scaling horizontally.

## Run locally

```sh
npm install
cp .env.example .env
# Edit .env and set MONGODB_URI to your Atlas URI (or a local MongoDB URI).
npm run build
npm start
```

Open `http://localhost:3001`. To run frontend hot reload during development, use two terminals: `npm run api` and `npm run dev`; Vite proxies `/api` to `http://localhost:3001`.

## Optional JSON-to-MongoDB import

If you have a legacy `data/team-sync.json`, back it up first, configure `MONGODB_URI`, and run `npm run migrate:mongodb`. The importer refuses to write into a database whose target collections already contain records. Review the source data and destination before importing. Do not commit the JSON file or real employee data.

## Authentication and feature verification

Use separate browser profiles for the seeded admin and employee accounts. Check:

- `/api/health` responds after deploy.
- Valid login works; invalid passwords fail; inactive users are denied.
- Refresh restores a signed-in session; logout removes it.
- Employee-only registration validates email/password and rejects duplicate email.
- Employees can see active coworkers, exchange direct messages, and see messages after polling/reload.
- Admins can create/update employees, departments, tasks, attendance status, and documents; employees receive `403` on admin-only routes.
- Employees can check in/out, see their tasks and attendance, and update their own task status.
- Profile changes and all CRUD data survive a Render restart/redeploy.

Run `npm run lint` and `npm run build` before pushing changes. For real production use, add automated API integration tests, rate limits, password reset/email verification, audit logging, backups, message pagination, and database-level access controls.

## Project/interview notes

- **Authentication:** passwords are stored as salted `scrypt` hashes. The browser receives only an HTTP-only, same-site session cookie; session mappings are stored in MongoDB.
- **Authorization:** the API enforces role checks. Frontend route visibility is not treated as a security boundary.
- **Chat:** direct messages include sender, receiver, timestamp, and sequence; clients poll for new messages rather than using WebSockets.
- **Data model:** separate MongoDB collections store employees, messages, tasks, attendance, departments, documents, and sessions. The Node service currently loads these into a single-process cache and persists writes to MongoDB.
- **Deployment:** Render hosts the Node service; MongoDB Atlas stores durable data. HTTPS enables secure session cookies.

Do not claim OAuth/SSO, password recovery, group chat, or WebSocket delivery unless you implement those features separately.
