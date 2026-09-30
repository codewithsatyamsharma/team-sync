Team Sync

A team management web app where employees can sign up, log in, and (as admins) manage employee records. Built with React, Redux Toolkit, and a lightweight Node.js API.

Features
Employee registration and login with cookie-based sessions
Persistent login via /auth/me
Role-based access (admin / employee)
Admin employee management: list, search, filter, create, update
Form validation with React Hook Form
Dark, responsive UI built with Tailwind CSS
Tech Stack

Frontend: React, Vite, Redux Toolkit, React Router, React Hook Form, Axios, Tailwind CSS, Lucide React Backend: Node.js (built-in http module, in-memory data store)

Project Structure
reBuild_team-sync/
├── server.js                # Mock API (Node.js)
├── vite.config.js           # Vite config + /api proxy
├── src/
│   ├── config/
│   │   └── axiosInstance.js # Axios instance (baseURL: /api)
│   ├── features/
│   │   └── auth/
│   │       ├── hooks/       # useAuth hook
│   │       ├── pages/       # Login, Register
│   │       └── state/       # authActions, authSlice
│   ├── App.jsx
│   └── main.jsx
└── package.json
Getting Started
Prerequisites
Node.js 18 or newer
npm
Installation
bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
Run the app

Start the backend and the frontend in two separate terminals.

bash
# Terminal 1: API on http://localhost:3000
node server.js

# Terminal 2: frontend on http://localhost:5173
npm run dev

The Vite dev server proxies every /api request to http://localhost:3000.

Demo accounts
Role	Email	Password
Admin	admin@teamsync.local	password123
Employee	aarav@teamsync.local	password123

Data is stored in memory, so it resets every time the server restarts.

API Endpoints
Method	Endpoint	Access	Description
GET	/api/health	Public	Health check
POST	/api/auth/register	Public	Create an account
POST	/api/auth/login	Public	Log in
GET	/api/auth/me	User	Current logged-in user
POST	/api/auth/logout	User	Log out
GET	/api/employee	Admin	List employees (filters)
POST	/api/employee/create	Admin	Create an employee
PATCH	/api/employee/update/:id	Admin	Update an employee
Scripts
Command	Description
npm run dev	Start the Vite dev server
npm run build	Build for production
npm run preview	Preview the production build
Contributing
Create a branch: git checkout -b feature/your-feature
Commit your changes: git commit -m "feat: add your feature"
Push the branch: git push -u origin feature/your-feature
Open a Pull Request
License

MIT
