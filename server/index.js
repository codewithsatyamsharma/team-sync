import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 3000);
const sessions = new Map();
const now = () => new Date().toISOString();

const employees = [
  {
    _id: "admin-1",
    name: "Team Sync Admin",
    email: "admin@teamsync.local",
    password: "password123",
    role: "admin",
    department: "management",
    status: "active",
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
    bio: "Operations coordinator",
    avatar: "",
    joiningDate: "2025-03-12",
    createdAt: "2025-03-12T09:00:00.000Z",
  },
];

const publicEmployee = ({ password, ...employee }) => employee;

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
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

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname, searchParams } = url;

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": request.headers.origin || "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    });
    response.end();
    return;
  }

  try {
    if (request.method === "GET" && pathname === "/api/health") {
      send(response, 200, { status: "ok" });
      return;
    }

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
        bio: "",
        avatar: "",
        joiningDate: now().slice(0, 10),
        createdAt: now(),
      };
      employees.push(employee);
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
        bio: body.bio || "",
        avatar: body.avatar || "",
        joiningDate: body.joiningDate || now().slice(0, 10),
        createdAt: now(),
      };
      employees.push(employee);
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

    send(response, 404, { message: "Route not found." });
  } catch (error) {
    send(response, 400, { message: error instanceof Error ? error.message : "Invalid request." });
  }
});

server.listen(port, () => {
  console.log(`Team Sync API listening on http://localhost:${port}/api`);
});
