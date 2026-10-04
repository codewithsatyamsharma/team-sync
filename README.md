Team Sync
A modern full-stack team and employee management platform built to help organizations manage employees, departments, tasks, attendance, leave requests, profiles, and team activities from a centralized workspace.
The project is built with a React + Vite frontend and a Node.js/Express backend, with a feature-based architecture focused on reusable components, API-driven data, responsive UI, and maintainability.
📌 Table of Contents
- Overview
- Features
- Tech Stack
- Project Architecture
- Frontend Structure
- Core Modules
- Dashboard
- Employee Management
- Department Management
- Task Management
- Attendance Management
- Leave Management
- Profile
- Settings
- Theme System
- State Management
- API Architecture
- API Response Structure
- Attendance API
- Task API
- Authentication
- Reusable Components
- Getting Started
- Installation
- Environment Variables
- Running the Project
- Development Guidelines
- Future Improvements
- Contributing
- Author
🚀 Overview
Team Sync is a centralized team management application that provides administrators and employees with a unified interface for managing day-to-day organizational activities.
The application includes modules for:
- Dashboard analytics
- Employee management
- Department management
- Task management
- Attendance tracking
- Leave management
- Employee profiles
- Application settings
- Dark/light theme support
The frontend follows a feature-based architecture, where each feature contains its own API layer, hooks, pages, and reusable UI components.
The application is designed to consume data dynamically from the backend rather than relying on hardcoded data.
✨ Features
📊 Dashboard
The dashboard provides a quick overview of the organization's current activity.
Dashboard includes
- Total tasks
- Completed tasks
- Active projects
- Team members
- Task completion statistics
- Task progress chart
- Recent activities
- Team member presence
- Personalized suggestions
- Dynamic API-driven data
- Responsive dashboard layout
The dashboard consumes data directly from the backend API.
Example dashboard response:
{
  "data": {
    "user": {
      "_id": "...",
      "name": "Devendra",
      "avatar": ""
    },
    "stats": {
      "totalTasks": {
        "value": 39,
        "change": 25
      },
      "completedTasks": {
        "value": 36,
        "change": 40
      },
      "activeProjects": {
        "value": 4
      },
      "teamMembers": {
        "value": 6,
        "newThisMonth": 2
      }
    },
    "chart": [
      {
        "label": "Mon",
        "date": "2026-09-25",
        "completed": 4
      }
    ],
    "activities": [
      {
        "type": "update",
        "text": "Sarah updated",
        "target": "Landing Page Redesign",
        "createdAt": "..."
      }
    ],
    "team": [
      {
        "name": "Sarah Johnson",
        "presence": "In Meeting"
      }
    ],
    "suggestion": {
      "message": "Based on your activity, you should review the Core API tasks today."
    }
  }
}

👥 Employee Management
The employee management module allows administrators to view and manage employees.
Features
- View employees
- Search employees
- Filter employees
- Filter by department
- Filter by role
- Filter by status
- View employee information
- View employee status
- View employee presence
- View employee profile information
Employee information can include:
Employee ID
Full Name
Email
Avatar
Role
Department
Team
Status
Current Activity
Online Status
Joining Date

🏢 Department Management
The department module provides a centralized view of organizational departments.
Features
- View departments
- Search departments
- Filter departments
- View department information
- View employee count
- Organize employees by department
- API-driven department data
Department information is loaded from the backend rather than being hardcoded in the UI.
✅ Task Management
Team Sync includes a Kanban-style task management system.
Tasks can contain:
Title
Description
Status
Priority
Department
Due Date
Progress
Assignees
Project
Created By

Task operations
- Create task
- View tasks
- Update task
- Delete task
- Assign employees
- Track task progress
- Filter tasks
- Group tasks by status
Task API
GET     /api/tasks
POST    /api/tasks
PUT     /api/tasks/:id
DELETE  /api/tasks/:id

Example task
{
  "_id": "f07678c8-618a-450d-a12f-e76a6e5d715e",
  "title": "API Integration: Auth Flow",
  "description": "Integrate authentication flow",
  "status": "in-progress",
  "priority": "high",
  "department": "engineering",
  "dueDate": "2026-10-04T10:00:00.000Z",
  "progress": 65,
  "assigneeIds": [
    "employee-4",
    "employee-1"
  ],
  "assignees": [
    {
      "_id": "employee-4",
      "name": "Alex Morgan",
      "avatar": ""
    }
  ],
  "createdByName": "Team Sync Admin",
  "projectName": "Core API"
}

Create task payload
{
  "title": "Patch servers",
  "description": "Monthly patching",
  "assigneeIds": [
    "employee-1",
    "employee-4"
  ],
  "priority": "high",
  "dueDate": "2026-10-12",
  "department": "operations"
}

Only title is required when creating a task.
🕐 Attendance Management
The attendance module allows employees to manage their daily attendance and view attendance history and statistics.
Employee attendance features
- Clock in
- Clock out
- Start break
- End break
- View today's attendance
- View working hours
- View break duration
- View attendance history
- View attendance calendar
- View monthly attendance summary
Attendance states
not_checked_in
checked_in
on_break
checked_out

Attendance statuses
present
late
half_day
absent
on_leave
holiday

Attendance data includes
Check-in time
Check-out time
Break duration
Total worked minutes
Attendance status
Work mode
Monthly working hours
Average daily hours
Punctuality rate
Leave balance

📅 Attendance History
Employees can view their attendance history by month.
The history endpoint supports pagination.
GET /api/attendance?month=2026-10&page=1&limit=6

Example response:
{
  "success": true,
  "data": {
    "records": [
      {
        "_id": "...",
        "employeeId": "employee-1",
        "date": "2026-10-02",
        "checkIn": "2026-10-02T03:20:00.000Z",
        "checkOut": "2026-10-02T12:10:00.000Z",
        "checkInTime": "08:50",
        "checkOutTime": "17:40",
        "breakMinutes": 45,
        "totalMinutes": 485,
        "totalHours": 8.08,
        "mode": "remote",
        "status": "present"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 6,
      "total": 22,
      "totalPages": 4
    }
  }
}

📈 Attendance Summary
Monthly attendance statistics are available through:
GET /api/attendance/summary?month=2026-05

The summary can include:
Monthly Hours
Target Hours
Target Percentage
Average Daily Hours
Punctuality Rate
Days Present
Days Late
Days Absent
Days On Leave
PTO Balance
PTO Pending
PTO Allowance

Example:
{
  "success": true,
  "data": {
    "month": "2026-05",
    "monthlyHours": 142.5,
    "targetHours": 160,
    "targetPercentage": 89,
    "averageDailyHours": 8.2,
    "punctualityRate": 98.4,
    "daysPresent": 18,
    "daysLate": 1,
    "daysAbsent": 1,
    "daysOnLeave": 0,
    "ptoBalance": 14,
    "ptoPending": 2,
    "ptoAllowance": 20
  }
}

🗓️ Attendance Calendar
The attendance calendar provides a visual representation of employee attendance.
Endpoint:
GET /api/attendance/calendar?month=2026-05

Supported statuses:
present
late
half_day
absent
on_leave
holiday

Example:
{
  "success": true,
  "data": [
    {
      "date": "2026-05-20",
      "status": "present"
    },
    {
      "date": "2026-05-22",
      "status": "late"
    },
    {
      "date": "2026-05-23",
      "status": "absent"
    },
    {
      "date": "2026-05-25",
      "status": "holiday",
      "name": "Memorial Day"
    }
  ]
}

⏱️ Attendance Actions
The application supports the following attendance actions:
Check In
Check Out
Start Break
End Break

The server returns the updated attendance state after each action.
For example:
{
  "success": true,
  "message": "Break started.",
  "data": {
    "state": "on_break",
    "isOnBreak": true,
    "currentBreakStart": "..."
  }
}

The frontend can update its current attendance state directly from the returned data.
🏖️ Leave Management
Employees can submit and manage leave requests.
Features
- View personal leaves
- Submit leave request
- View pending requests
- View approved requests
- View rejected requests
- View upcoming holidays
- View PTO allowance
- View PTO balance
- View remaining PTO
Endpoints
GET  /api/leaves/my
POST /api/leaves

Leave request payload
{
  "type": "paid_time_off",
  "startDate": "2026-10-26",
  "endDate": "2026-10-27",
  "handoverNote": "Please cover the deployment tasks."
}

👤 Profile
The profile section uses the authenticated employee data stored in Redux.
Employee information includes:
ID
Full Name
Email
Avatar URL
Role
Department
Team
Status
Current Activity
Online Status
Date Joined

Example:
{
  "success": true,
  "data": {
    "id": "emp_001",
    "fullName": "Sarah Johnson",
    "email": "sarah.j@company.com",
    "avatarUrl": "https://cdn.example.com/avatars/sarah.jpg",
    "role": "Frontend Developer",
    "department": "Engineering",
    "team": "Design Team",
    "status": "active",
    "currentActivity": "In Meeting",
    "isOnline": true,
    "dateJoined": "2023-03-15T00:00:00Z"
  }
}

The profile UI uses this data dynamically instead of maintaining separate hardcoded employee information.
⚙️ Settings
The settings module provides application-level preferences.
Current settings include
- Employee information
- Theme preference
- Dark mode
- Light mode
- User preferences
The settings page accesses the authenticated employee through Redux.
🌓 Theme System
Team Sync supports both Dark Mode and Light Mode.
Theme state is managed through Redux Toolkit.
import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",

  initialState: {
    mode: localStorage.getItem("theme") || "dark",
  },

  reducers: {
    toggleTheme: (state) => {
      state.mode =
        state.mode === "dark"
          ? "light"
          : "dark";

      localStorage.setItem(
        "theme",
        state.mode
      );
    },
  },
});

The theme is persisted in localStorage, so the selected theme remains available after refreshing the application.
🎨 CSS Theme Variables
The application uses CSS variables for theme-aware UI.
Dark theme
:root {
  --primary: #181422;
  --secondary: #1D1B20;
  --tertiary: #C9A74D;

  --success: #22c55e;
  --warning: #eab308;
  --danger: #ef4444;

  --bg-main: #141218;
  --bg-surface: #0F0D13;
  --bg-card: #1e293b;
  --bg-hover: #2b3548;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;

  --border-color: #2d3748;
}

Light theme
.light {
  --primary: #6063EE;
  --secondary: #475569;
  --tertiary: #c2410c;

  --success: #16a34a;
  --warning: #ca8a04;
  --danger: #dc2626;

  --bg-main: #f8fafc;
  --bg-surface: #ffffff;
  --bg-card: #e2e8f0;
  --bg-hover: #dbe4f0;

  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;

  --border-color: #cbd5e1;
}

Components use these variables instead of hardcoding theme-specific colors.
Example:
<div className="
  bg-[var(--bg-card)]
  text-[var(--text-primary)]
  border
  border-[var(--border-color)]
">
  Content
</div>

🧠 State Management
Redux Toolkit is used for global application state.
The application uses Redux for information such as:
- Authentication
- Current employee
- Theme preference
Example:
import { useSelector } from "react-redux";

const employee = useSelector(
  (state) => state.auth.employee
);

const theme = useSelector(
  (state) => state.theme.mode
);

🔄 Server State
API-driven data is handled separately from global application state.
The project can use TanStack Query for server state management.
TanStack Query is useful for:
- API fetching
- Caching
- Refetching
- Loading states
- Error handling
- Mutations
- Cache invalidation
Example architecture:
Redux
│
├── Authentication
├── Employee session
└── Theme

TanStack Query
│
├── Dashboard
├── Employees
├── Departments
├── Tasks
└── Attendance

🌐 API Architecture
The application uses a centralized Axios instance.
Example:
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

API functions are separated from UI components.
For example:
tasks/
│
├── api/
│   └── taskapi.jsx
│
├── hooks/
│   └── useTask.jsx
│
└── ui/
    ├── components/
    │   ├── TaskCard.jsx
    │   ├── TaskColumn.jsx
    │   └── TaskModal.jsx
    │
    └── pages/
        └── Task.jsx

This keeps the project modular and easier to maintain.
📦 API Response Structure
Most backend responses follow a common envelope.
Success
{
  "success": true,
  "data": {}
}

Action response
{
  "success": true,
  "message": "Checked in successfully.",
  "data": {}
}

Error
{
  "success": false,
  "message": "You have already checked in today."
}

With Axios, the actual payload is generally accessed through:
res.data.data

For example:
export const getTodayAttendance = async () => {
  const res = await axiosInstance.get(
    "/attendance/today"
  );

  return res.data.data;
};

🔐 Authentication
Authenticated API requests use the centralized Axios instance.
export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

withCredentials: true allows authentication credentials/cookies to be included with API requests.
The application also handles unauthorized responses such as:
401 Unauthorized

Protected routes should validate the authenticated employee before allowing access.
🏗️ Project Architecture
The frontend follows a feature-based architecture.
src/
│
├── components/
│
├── config/
│   └── axiosInstance.jsx
│
├── features/
│   │
│   ├── admin module/
│   │   │
│   │   ├── dashboard/
│   │   │
│   │   ├── departments/
│   │   │
│   │   ├── employees/
│   │   │
│   │   └── tasks/
│   │
│   ├── attendance/
│   │
│   ├── profile/
│   │
│   ├── settings/
│   │
│   └── ...
│
├── hooks/
│
├── redux/
│
├── routes/
│
├── App.jsx
│
├── main.jsx
│
└── index.css

🧩 Feature Structure
Each feature is organized into separate layers.
Example:
tasks/
│
├── api/
│   └── taskapi.jsx
│
├── hooks/
│   └── useTask.jsx
│
└── ui/
    │
    ├── components/
    │   ├── TaskCard.jsx
    │   ├── TaskColumn.jsx
    │   └── TaskModal.jsx
    │
    └── pages/
        └── Task.jsx

The responsibility of each layer is:
API
↓
Communicates with backend

Hook / TanStack Query
↓
Manages server state and business logic

Components
↓
Reusable UI

Page
↓
Combines components to create the feature

♻️ Reusable Components
The application is built using reusable components rather than placing all UI logic inside individual pages.
Examples include:
Button
Card
Modal
Avatar
Badge
SearchBar
FilterBar
StatCard
Table
TaskCard
TaskColumn
TaskModal
AttendanceCard
Calendar

Reusable components provide:
- Consistent UI
- Consistent spacing
- Theme support
- Better maintainability
- Easier testing
- Faster feature development
📱 Responsive Design
The UI is designed to work across different screen sizes.
The application uses responsive Tailwind CSS utilities to adapt layouts for:
- Desktop
- Laptop
- Tablet
- Smaller screens
The dashboard and management pages are designed to use the available content area without unnecessarily stretching individual components.
🛠️ Tech Stack
Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Redux
- TanStack Query
- React Router
- Axios
- Lucide React
Backend
- Node.js
- Express.js
- REST API
- MongoDB
- Authentication
Development
- Git
- GitHub
- VS Code
- npm
- Vite
📋 Prerequisites
Before running the project, make sure you have installed:
- Node.js
- npm
- MongoDB
- Git
Check Node.js:
node --version

Check npm:
npm --version

📥 Installation
Clone the repository:
git clone <YOUR_REPOSITORY_URL>

Navigate into the project:
cd <PROJECT_NAME>

Install dependencies:
npm install

🔐 Environment Variables
Create the required environment configuration according to your backend setup.
Example:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not commit secrets to GitHub.
Add environment files to .gitignore:
.env
.env.local
.env.development
.env.production

node_modules/
dist/

The exact environment variables depend on the backend configuration of the project.

▶️ Running the Project
The project uses separate commands for the backend and frontend.
Start Backend
Run:
npm run api

This starts the backend API server.
Start Frontend
Open another terminal and run:
npm run dev

This starts the Vite development server.
Development Workflow
Use two terminals:
Terminal 1
npm run api

Terminal 2
npm run dev

The Vite terminal will display the frontend development URL.
🔌 Main API Routes
Dashboard
GET /api/dashboard

Employees
Employee-related routes are provided through the employee API module.
Departments
Department-related routes are provided through the department API module.
Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Attendance
GET /api/attendance/today

GET /api/attendance
GET /api/attendance/summary
GET /api/attendance/calendar

POST /api/attendance/check-in
POST /api/attendance/check-out

POST /api/attendance/break/start
POST /api/attendance/break/end

Leaves
GET  /api/leaves/my
POST /api/leaves

Admin Attendance
GET /api/admin/attendance
GET /api/admin/attendance/summary

🔄 Application Data Flow
A typical feature follows this architecture:
Backend API
     │
     ▼
API Function
     │
     ▼
TanStack Query / Custom Hook
     │
     ▼
Page Component
     │
     ▼
Reusable Components
     │
     ▼
User Interface

For example, tasks:
GET /api/tasks
      ↓
getTask()
      ↓
useTask() / TanStack Query
      ↓
Task.jsx
      ↓
TaskColumn.jsx
      ↓
TaskCard.jsx

🧪 Error Handling
API requests should handle:
- Loading states
- Empty states
- API errors
- Authentication errors
- Validation errors
- Network errors
Example:
try {
  const response = await getTask();
  setData(response);
} catch (error) {
  setError(error);
}

User-facing components should display appropriate feedback rather than exposing raw API errors.
🔒 Security Considerations
For production deployment:
- Never commit .env files.
- Keep JWT secrets private.
- Validate API input.
- Validate authentication.
- Implement authorization for protected routes.
- Restrict administrator endpoints.
- Validate task ownership/permissions.
- Validate attendance actions on the backend.
- Use HTTPS in production.
- Configure secure authentication cookies.
- Sanitize user-generated content.
📐 Development Guidelines
When adding a new feature:
1. Create a dedicated feature directory
features/
└── feature-name/

2. Separate API logic
api/
└── featureApi.jsx

3. Use hooks or TanStack Query
hooks/
└── useFeature.jsx

4. Create reusable components
ui/
└── components/

5. Keep page components focused
ui/
└── pages/
    └── Feature.jsx

6. Avoid hardcoded API data
Components should consume data from:
API
↓
Hook / TanStack Query
↓
Component

7. Use theme variables
Prefer:
bg-[var(--bg-card)]

instead of:
bg-gray-800

when the component needs to support both themes.
8. Handle loading and error states
Every API-driven page should have:
Loading
Success
Empty
Error

states.
9. Use stable React keys
When rendering lists:
items.map((item) => (
  <Component
    key={item._id}
    item={item}
  />
))

🚧 Current Development Areas
The project is actively being developed around the following areas:
- Dashboard
- Employee management
- Department management
- Task management
- Attendance
- Leave management
- Profile
- Settings
- Theme system
- API integration
- Server-state management
🔮 Future Improvements
Potential improvements include:
- Real-time team presence
- WebSocket integration
- Real-time notifications
- Advanced task filtering
- Drag-and-drop Kanban
- Project management
- Team chat
- Notification center
- Advanced attendance analytics
- Attendance report export
- Role-based access control
- Audit logs
- Email notifications
- Push notifications
- Advanced dashboard analytics
- Performance optimization
- Automated testing
- Production deployment pipeline
🤝 Contributing
Contributions are welcome.
1. Fork the repository
git fork <repository-url>

2. Create a feature branch
git checkout -b feature/your-feature

3. Make your changes
Follow the existing feature-based architecture.
4. Commit your changes
git add .
git commit -m "feat: add your feature"

5. Push the branch
git push origin feature/your-feature

6. Create a Pull Request
Provide a clear description of:
- What was changed
- Why it was changed
- Any API changes
- Any UI changes
- Any additional setup required
📝 Commit Convention
Recommended commit format:
feat: add attendance calendar
fix: resolve task update issue
refactor: improve employee hook
style: improve dashboard spacing
docs: update README
chore: update dependencies

Common prefixes:
feat      New feature
fix       Bug fix
refactor  Code restructuring
style     UI/style changes
docs      Documentation
chore     Maintenance

📂 Recommended Git Structure
Team Sync
│
├── frontend
│   │
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   │
│   ├── src
│   ├── routes
│   ├── controllers
│   ├── models
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json

The exact repository structure may differ depending on how the backend and frontend are organized.
🐛 Troubleshooting
Frontend does not start
Try:
npm install
npm run dev

Backend does not start
Try:
npm install
npm run api

Check:
- Environment variables
- MongoDB connection
- Backend port
- API configuration
API returns 404
Check:
1. Backend server is running.
2. Axios baseURL is correct.
3. The requested route exists.
4. Frontend and backend route names match.
5. HTTP method is correct.
Example:
GET /api/tasks

must match the backend route.
Theme is not changing
Check:
- Redux store contains theme.
- themeSlice is registered in the Redux store.
- .light class is applied to the root element.
- CSS variables are defined correctly.
- localStorage contains the selected theme.
📊 Project Architecture Summary
                         TEAM SYNC
                            │
             ┌──────────────┴──────────────┐
             │                             │
        FRONTEND                       BACKEND
             │                             │
         React/Vite                    Node.js
             │                         Express
             │                         MongoDB
             │                             │
       ┌─────┴─────┐                       │
       │           │                       │
     Redux     TanStack Query              │
       │           │                       │
       │       Server State                │
       │           │                       │
       └─────┬─────┘                       │
             │                             │
        Feature Modules ◄──────────────► REST API
             │
   ┌─────────┼─────────┬─────────┐
   │         │         │         │
Dashboard Employees Departments Tasks
   │         │         │         │
   └─────────┴─────────┴─────────┘
             │
      Attendance / Leave
             │
       Profile / Settings

👨‍💻 Author
Satyam Sharma
B.Tech Computer Science Engineering
Interested in:
- MERN Stack Development
- React
- Node.js
- Express.js
- MongoDB
- Full-Stack Development
- Artificial Intelligence
- Web Application Development
⭐ Team Sync
Team Sync is a full-stack team and employee management platform focused on providing a clean, scalable, and maintainable workspace for modern teams.
The project combines:
React
+
Vite
+
Tailwind CSS
+
Redux Toolkit
+
TanStack Query
+
Axios
+
Node.js
+
Express.js
+
MongoDB

to provide a centralized platform for:
📊 Dashboard
👥 Employees
🏢 Departments
✅ Tasks
🕐 Attendance
🏖️ Leaves
👤 Profiles
⚙️ Settings
🌓 Theme Management
