import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  createSession,
  getAuthenticatedUser,
  hashPassword as hash,
  isValidEmail as validEmail,
  parseCookies as cookies,
  serializeSessionCookie,
  toPublicEmployee as pub,
  verifyPassword as verify,
} from "./lib/security.js";
import { readJsonBody as body, sendJson as send } from "./lib/http.js";
import { extname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".woff2", "font/woff2"],
]);

const getContentType = (path) =>
  CONTENT_TYPES.get(extname(path).toLowerCase()) || "application/octet-stream";
const root = resolve(fileURLToPath(new URL("..", import.meta.url))),
  port = Number(process.env.PORT || 3001),
  isProduction = process.env.NODE_ENV === "production",
  now = () => new Date().toISOString();
const seed = {
  employees: [{
    _id: "admin-1",
    name: "Team Sync Admin",
    email: "admin@teamsync.local",
    role: "admin",
    department: "management",
    status: "active",
    bio: "Workspace administrator",
    avatar: "",
    joiningDate: "2025-01-01",
    createdAt: "2025-01-01T09:00:00.000Z",
    passwordHash: ""
  }, {
    _id: "employee-1",
    name: "Aarav Mehta",
    email: "aarav@teamsync.local",
    role: "employee",
    department: "developer",
    status: "active",
    bio: "Frontend developer",
    avatar: "",
    joiningDate: "2025-02-10",
    createdAt: "2025-02-10T09:00:00.000Z",
    passwordHash: ""
  }, {
    _id: "employee-2",
    name: "Maya Singh",
    email: "maya@teamsync.local",
    role: "employee",
    department: "administrative",
    status: "inactive",
    bio: "Operations coordinator",
    avatar: "",
    joiningDate: "2025-03-12",
    createdAt: "2025-03-12T09:00:00.000Z",
    passwordHash: ""
  }],
  messages: [],
  tasks: [],
  attendance: [],
  departments: [],
  documents: []
};
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI to connect Team Sync to MongoDB.");
const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
});
await mongoClient.connect();
const db = mongoClient.db(process.env.MONGODB_DB_NAME || "team_sync");
await db.command({
  ping: 1
});
const collectionNames = ["employees", "messages", "tasks", "attendance", "departments", "documents", "sessions"];
const collections = Object.fromEntries(collectionNames.map(name => [name, db.collection(name)]));
await collections.employees.createIndex({
  email: 1
}, {
  unique: true
});
const [employees, messages, tasks, attendance, departments, documents, savedSessions] =
  await Promise.all([
    collections.employees.find().toArray(),
    ...["messages", "tasks", "attendance", "departments", "documents"].map(name =>
      collections[name].find({}, {
  projection: {
    _id: 0
  }
}).toArray()), collections.sessions.find().toArray()]);
const isNewDatabase = employees.length === 0;
const hasUnsafeSeedPasswords =
  !process.env.DEMO_ADMIN_PASSWORD ||
  !process.env.DEMO_EMPLOYEE_PASSWORD ||
  process.env.DEMO_ADMIN_PASSWORD === "password123" ||
  process.env.DEMO_EMPLOYEE_PASSWORD === "password123";
if (isNewDatabase && isProduction && hasUnsafeSeedPasswords) {
  throw new Error(
    "Set unique DEMO_ADMIN_PASSWORD and DEMO_EMPLOYEE_PASSWORD values before first production startup.",
  );
}
let data = isNewDatabase ? structuredClone(seed) : {
  employees,
  messages,
  tasks,
  attendance,
  departments,
  documents,
  sessions: Object.fromEntries(savedSessions.map(({
    _id,
    employeeId
  }) => [_id, employeeId]))
};
data.sessions ||= {};
data.tasks ||= [];
data.messages ||= [];
data.attendance ||= [];
data.departments ||= [...new Set(data.employees.map(e => e.department).filter(Boolean))].map(name => ({
  id: randomUUID(),
  name,
  description: "",
  createdAt: now()
}));
data.documents ||= [];
let saveQueue = Promise.resolve();
const save = (...names) => {
  const snapshots = new Map(names.map(name => [name, structuredClone(name === "sessions" ? Object.entries(data.sessions).map(([id, employeeId]) => ({
    id,
    employeeId
  })) : data[name])]));
  saveQueue = saveQueue.catch(() => {}).then(async () => {
    for (const [name, items] of snapshots) {
      const idKey = name === "employees" ? "_id" : "id";
      const ids = items.map(item => item[idKey]);
      if (items.length) await collections[name].bulkWrite(items.map(item => ({
        replaceOne: {
          filter: {
            _id: item[idKey]
          },
          replacement: {
            ...item,
            _id: item[idKey]
          },
          upsert: true
        }
      })));
      if (ids.length) await collections[name].deleteMany({
        _id: {
          $nin: ids
        }
      });else await collections[name].deleteMany({});
    }
  });
  return saveQueue;
};
const seededPasswords = [
  ["admin-1", process.env.DEMO_ADMIN_PASSWORD || "password123"],
  ["employee-1", process.env.DEMO_EMPLOYEE_PASSWORD || "password123"],
  ["employee-2", process.env.DEMO_EMPLOYEE_PASSWORD || "password123"],
];
for (const [id, password] of seededPasswords) {
  const u = data.employees.find(x => x._id === id);
  if (u && !u.passwordHash) u.passwordHash = await hash(password);
}
await save(...collectionNames);
/**
 * HTTP API entry point. Route groups retain the existing client contract while
 * persistence, credentials, and HTTP primitives live in focused modules.
 */
const handleApiRequest = async (req, res) => {
  const origin = req.headers.origin;
  if (origin && process.env.APP_ORIGIN && origin === process.env.APP_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`),
    p = url.pathname,
    q = url.searchParams;
  const auth = () => {
    const u = getAuthenticatedUser(req, data);
    if (!u) send(res, 401, {
      message: "Please sign in to continue."
    });
    return u;
  };
  try {
    // Health and account lifecycle routes.
    if (req.method === "GET" && p === "/api/health") return send(res, 200, {
      status: "ok",
      timestamp: now()
    });
    if (req.method === "POST" && p === "/api/auth/login") {
      const b = await body(req),
        u = data.employees.find(x => x.email === String(b.email || "").trim().toLowerCase());
      if (!u || !(await verify(String(b.password || ""), u.passwordHash))) return send(res, 401, {
        message: "Invalid email or password."
      });
      if (u.status !== "active") return send(res, 403, {
        message: "This employee account is inactive."
      });
      return send(res, 200, {
        data: pub(u)
      }, {
        "Set-Cookie": await createSession(u, data, save, isProduction)
      });
    }
    if (req.method === "POST" && p === "/api/auth/register") {
      const b = await body(req),
        name = String(b.fullname || "").trim(),
        email = String(b.email || "").trim().toLowerCase(),
        password = String(b.password || "");
      if (name.length < 2 || name.length > 80 || !validEmail(email) || password.length < 10) return send(res, 400, {
        message: "Enter a name, valid email, and password of at least 10 characters."
      });
      if (data.employees.some(x => x.email === email)) return send(res, 409, {
        message: "An employee with that email already exists."
      });
      const u = {
        _id: randomUUID(),
        name,
        email,
        role: "employee",
        department: "developer",
        status: "active",
        bio: "",
        avatar: "",
        joiningDate: now().slice(0, 10),
        createdAt: now(),
        passwordHash: await hash(password)
      };
      data.employees.push(u);
      await save("employees");
      return send(res, 201, {
        data: pub(u)
      }, {
        "Set-Cookie": await createSession(u, data, save, isProduction)
      });
    }
    if (req.method === "GET" && p === "/api/auth/me") {
      const u = auth();
      if (u) return send(res, 200, {
        user: pub(u)
      });
      return;
    }
    if (req.method === "POST" && p === "/api/auth/logout") {
      const id = cookies(req).teamSyncSession;
      if (id) {
        delete data.sessions[id];
        await save("sessions");
      }
      return send(res, 200, {
        message: "Signed out."
      }, {
        "Set-Cookie": serializeSessionCookie("", 0, isProduction)
      });
    }
    // Direct messages and employee discovery.
    if (req.method === "GET" && p === "/api/chat/people") {
      const u = auth();
      if (!u) return;
      return send(res, 200, {
        data: data.employees.filter(x => x._id !== u._id && x.status === "active").map(pub)
      });
    }
    if (req.method === "GET" && p === "/api/chat/messages") {
      const u = auth();
      if (!u) return;
      const withId = q.get("with"),
        after = Number(q.get("after") || 0);
      if (!data.employees.some(x => x._id === withId && x.status === "active")) return send(res, 404, {
        message: "Employee not found."
      });
      return send(res, 200, {
        data: data.messages
        .filter(
          (message) =>
            ((message.senderId === u._id && message.receiverId === withId) ||
              (message.senderId === withId && message.receiverId === u._id)) &&
            message.sequence > after,
        )
        .slice(-100)
      });
    }
    if (req.method === "POST" && p === "/api/chat/messages") {
      const u = auth();
      if (!u) return;
      const b = await body(req),
        text = String(b.text || "").trim();
      if (!data.employees.some(x => x._id === b.receiverId && x.status === "active")) return send(res, 404, {
        message: "Employee not found."
      });
      if (!text || text.length > 2000) return send(res, 400, {
        message: "Messages must contain 1 to 2,000 characters."
      });
      const m = {
        id: randomUUID(),
        sequence: Math.max(Date.now(), (data.messages.at(-1)?.sequence || 0) + 1),
        senderId: u._id,
        senderName: u.name,
        receiverId: b.receiverId,
        text,
        createdAt: now()
      };
      data.messages.push(m);
      await save("messages");
      return send(res, 201, {
        data: m
      });
    }
    // Task assignment and status management.
    if (req.method === "GET" && p === "/api/tasks") {
      const u = auth();
      if (!u) return;
      const tasks = u.role === "admin" ? data.tasks : data.tasks.filter(t => t.assignedTo === u._id);
      return send(res, 200, {
        data: tasks.map(t => ({
          ...t,
          assignee: data.employees.find(e => e._id === t.assignedTo)?.name || "Unknown"
        })).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      });
    }
    if (req.method === "POST" && p === "/api/tasks") {
      const a = auth();
      if (!a) return;
      if (a.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const b = await body(req),
        title = String(b.title || "").trim(),
        assignee = data.employees.find(e => e._id === b.assignedTo && e.status === "active");
      if (title.length < 3 || title.length > 120 || !assignee) return send(res, 400, {
        message: "Provide a task title (3–120 characters) and an active employee."
      });
      const task = {
        id: randomUUID(),
        title,
        description: String(b.description || "").trim().slice(0, 2000),
        assignedTo: assignee._id,
        status: "todo",
        dueDate: b.dueDate || "",
        createdAt: now(),
        updatedAt: now()
      };
      data.tasks.push(task);
      await save("tasks");
      return send(res, 201, {
        data: {
          ...task,
          assignee: assignee.name
        }
      });
    }
    const taskMatch = p.match(/^\/api\/tasks\/([^/]+)$/);
    if (req.method === "PATCH" && taskMatch) {
      const u = auth();
      if (!u) return;
      const task = data.tasks.find(t => t.id === taskMatch[1]);
      if (!task) return send(res, 404, {
        message: "Task not found."
      });
      if (u.role !== "admin" && task.assignedTo !== u._id) return send(res, 403, {
        message: "You can only update your own tasks."
      });
      const b = await body(req);
      if (b.status !== undefined) {
        if (!["todo", "in_progress", "done"].includes(b.status)) return send(res, 400, {
          message: "Invalid task status."
        });
        task.status = b.status;
      }
      if (u.role === "admin") {
        if (b.title !== undefined) {
          const title = String(b.title).trim();
          if (title.length < 3 || title.length > 120) return send(res, 400, {
            message: "Task title must be 3–120 characters."
          });
          task.title = title;
        }
        if (b.description !== undefined) task.description = String(b.description).trim().slice(0, 2000);
        if (b.dueDate !== undefined) task.dueDate = String(b.dueDate);
        if (b.assignedTo !== undefined) {
          if (!data.employees.some(e => e._id === b.assignedTo && e.status === "active")) return send(res, 400, {
            message: "Choose an active employee."
          });
          task.assignedTo = b.assignedTo;
        }
      }
      task.updatedAt = now();
      await save("tasks");
      return send(res, 200, {
        data: task
      });
    }
    if (req.method === "DELETE" && taskMatch) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const i = data.tasks.findIndex(t => t.id === taskMatch[1]);
      if (i < 0) return send(res, 404, {
        message: "Task not found."
      });
      data.tasks.splice(i, 1);
      await save("tasks");
      return send(res, 200, {
        message: "Task deleted."
      });
    }
    // Employee check-in/out and attendance administration.
    if (req.method === "GET" && p === "/api/attendance") {
      const u = auth();
      if (!u) return;
      const items = u.role === "admin" ? data.attendance : data.attendance.filter(a => a.employeeId === u._id);
      return send(res, 200, {
        data: items.map(a => ({
          ...a,
          employeeName: data.employees.find(e => e._id === a.employeeId)?.name || "Unknown"
        })).sort((a, b) => b.date.localeCompare(a.date))
      });
    }
    if (req.method === "POST" && p === "/api/attendance/check-in") {
      const u = auth();
      if (!u) return;
      const date = now().slice(0, 10);
      let record = data.attendance.find(a => a.employeeId === u._id && a.date === date);
      if (record?.checkIn) return send(res, 409, {
        message: "You are already checked in today."
      });
      if (!record) {
        record = {
          id: randomUUID(),
          employeeId: u._id,
          date,
          checkIn: now(),
          checkOut: null,
          status: "present"
        };
        data.attendance.push(record);
      } else record.checkIn = now();
      await save("attendance");
      return send(res, 201, {
        data: record
      });
    }
    if (req.method === "POST" && p === "/api/attendance/check-out") {
      const u = auth();
      if (!u) return;
      const record = data.attendance.find(a => a.employeeId === u._id && a.date === now().slice(0, 10));
      if (!record?.checkIn) return send(res, 400, {
        message: "Check in before checking out."
      });
      if (record.checkOut) return send(res, 409, {
        message: "You are already checked out."
      });
      record.checkOut = now();
      await save("attendance");
      return send(res, 200, {
        data: record
      });
    }
    if (req.method === "PATCH" && p.startsWith("/api/attendance/")) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const record = data.attendance.find(a => a.id === p.split("/").at(-1));
      if (!record) return send(res, 404, {
        message: "Attendance record not found."
      });
      const b = await body(req);
      if (!["present", "late", "absent"].includes(b.status)) return send(res, 400, {
        message: "Choose present, late, or absent."
      });
      record.status = b.status;
      await save("attendance");
      return send(res, 200, {
        data: record
      });
    }
    // Department and shared document management.
    if (req.method === "GET" && p === "/api/departments") {
      const u = auth();
      if (!u) return;
      return send(res, 200, {
        data: data.departments
      });
    }
    if (req.method === "POST" && p === "/api/departments") {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const b = await body(req),
        name = String(b.name || "").trim();
      if (name.length < 2 || name.length > 80) return send(res, 400, {
        message: "Department name must be 2–80 characters."
      });
      if (data.departments.some(d => d.name.toLowerCase() === name.toLowerCase())) return send(res, 409, {
        message: "That department already exists."
      });
      const d = {
        id: randomUUID(),
        name,
        description: String(b.description || "").trim().slice(0, 500),
        createdAt: now()
      };
      data.departments.push(d);
      await save("departments");
      return send(res, 201, {
        data: d
      });
    }
    const deptMatch = p.match(/^\/api\/departments\/([^/]+)$/);
    if (req.method === "PATCH" && deptMatch) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const d = data.departments.find(x => x.id === deptMatch[1]);
      if (!d) return send(res, 404, {
        message: "Department not found."
      });
      const b = await body(req),
        name = String(b.name || d.name).trim();
      if (name.length < 2 || name.length > 80) return send(res, 400, {
        message: "Department name must be 2–80 characters."
      });
      const old = d.name;
      d.name = name;
      if (b.description !== undefined) d.description = String(b.description).trim().slice(0, 500);
      data.employees.forEach(e => {
        if (e.department === old) e.department = name;
      });
      await save("departments", "employees");
      return send(res, 200, {
        data: d
      });
    }
    if (req.method === "DELETE" && deptMatch) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const i = data.departments.findIndex(d => d.id === deptMatch[1]);
      if (i < 0) return send(res, 404, {
        message: "Department not found."
      });
      const d = data.departments[i];
      if (data.employees.some(e => e.department === d.name)) return send(res, 409, {
        message: "Move employees to another department before deleting this one."
      });
      data.departments.splice(i, 1);
      await save("departments");
      return send(res, 200, {
        message: "Department deleted."
      });
    }
    if (req.method === "GET" && p === "/api/documents") {
      const u = auth();
      if (!u) return;
      return send(res, 200, {
        data: data.documents
      });
    }
    if (req.method === "POST" && p === "/api/documents") {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const b = await body(req),
        title = String(b.title || "").trim(),
        url = String(b.url || "").trim();
      if (title.length < 2 || title.length > 120 || !/^https?:\/\//i.test(url)) return send(res, 400, {
        message: "Enter a title and a valid http(s) document URL."
      });
      const d = {
        id: randomUUID(),
        title,
        url,
        description: String(b.description || "").trim().slice(0, 1000),
        createdBy: u._id,
        createdAt: now()
      };
      data.documents.push(d);
      await save("documents");
      return send(res, 201, {
        data: d
      });
    }
    const docMatch = p.match(/^\/api\/documents\/([^/]+)$/);
    if (req.method === "PATCH" && docMatch) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const d = data.documents.find(x => x.id === docMatch[1]);
      if (!d) return send(res, 404, {
        message: "Document not found."
      });
      const b = await body(req);
      if (b.title !== undefined) d.title = String(b.title).trim().slice(0, 120);
      if (b.description !== undefined) d.description = String(b.description).trim().slice(0, 1000);
      if (b.url !== undefined && /^https?:\/\//i.test(b.url)) d.url = String(b.url).trim();
      await save("documents");
      return send(res, 200, {
        data: d
      });
    }
    if (req.method === "DELETE" && docMatch) {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const i = data.documents.findIndex(d => d.id === docMatch[1]);
      if (i < 0) return send(res, 404, {
        message: "Document not found."
      });
      data.documents.splice(i, 1);
      await save("documents");
      return send(res, 200, {
        message: "Document deleted."
      });
    }
    // Employee profile and directory administration.
    if (req.method === "PATCH" && p === "/api/profile") {
      const u = auth();
      if (!u) return;
      const b = await body(req);
      if (b.name !== undefined) {
        const name = String(b.name).trim();
        if (name.length < 2 || name.length > 80) return send(res, 400, {
          message: "Name must be 2–80 characters."
        });
        u.name = name;
      }
      if (b.bio !== undefined) u.bio = String(b.bio).trim().slice(0, 500);
      if (b.avatar !== undefined) u.avatar = String(b.avatar).trim().slice(0, 1000);
      await save("employees");
      return send(res, 200, {
        data: pub(u)
      });
    }
    if (req.method === "GET" && p === "/api/employee") {
      const u = auth();
      if (!u) return;
      if (u.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const page = Math.max(Number(q.get("page")) || 1, 1),
        limit = Math.min(Math.max(Number(q.get("limit")) || 20, 1), 100),
        search = (q.get("search") || "").toLowerCase(),
        role = q.get("role") || "",
        department = q.get("department") || "",
        status = q.get("status") || "";
      const all = data.employees.filter((employee) => {
        const searchableText = `${employee.name} ${employee.email} ${employee.bio}`.toLowerCase();
        return (
          searchableText.includes(search) &&
          (!role || employee.role === role) &&
          (!department || employee.department === department) &&
          (!status || employee.status === status)
        );
      });
      return send(res, 200, {
        data: {
          employees: all.slice((page - 1) * limit, page * limit).map(pub),
          pagination: {
            page,
            limit,
            total: all.length,
            totalPages: Math.max(Math.ceil(all.length / limit), 1)
          }
        }
      });
    }
    if (req.method === "POST" && p === "/api/employee/create") {
      const a = auth();
      if (!a) return;
      if (a.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const b = await body(req),
        email = String(b.email || "").trim().toLowerCase();
      if (!b.name || !validEmail(email) || !b.role || !b.department || String(b.password || "").length < 10) return send(res, 400, {
        message: "Name, valid email, role, department, and password (10+ characters) are required."
      });
      if (data.employees.some(x => x.email === email)) return send(res, 409, {
        message: "An employee with that email already exists."
      });
      const e = {
        _id: randomUUID(),
        name: String(b.name).trim(),
        email,
        role: b.role,
        department: b.department,
        status: b.status === "inactive" ? "inactive" : "active",
        bio: b.bio || "",
        avatar: b.avatar || "",
        joiningDate: b.joiningDate || now().slice(0, 10),
        createdAt: now(),
        passwordHash: await hash(String(b.password))
      };
      data.employees.push(e);
      await save("employees");
      return send(res, 201, {
        data: pub(e)
      });
    }
    const match = p.match(/^\/api\/employee\/update\/([^/]+)$/);
    if (req.method === "PATCH" && match) {
      const a = auth();
      if (!a) return;
      if (a.role !== "admin") return send(res, 403, {
        message: "Administrator access is required."
      });
      const e = data.employees.find(x => x._id === match[1]);
      if (!e) return send(res, 404, {
        message: "Employee not found."
      });
      const b = await body(req);
      for (const k of ["name", "department", "role", "status", "bio", "avatar", "joiningDate"]) if (b[k] !== undefined) e[k] = b[k];
      await save("employees");
      return send(res, 200, {
        data: pub(e)
      });
    }
    return send(res, 404, {
      message: "Route not found."
    });
  } catch (e) {
    console.error(e);
    return send(res, e instanceof SyntaxError ? 400 : 500, {
      message: e instanceof SyntaxError ? "Invalid JSON request." : "Unexpected server error."
    });
  }
};
if (process.env.SERVE_STATIC === "true") {
  const { readFile } = await import("node:fs/promises");
  const distDirectory = resolve(root, "dist");

  const webServer = createServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    const requestPath = requestUrl.pathname;

    // Keep the API and SPA on the same origin so session cookies work in production.
    if (requestPath === "/api" || requestPath.startsWith("/api/")) {
      return handleApiRequest(request, response);
    }

    let requestedPath;
    try {
      requestedPath = resolve(
        distDirectory,
        `.${decodeURIComponent(requestPath)}`,
      );
    } catch {
      response.writeHead(400);
      return response.end("Invalid URL.");
    }

    if (
      requestedPath !== distDirectory &&
      !requestedPath.startsWith(`${distDirectory}/`)
    ) {
      response.writeHead(403);
      return response.end("Forbidden.");
    }

    try {
      const file = await readFile(requestedPath);
      response.writeHead(200, {
        "Content-Type": getContentType(requestedPath),
        "Cache-Control": requestedPath.endsWith("index.html")
          ? "no-cache"
          : "public, max-age=31536000, immutable",
      });
      return response.end(file);
    } catch {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(404);
        return response.end("Not found.");
      }

      try {
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        return response.end(await readFile(join(distDirectory, "index.html")));
      } catch {
        response.writeHead(404);
        return response.end("Build not found. Run npm run build.");
      }
    }
  });

  webServer.listen(port, () => {
    console.log(`Team Sync web app and API listening on port ${port}`);
  });
} else {
  const apiServer = createServer(handleApiRequest);
  apiServer.listen(port, () => {
    console.log(`Team Sync API listening on http://localhost:${port}/api`);
  });
}
