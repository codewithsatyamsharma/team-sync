import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 3000);
const sessions = new Map();
const now = () => new Date().toISOString();

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const daysAgo = (n, hour = 10) => {
  const d = new Date(Date.now() - n * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const daysFromNow = (n, hour = 10) => daysAgo(-n, hour);
const hoursAgo = (n) => new Date(Date.now() - n * HOUR).toISOString();
const dateOnly = (iso) => iso.slice(0, 10);

const PRESENCE_OPTIONS = ["Available", "In Meeting", "Coding", "Design Review", "Out of Office"];
const TASK_STATUSES = ["todo", "in-progress", "done"];
const PRIORITIES = ["high", "medium", "low"];
const DEPARTMENTS = ["engineering", "design", "marketing", "research", "operations"];

/* -------------------------------------------------------------------------- */
/*  DATA (in memory, resets when the server restarts)                         */
/* -------------------------------------------------------------------------- */

const employees = [
  {
    _id: "admin-1",
    name: "Team Sync Admin",
    email: "admin@teamsync.local",
    password: "password123",
    role: "admin",
    department: "management",
    status: "active",
    presence: "Available",
    bio: "Workspace administrator",
    avatar: "",
    joiningDate: "2025-01-01",
    createdAt: "2025-01-01T09:00:00.000Z",
  },
  {
    _id: "employee-1",
    name: "Aarav Mehta",
    email: "aarav@teamsync.local",
    password: "password123",
    role: "employee",
    department: "developer",
    status: "active",
    presence: "Coding",
    bio: "Frontend developer",
    avatar: "",
    joiningDate: "2025-02-10",
    createdAt: "2025-02-10T09:00:00.000Z",
  },
  {
    _id: "employee-2",
    name: "Maya Singh",
    email: "maya@teamsync.local",
    password: "password123",
    role: "employee",
    department: "administrative",
    status: "inactive",
    presence: "Out of Office",
    bio: "Operations coordinator",
    avatar: "",
    joiningDate: "2025-03-12",
    createdAt: "2025-03-12T09:00:00.000Z",
  },
  {
    _id: "employee-3",
    name: "Sarah Johnson",
    email: "sarah@teamsync.local",
    password: "password123",
    role: "employee",
    department: "design",
    status: "active",
    presence: "In Meeting",
    bio: "Product designer",
    avatar: "",
    joiningDate: dateOnly(daysAgo(5)),
    createdAt: daysAgo(5),
  },
  {
    _id: "employee-4",
    name: "Alex Morgan",
    email: "alex@teamsync.local",
    password: "password123",
    role: "employee",
    department: "developer",
    status: "active",
    presence: "Coding",
    bio: "Backend developer",
    avatar: "",
    joiningDate: dateOnly(daysAgo(40)),
    createdAt: daysAgo(40),
  },
  {
    _id: "employee-5",
    name: "Elena Rossi",
    email: "elena@teamsync.local",
    password: "password123",
    role: "employee",
    department: "design",
    status: "active",
    presence: "Design Review",
    bio: "UI designer",
    avatar: "",
    joiningDate: dateOnly(daysAgo(20)),
    createdAt: daysAgo(20),
  },
  {
    _id: "employee-6",
    name: "Marcus Lee",
    email: "marcus@teamsync.local",
    password: "password123",
    role: "employee",
    department: "developer",
    status: "active",
    presence: "Out of Office",
    bio: "QA engineer",
    avatar: "",
    joiningDate: dateOnly(daysAgo(60)),
    createdAt: daysAgo(60),
  },
];

const projects = [
  { _id: "project-1", name: "Landing Page Redesign", status: "active", createdAt: daysAgo(30) },
  { _id: "project-2", name: "API Integration", status: "active", createdAt: daysAgo(25) },
  { _id: "project-3", name: "Core API", status: "active", createdAt: daysAgo(20) },
  { _id: "project-4", name: "Mobile App", status: "active", createdAt: daysAgo(15) },
  { _id: "project-5", name: "Brand Guidelines", status: "completed", createdAt: daysAgo(90) },
];

/* ------------------------------ Task model --------------------------------
 * {
 *   _id, title, description,
 *   status:     "todo" | "in-progress" | "done"
 *   priority:   "high" | "medium" | "low"
 *   department: one of DEPARTMENTS
 *   dueDate:    ISO string | null
 *   progress:   0-100
 *   projectId:  project _id | null
 *   assigneeIds: employee _id[]
 *   createdBy:  employee _id | null
 *   createdAt, completedAt
 * }
 * ------------------------------------------------------------------------- */

const makeTask = ({
  title,
  description = "",
  projectId = null,
  assigneeIds = [],
  status = "todo",
  priority = "medium",
  dueDate = null,
  department = "engineering",
  progress = 0,
  createdBy = null,
  createdAt,
  completedAt = null,
}) => ({
  _id: randomUUID(),
  title,
  description,
  status,
  priority,
  dueDate,
  department,
  progress: status === "done" ? 100 : progress,
  projectId,
  assigneeIds,
  createdBy,
  createdAt,
  completedAt,
});

const tasks = [];
const seedAssignees = ["employee-1", "employee-3", "employee-4", "employee-5", "employee-6"];
const seedProjects = ["project-1", "project-2", "project-3", "project-4"];
const seedDepartments = ["engineering", "design", "marketing", "research", "operations"];

// Completed tasks spread over the last 7 days (index 0 = 6 days ago ... index 6 = today)
const completedPerDay = [4, 7, 6, 9, 5, 3, 2];
let counter = 1;
completedPerDay.forEach((count, index) => {
  const completedDaysAgo = 6 - index;
  for (let i = 0; i < count; i += 1) {
    tasks.push(
      makeTask({
        title: `Completed task #${counter}`,
        description: "Finished and signed off.",
        projectId: seedProjects[counter % seedProjects.length],
        assigneeIds: [seedAssignees[counter % seedAssignees.length]],
        department: seedDepartments[counter % seedDepartments.length],
        status: "done",
        createdBy: "admin-1",
        createdAt: daysAgo(completedDaysAgo + 3, 9),
        completedAt: daysAgo(completedDaysAgo, 15),
      }),
    );
    counter += 1;
  }
});

// Open tasks created this week
[
  {
    title: "User Interview Synthesis",
    description: "Analyze findings from the Q3 user experience research sessions and draft the summary report.",
    projectId: "project-1", assigneeIds: ["employee-5"], status: "todo",
    priority: "medium", department: "research", due: 5, created: 0,
  },
  {
    title: "Mobile Responsive Grid",
    description: "Refine the 8px linear scale implementation for small screen devices.",
    projectId: "project-4", assigneeIds: ["employee-3"], status: "todo",
    priority: "high", department: "design", due: 1, created: 1,
  },
  {
    title: "Write API docs",
    description: "Document every endpoint with request and response examples.",
    projectId: "project-2", assigneeIds: ["employee-1"], status: "todo",
    priority: "low", department: "engineering", due: 7, created: 0,
  },
  {
    title: "API Integration: Auth Flow",
    description: "Implementing OAuth2 providers and session management for the new platform.",
    projectId: "project-3", assigneeIds: ["employee-4", "employee-1"], status: "in-progress",
    priority: "high", department: "engineering", due: 3, progress: 65, created: 2,
  },
  {
    title: "Design hero section",
    description: "Create the hero layout, illustration and call-to-action for the landing page.",
    projectId: "project-1", assigneeIds: ["employee-3"], status: "in-progress",
    priority: "medium", department: "design", due: 2, progress: 40, created: 1,
  },
  {
    title: "Create onboarding screens",
    description: "Design the first-run flow for the mobile app.",
    projectId: "project-4", assigneeIds: ["employee-5"], status: "in-progress",
    priority: "medium", department: "design", due: 4, progress: 25, created: 3,
  },
  {
    title: "Fix login redirect bug",
    description: "Users are sent to the wrong page after signing in.",
    projectId: "project-3", assigneeIds: ["employee-6"], status: "todo",
    priority: "high", department: "engineering", due: 0, created: 1,
  },
  {
    title: "Set up CI pipeline",
    description: "Run lint, tests and build on every pull request.",
    projectId: "project-3", assigneeIds: ["employee-4"], status: "todo",
    priority: "low", department: "operations", due: 9, created: 4,
  },
  {
    title: "Review color palette",
    description: "Check contrast ratios and finalize the dark theme tokens.",
    projectId: "project-1", assigneeIds: ["employee-5"], status: "todo",
    priority: "medium", department: "design", due: 6, created: 2,
  },
  {
    title: "Core API load testing",
    description: "Measure response times under 500 concurrent users.",
    projectId: "project-3", assigneeIds: ["employee-6"], status: "todo",
    priority: "medium", department: "engineering", due: 8, created: 0,
  },
].forEach(({ due, created, ...rest }) => {
  tasks.push(
    makeTask({
      ...rest,
      dueDate: daysFromNow(due),
      createdBy: "admin-1",
      createdAt: daysAgo(created),
    }),
  );
});

// Open tasks created the week before (used for the trend percentage)
[
  { title: "Research competitors", projectId: "project-1", assigneeIds: ["employee-3"], status: "todo", department: "research", created: 9 },
  { title: "Define data models", projectId: "project-3", assigneeIds: ["employee-4"], status: "todo", department: "engineering", created: 10 },
  { title: "Draft sprint plan", projectId: "project-2", assigneeIds: ["employee-1"], status: "in-progress", department: "operations", progress: 50, created: 12 },
].forEach(({ created, ...rest }) => {
  tasks.push(makeTask({ ...rest, createdBy: "admin-1", createdAt: daysAgo(created) }));
});

const activities = [
  { _id: randomUUID(), type: "update", text: "Sarah updated", target: "Landing Page Redesign", createdAt: hoursAgo(2) },
  { _id: randomUUID(), type: "complete", text: "Alex completed", target: "API Integration", createdAt: hoursAgo(5) },
  { _id: randomUUID(), type: "join", text: "New member joined", target: "Design Team", createdAt: hoursAgo(26) },
  { _id: randomUUID(), type: "alert", text: "Server alert:", target: "High latency detected", createdAt: hoursAgo(30) },
];

const addActivity = (type, text, target) => {
  activities.unshift({ _id: randomUUID(), type, text, target, createdAt: now() });
  if (activities.length > 200) activities.length = 200;
};

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                   */
/* -------------------------------------------------------------------------- */

const publicEmployee = ({ password, ...employee }) => employee;

const teamMember = (employee) => ({
  _id: employee._id,
  name: employee.name,
  avatar: employee.avatar,
  department: employee.department,
  presence: employee.presence,
});

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": res.req?.headers.origin || "http://localhost:5173",
    "Access-Control-Allow-Credentials": "true",
    ...headers,
  });
  res.end(JSON.stringify(body));
};

const parseCookies = (request) =>
  Object.fromEntries(
    (request.headers.cookie || "")
      .split(";")
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...value] = cookie.trim().split("=");
        return [name, decodeURIComponent(value.join("="))];
      }),
  );

const getCurrentEmployee = (request) => {
  const sessionId = parseCookies(request).teamSyncSession;
  const employeeId = sessionId && sessions.get(sessionId);
  return employees.find((employee) => employee._id === employeeId);
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const requireUser = (request, response) => {
  const employee = getCurrentEmployee(request);
  if (!employee) {
    send(response, 401, { message: "Please sign in to continue." });
    return null;
  }
  return employee;
};

const requireAdmin = (request, response) => {
  const employee = requireUser(request, response);
  if (!employee) return null;
  if (employee.role !== "admin") {
    send(response, 403, { message: "Administrator access is required." });
    return null;
  }
  return employee;
};

// Adds assignee names/avatars, creator name and project name to a task
const withNames = (task) => ({
  ...task,
  assignees: task.assigneeIds
    .map((id) => employees.find((e) => e._id === id))
    .filter(Boolean)
    .map((e) => ({ _id: e._id, name: e.name, avatar: e.avatar })),
  createdByName: employees.find((e) => e._id === task.createdBy)?.name || null,
  projectName: projects.find((p) => p._id === task.projectId)?.name || null,
});

// Validates the fields that may appear in a create or update body.
// Returns [statusCode, message] on failure, or null when everything is valid.
const validateTaskBody = (body) => {
  if (body.status !== undefined && !TASK_STATUSES.includes(body.status)) {
    return [400, `Status must be one of: ${TASK_STATUSES.join(", ")}.`];
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    return [400, `Priority must be one of: ${PRIORITIES.join(", ")}.`];
  }
  if (body.department !== undefined && !DEPARTMENTS.includes(body.department)) {
    return [400, `Department must be one of: ${DEPARTMENTS.join(", ")}.`];
  }
  if (body.dueDate && Number.isNaN(new Date(body.dueDate).getTime())) {
    return [400, "Due date is not a valid date."];
  }
  if (body.progress !== undefined) {
    const progress = Number(body.progress);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      return [400, "Progress must be a number between 0 and 100."];
    }
  }
  if (body.projectId && !projects.some((p) => p._id === body.projectId)) {
    return [404, "Project not found."];
  }
  if (body.assigneeIds !== undefined) {
    if (!Array.isArray(body.assigneeIds)) {
      return [400, "assigneeIds must be an array of employee ids."];
    }
    if (body.assigneeIds.some((id) => !employees.some((e) => e._id === id))) {
      return [404, "One or more assignees were not found."];
    }
  }
  return null;
};

// % change between two numbers
const percentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const countInWindow = (items, field, fromDays, toDays) => {
  const t = Date.now();
  return items.filter((item) => {
    if (!item[field]) return false;
    const value = new Date(item[field]).getTime();
    return value >= t - fromDays * DAY && value < t - toDays * DAY;
  }).length;
};

const buildDashboard = (user) => {
  const activeEmployees = employees.filter((e) => e.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "done");
  const activeProjects = projects.filter((project) => project.status === "active");

  // Task progress chart: tasks completed on each of the last 7 days
  const chart = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(Date.now() - i * DAY);
    const completed = tasks.filter(
      (task) => task.completedAt && new Date(task.completedAt).toDateString() === day.toDateString(),
    ).length;
    chart.push({
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: day.toISOString().slice(0, 10),
      completed,
    });
  }

  // Simple rule-based "AI suggestion": the active project with the most open tasks
  const openByProject = activeProjects
    .map((project) => ({
      project,
      open: tasks.filter((task) => task.projectId === project._id && task.status !== "done").length,
    }))
    .sort((a, b) => b.open - a.open)[0];

  const suggestion = openByProject && openByProject.open > 0
    ? {
        message: `Based on your activity, you should review the "${openByProject.project.name}" tasks today.`,
        projectId: openByProject.project._id,
        openTasks: openByProject.open,
      }
    : { message: "You're all caught up. Nice work!", projectId: null, openTasks: 0 };

  return {
    user: { _id: user._id, name: user.name, avatar: user.avatar },
    stats: {
      totalTasks: {
        value: tasks.length,
        change: percentChange(countInWindow(tasks, "createdAt", 7, 0), countInWindow(tasks, "createdAt", 14, 7)),
      },
      completedTasks: {
        value: completedTasks.length,
        change: percentChange(countInWindow(tasks, "completedAt", 7, 0), countInWindow(tasks, "completedAt", 14, 7)),
      },
      activeProjects: { value: activeProjects.length },
      teamMembers: {
        value: activeEmployees.length,
        newThisMonth: employees.filter((e) => Date.now() - new Date(e.joiningDate).getTime() <= 30 * DAY).length,
      },
    },
    chart,
    activities: activities.slice(0, 5),
    team: activeEmployees.slice(0, 8).map(teamMember),
    suggestion,
  };
};

/* -------------------------------------------------------------------------- */
/*  SERVER                                                                    */
/* -------------------------------------------------------------------------- */

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname, searchParams } = url;

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": request.headers.origin || "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    });
    response.end();
    return;
  }

  try {
    /* ------------------------------ Health -------------------------------- */
    if (request.method === "GET" && pathname === "/api/health") {
      send(response, 200, { status: "ok" });
      return;
    }

    /* -------------------------------- Auth -------------------------------- */
    if (request.method === "POST" && pathname === "/api/auth/login") {
      const { email, password } = await readBody(request);
      const employee = employees.find(
        (item) => item.email.toLowerCase() === String(email || "").toLowerCase(),
      );
      if (!employee || employee.password !== password) {
        send(response, 401, { message: "Invalid email or password." });
        return;
      }
      if (employee.status !== "active") {
        send(response, 403, { message: "This employee account is inactive." });
        return;
      }
      const sessionId = randomUUID();
      sessions.set(sessionId, employee._id);
      send(response, 200, { data: publicEmployee(employee) }, {
        "Set-Cookie": `teamSyncSession=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/auth/register") {
      const { fullname, email, password } = await readBody(request);
      if (!fullname || !email || !password) {
        send(response, 400, { message: "Name, email, and password are required." });
        return;
      }
      if (employees.some((item) => item.email.toLowerCase() === String(email).toLowerCase())) {
        send(response, 409, { message: "An employee with that email already exists." });
        return;
      }
      const employee = {
        _id: randomUUID(),
        name: String(fullname).trim(),
        email: String(email).trim().toLowerCase(),
        password,
        role: "employee",
        department: "developer",
        status: "active",
        presence: "Available",
        bio: "",
        avatar: "",
        joiningDate: now().slice(0, 10),
        createdAt: now(),
      };
      employees.push(employee);
      addActivity("join", `${employee.name} joined`, "the workspace");
      const sessionId = randomUUID();
      sessions.set(sessionId, employee._id);
      send(response, 201, { data: publicEmployee(employee) }, {
        "Set-Cookie": `teamSyncSession=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
      });
      return;
    }

    if (request.method === "GET" && pathname === "/api/auth/me") {
      const employee = requireUser(request, response);
      if (employee) send(response, 200, { user: publicEmployee(employee) });
      return;
    }

    if (request.method === "POST" && pathname === "/api/auth/logout") {
      const sessionId = parseCookies(request).teamSyncSession;
      if (sessionId) sessions.delete(sessionId);
      send(response, 200, { message: "Signed out." }, {
        "Set-Cookie": "teamSyncSession=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0",
      });
      return;
    }

    /* ----------------------- Employees (admin only) ----------------------- */
    if (request.method === "GET" && pathname === "/api/employee") {
      if (!requireAdmin(request, response)) return;
      const page = Math.max(Number(searchParams.get("page")) || 1, 1);
      const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
      const search = (searchParams.get("search") || "").toLowerCase();
      const role = searchParams.get("role") || "";
      const department = searchParams.get("department") || "";
      const status = searchParams.get("status") || "";
      const filtered = employees.filter((employee) => {
        const searchable = `${employee.name} ${employee.email} ${employee.bio}`.toLowerCase();
        return (!search || searchable.includes(search)) &&
          (!role || employee.role === role) &&
          (!department || employee.department === department) &&
          (!status || employee.status === status);
      });
      const totalPages = Math.max(Math.ceil(filtered.length / limit), 1);
      send(response, 200, {
        data: {
          employees: filtered.slice((page - 1) * limit, page * limit).map(publicEmployee),
          pagination: { page, limit, total: filtered.length, totalPages },
        },
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/employee/create") {
      if (!requireAdmin(request, response)) return;
      const body = await readBody(request);
      if (!body.name || !body.email || !body.role || !body.department) {
        send(response, 400, { message: "Name, email, role, and department are required." });
        return;
      }
      if (employees.some((employee) => employee.email.toLowerCase() === String(body.email).toLowerCase())) {
        send(response, 409, { message: "An employee with that email already exists." });
        return;
      }
      const employee = {
        _id: randomUUID(),
        name: String(body.name).trim(),
        email: String(body.email).trim().toLowerCase(),
        password: body.password || "password123",
        role: body.role,
        department: body.department,
        status: body.status === "inactive" ? "inactive" : "active",
        presence: "Available",
        bio: body.bio || "",
        avatar: body.avatar || "",
        joiningDate: body.joiningDate || now().slice(0, 10),
        createdAt: now(),
      };
      employees.push(employee);
      addActivity("join", "New member joined", employee.department);
      send(response, 201, { data: publicEmployee(employee) });
      return;
    }

    const employeeMatch = pathname.match(/^\/api\/employee\/update\/([^/]+)$/);
    if (request.method === "PATCH" && employeeMatch) {
      if (!requireAdmin(request, response)) return;
      const employee = employees.find((item) => item._id === employeeMatch[1]);
      if (!employee) {
        send(response, 404, { message: "Employee not found." });
        return;
      }
      const body = await readBody(request);
      ["name", "department", "role", "status", "bio", "avatar", "joiningDate"].forEach((field) => {
        if (body[field] !== undefined) employee[field] = body[field];
      });
      send(response, 200, { data: publicEmployee(employee) });
      return;
    }

    /* ------------------- Team (any signed-in employee) -------------------- */
    if (request.method === "GET" && pathname === "/api/team") {
      if (!requireUser(request, response)) return;
      const members = employees.filter((e) => e.status === "active").map(teamMember);
      send(response, 200, { data: members });
      return;
    }

    if (request.method === "PATCH" && pathname === "/api/team/presence") {
      const user = requireUser(request, response);
      if (!user) return;
      const { presence } = await readBody(request);
      if (!PRESENCE_OPTIONS.includes(presence)) {
        send(response, 400, { message: `Presence must be one of: ${PRESENCE_OPTIONS.join(", ")}.` });
        return;
      }
      user.presence = presence;
      send(response, 200, { data: teamMember(user) });
      return;
    }

    /* ------------------------------- Projects ----------------------------- */
    if (request.method === "GET" && pathname === "/api/projects") {
      if (!requireUser(request, response)) return;
      const status = searchParams.get("status");
      const list = projects.filter((project) => !status || project.status === status);
      send(response, 200, { data: list });
      return;
    }

    /* -------------------------------- Tasks ------------------------------- */
    if (request.method === "GET" && pathname === "/api/tasks") {
      if (!requireUser(request, response)) return;
      const status = searchParams.get("status");
      const priority = searchParams.get("priority");
      const department = searchParams.get("department");
      const projectId = searchParams.get("projectId");
      const assigneeId = searchParams.get("assigneeId");
      const search = (searchParams.get("search") || "").toLowerCase();
      const page = Math.max(Number(searchParams.get("page")) || 1, 1);
      const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 100, 1), 200);

      const filtered = tasks
        .filter((task) =>
          (!status || task.status === status) &&
          (!priority || task.priority === priority) &&
          (!department || task.department === department) &&
          (!projectId || task.projectId === projectId) &&
          (!assigneeId || task.assigneeIds.includes(assigneeId)) &&
          (!search || task.title.toLowerCase().includes(search)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      send(response, 200, {
        data: {
          tasks: filtered.slice((page - 1) * limit, page * limit).map(withNames),
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.max(Math.ceil(filtered.length / limit), 1),
          },
        },
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/tasks") {
      const user = requireUser(request, response);
      if (!user) return;
      const body = await readBody(request);

      if (!body.title || !String(body.title).trim()) {
        send(response, 400, { message: "Task title is required." });
        return;
      }
      const invalid = validateTaskBody(body);
      if (invalid) {
        send(response, invalid[0], { message: invalid[1] });
        return;
      }

      const status = body.status || "todo";
      const task = makeTask({
        title: String(body.title).trim(),
        description: body.description || "",
        projectId: body.projectId || null,
        assigneeIds: body.assigneeIds?.length ? body.assigneeIds : [user._id],
        status,
        priority: body.priority || "medium",
        dueDate: body.dueDate || null,
        department: body.department || "engineering",
        progress: Number(body.progress) || 0,
        createdBy: user._id,
        createdAt: now(),
        completedAt: status === "done" ? now() : null,
      });
      tasks.push(task);
      addActivity("create", `${user.name.split(" ")[0]} created`, task.title);
      send(response, 201, { data: withNames(task) });
      return;
    }

    const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);

    if (taskMatch && request.method === "GET") {
      if (!requireUser(request, response)) return;
      const task = tasks.find((item) => item._id === taskMatch[1]);
      if (!task) {
        send(response, 404, { message: "Task not found." });
        return;
      }
      send(response, 200, { data: withNames(task) });
      return;
    }

    if (taskMatch && request.method === "PATCH") {
      const user = requireUser(request, response);
      if (!user) return;
      const task = tasks.find((item) => item._id === taskMatch[1]);
      if (!task) {
        send(response, 404, { message: "Task not found." });
        return;
      }
      const body = await readBody(request);

      if (body.title !== undefined && !String(body.title).trim()) {
        send(response, 400, { message: "Task title cannot be empty." });
        return;
      }
      const invalid = validateTaskBody(body);
      if (invalid) {
        send(response, invalid[0], { message: invalid[1] });
        return;
      }

      const wasDone = task.status === "done";

      if (body.title !== undefined) task.title = String(body.title).trim();
      if (body.description !== undefined) task.description = body.description;
      if (body.status !== undefined) task.status = body.status;
      if (body.priority !== undefined) task.priority = body.priority;
      if (body.department !== undefined) task.department = body.department;
      if (body.dueDate !== undefined) task.dueDate = body.dueDate || null;
      if (body.progress !== undefined) task.progress = Number(body.progress);
      if (body.projectId !== undefined) task.projectId = body.projectId || null;
      if (body.assigneeIds !== undefined) task.assigneeIds = body.assigneeIds;

      if (task.status === "done") task.progress = 100;

      const firstName = user.name.split(" ")[0];
      if (task.status === "done" && !wasDone) {
        task.completedAt = now();
        addActivity("complete", `${firstName} completed`, task.title);
      } else if (task.status !== "done" && wasDone) {
        task.completedAt = null;
        addActivity("update", `${firstName} reopened`, task.title);
      } else {
        addActivity("update", `${firstName} updated`, task.title);
      }
      send(response, 200, { data: withNames(task) });
      return;
    }

    if (taskMatch && request.method === "DELETE") {
      if (!requireAdmin(request, response)) return;
      const index = tasks.findIndex((item) => item._id === taskMatch[1]);
      if (index === -1) {
        send(response, 404, { message: "Task not found." });
        return;
      }
      tasks.splice(index, 1);
      send(response, 200, { message: "Task deleted." });
      return;
    }

    /* ------------------------------ Activities ---------------------------- */
    if (request.method === "GET" && pathname === "/api/activities") {
      if (!requireUser(request, response)) return;
      const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 10, 1), 50);
      send(response, 200, { data: activities.slice(0, limit) });
      return;
    }

    /* ------------------------------ Dashboard ----------------------------- */
    if (request.method === "GET" && pathname === "/api/dashboard") {
      const user = requireUser(request, response);
      if (!user) return;
      send(response, 200, { data: buildDashboard(user) });
      return;
    }

    /* -------------------------------- Search ------------------------------ */
    if (request.method === "GET" && pathname === "/api/search") {
      if (!requireUser(request, response)) return;
      const q = (searchParams.get("q") || "").trim().toLowerCase();
      if (!q) {
        send(response, 200, { data: { tasks: [], projects: [], people: [] } });
        return;
      }
      send(response, 200, {
        data: {
          tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5).map(withNames),
          projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5),
          people: employees.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 5).map(teamMember),
        },
      });
      return;
    }

    send(response, 404, { message: "Route not found." });
  } catch (error) {
    send(response, 400, { message: error instanceof Error ? error.message : "Invalid request." });
  }
});

server.listen(port, () => {
  console.log(`Team Sync API listening on http://localhost:${port}/api`);
});