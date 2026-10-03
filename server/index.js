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

// Old department names that older frontend code may still send.
// They are translated to the current department slug automatically.
const DEPARTMENT_ALIASES = { developer: "engineering", administrative: "operations" };

/* -------------------------------------------------------------------------- */
/*  DATA (in memory, resets when the server restarts)                         */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Department model ----------------------------
 * { _id, name, slug, description, color, headId, createdAt, updatedAt }
 * `slug` is the key that employees and tasks store in their `department`
 * field. It is generated from the name on create and never changes, so
 * renaming a department does not break anything.
 * ------------------------------------------------------------------------- */

const departments = [
  {
    _id: "department-1", name: "Management", slug: "management",
    description: "Leadership, planning and workspace administration.",
    color: "#8b5cf6", headId: "admin-1", createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
  {
    _id: "department-2", name: "Engineering", slug: "engineering",
    description: "Frontend, backend and quality engineering.",
    color: "#6366f1", headId: "employee-4", createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
  {
    _id: "department-3", name: "Design", slug: "design",
    description: "Product design, UI and brand.",
    color: "#ec4899", headId: "employee-3", createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
  {
    _id: "department-4", name: "Marketing", slug: "marketing",
    description: "Campaigns, content and growth.",
    color: "#f59e0b", headId: null, createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
  {
    _id: "department-5", name: "Research", slug: "research",
    description: "User research and product discovery.",
    color: "#14b8a6", headId: null, createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
  {
    _id: "department-6", name: "Operations", slug: "operations",
    description: "Day-to-day operations, support and administration.",
    color: "#64748b", headId: null, createdAt: daysAgo(120), updatedAt: daysAgo(120),
  },
];

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
    department: "engineering",
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
    department: "operations",
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
    department: "engineering",
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
    department: "engineering",
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
 *   department: a department slug
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
/*  ATTENDANCE AND LEAVE                                                      */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Attendance model ----------------------------
 * {
 *   _id, employeeId,
 *   date:               "YYYY-MM-DD" (server local date). Unique per employee.
 *   checkIn, checkOut:  ISO strings (checkOut is null while the shift is open)
 *   breaks:             [{ start, end, duration }]   duration in minutes
 *   totalBreakMinutes, totalWorkedMinutes
 *   status:             "present" | "late" | "half_day" | "absent" | "on_leave"
 *   mode:               "office" | "remote"
 *   createdAt, updatedAt
 * }
 *
 * `status` is the result of the day. The live position of the shift is the
 * computed `state` field: not_checked_in | checked_in | on_break | checked_out
 *
 * ------------------------------- Leave model ------------------------------
 * {
 *   _id, employeeId,
 *   type:       "paid_time_off" | "sick" | "unpaid" | "other"
 *   startDate, endDate:  "YYYY-MM-DD"
 *   days:       working days in the range (weekends and holidays excluded)
 *   handoverNote,
 *   status:     "pending" | "approved" | "rejected" | "cancelled"
 *   approvedBy: employee _id | null
 *   reviewedAt, createdAt, updatedAt
 * }
 * ------------------------------------------------------------------------- */

const ATTENDANCE_STATUSES = ["absent", "present", "late", "half_day", "on_leave"];
const ATTENDANCE_MODES = ["office", "remote"];
const LEAVE_TYPES = ["paid_time_off", "sick", "unpaid", "other"];
const LEAVE_STATUSES = ["pending", "approved", "rejected", "cancelled"];
const PTO_ANNUAL_ALLOWANCE = 20;

// Attendance rules live on the server, never in React.
const ATTENDANCE_CONFIG = {
  workStartTime: "09:00",
  workEndTime: "18:00",
  lateAfterMinutes: 15,        // checking in later than 09:15 counts as late
  minimumBreakMinutes: 30,
  expectedDailyMinutes: 480,   // 8 hours
  halfDayMinutes: 240,         // working fewer minutes than this counts as a half day
};

// Company holidays (edit this list each year)
const holidays = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-19", name: "Martin Luther King Jr. Day" },
  { date: "2026-05-25", name: "Memorial Day" },
  { date: "2026-07-03", name: "Independence Day (Observed)" },
  { date: "2026-09-07", name: "Labor Day" },
  { date: "2026-11-26", name: "Thanksgiving Day" },
  { date: "2026-12-25", name: "Christmas Day" },
].map((holiday) => ({ ...holiday, description: "Official Company Holiday", paid: true }));

const leaves = [];
const attendanceRecords = [];

/* ------------------------------ Date helpers ------------------------------ */
// Attendance uses the server's local date and time. Run the server in the
// timezone of your office so "09:00" means 09:00 there.

const pad = (n) => String(n).padStart(2, "0");
const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseLocalDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const isValidDateString = (str) =>
  typeof str === "string" && /^\d{4}-\d{2}-\d{2}$/.test(str) && localDate(parseLocalDate(str)) === str;
const isValidMonth = (str) => typeof str === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(str);
const currentMonth = () => localDate().slice(0, 7);
const monthDates = (month) => {
  const [y, m] = month.split("-").map(Number);
  const total = new Date(y, m, 0).getDate();
  return Array.from({ length: total }, (_, i) => `${month}-${pad(i + 1)}`);
};
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const localMinutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();
const timeLabel = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const timeAt = (dateStr, minuteOfDay) => {
  const d = parseLocalDate(dateStr);
  d.setHours(Math.floor(minuteOfDay / 60), minuteOfDay % 60, 0, 0);
  return d.toISOString();
};
const minutesBetween = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 60000));
const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;

const isWeekend = (dateStr) => [0, 6].includes(parseLocalDate(dateStr).getDay());
const holidayOn = (dateStr) => holidays.find((holiday) => holiday.date === dateStr) || null;
const isWorkingDay = (dateStr) => !isWeekend(dateStr) && !holidayOn(dateStr);

const countWorkingDays = (startDate, endDate) => {
  let count = 0;
  const cursor = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  while (cursor <= end) {
    if (isWorkingDay(localDate(cursor))) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

// True when the employee has an approved leave covering this working day
const onApprovedLeave = (employeeId, dateStr) =>
  isWorkingDay(dateStr) &&
  leaves.some(
    (leave) =>
      leave.employeeId === employeeId &&
      leave.status === "approved" &&
      leave.startDate <= dateStr &&
      dateStr <= leave.endDate,
  );

/* --------------------------- Attendance calculators ----------------------- */

const findAttendance = (employeeId, date) =>
  attendanceRecords.find((record) => record.employeeId === employeeId && record.date === date);

const activeBreak = (record) => record.breaks.find((b) => !b.end);

// Open shifts stop counting at midnight so a forgotten clock-out cannot grow forever
const effectiveEnd = (record, at) => {
  if (record.checkOut) return new Date(record.checkOut);
  if (localDate(at) === record.date) return at;
  return new Date(timeAt(record.date, 23 * 60 + 59));
};

const breakMinutesOf = (record, at = new Date()) => {
  const end = effectiveEnd(record, at);
  return record.breaks.reduce(
    (sum, b) => sum + (b.end ? b.duration : minutesBetween(b.start, end)),
    0,
  );
};

const workedMinutesOf = (record, at = new Date()) => {
  const end = effectiveEnd(record, at);
  return Math.max(0, minutesBetween(record.checkIn, end) - breakMinutesOf(record, at));
};

const stateOf = (record) => {
  if (!record) return "not_checked_in";
  if (record.checkOut) return "checked_out";
  return activeBreak(record) ? "on_break" : "checked_in";
};

const serializeAttendance = (record, at = new Date()) => {
  const open = !record.checkOut;
  const currentBreak = open ? activeBreak(record) : null;
  return {
    ...record,
    breaks: record.breaks.map((b) => ({ ...b })),
    state: stateOf(record),
    isOnBreak: Boolean(currentBreak),
    currentBreakStart: currentBreak ? currentBreak.start : null,
    isShiftActive: open,
    totalBreakMinutes: breakMinutesOf(record, at),
    totalWorkedMinutes: workedMinutesOf(record, at),
  };
};

const emptyToday = (employeeId, date) => ({
  _id: null,
  employeeId,
  date,
  checkIn: null,
  checkOut: null,
  breaks: [],
  status: null,
  mode: null,
  state: "not_checked_in",
  isOnBreak: false,
  currentBreakStart: null,
  isShiftActive: false,
  totalBreakMinutes: 0,
  totalWorkedMinutes: 0,
});

// One row of the attendance history table
const historyRow = (record, at = new Date()) => {
  const worked = workedMinutesOf(record, at);
  return {
    _id: record._id,
    employeeId: record.employeeId,
    date: record.date,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    checkInTime: timeLabel(record.checkIn),
    checkOutTime: timeLabel(record.checkOut),
    breakMinutes: breakMinutesOf(record, at),
    totalMinutes: worked,
    totalHours: round2(worked / 60),
    mode: record.mode,
    status: record.status,
  };
};

/* ------------------------------ Leave helpers ----------------------------- */

const ptoStats = (employeeId, year = new Date().getFullYear()) => {
  const mine = leaves.filter(
    (leave) =>
      leave.employeeId === employeeId &&
      leave.type === "paid_time_off" &&
      leave.startDate.startsWith(String(year)),
  );
  const sumDays = (status) =>
    mine.filter((leave) => leave.status === status).reduce((sum, leave) => sum + leave.days, 0);
  const used = sumDays("approved");
  const pending = sumDays("pending");
  return {
    allowance: PTO_ANNUAL_ALLOWANCE,
    used,
    pending,
    remaining: PTO_ANNUAL_ALLOWANCE - used,
    available: Math.max(PTO_ANNUAL_ALLOWANCE - used - pending, 0),
  };
};

const leaveWithEmployee = (leave) => ({
  ...leave,
  employeeName: employees.find((e) => e._id === leave.employeeId)?.name || null,
  approvedByName: employees.find((e) => e._id === leave.approvedBy)?.name || null,
});

/* ------------------------ Calendar and summary builders ------------------- */

// One entry per notable day: attended, on leave, holiday, or absent
const buildCalendar = (employeeId, month) => {
  const employee = employees.find((e) => e._id === employeeId);
  const today = localDate();
  const entries = [];
  monthDates(month).forEach((date) => {
    const record = findAttendance(employeeId, date);
    if (record) {
      entries.push({ date, status: record.status });
      return;
    }
    if (onApprovedLeave(employeeId, date)) {
      entries.push({ date, status: "on_leave" });
      return;
    }
    const holiday = holidayOn(date);
    if (holiday) {
      entries.push({ date, status: "holiday", name: holiday.name });
      return;
    }
    if (isWeekend(date)) return;
    if (date < today && date >= employee.joiningDate) entries.push({ date, status: "absent" });
  });
  return entries;
};

const buildSummary = (employee, month) => {
  const at = new Date();
  const records = attendanceRecords.filter(
    (record) => record.employeeId === employee._id && record.date.startsWith(month),
  );
  const totalMinutes = records.reduce((sum, record) => sum + workedMinutesOf(record, at), 0);
  const workedRecords = records.filter((record) => workedMinutesOf(record, at) > 0);

  // Days the employee was expected to work this month
  const expectedDays = monthDates(month).filter(
    (date) =>
      isWorkingDay(date) &&
      date >= employee.joiningDate &&
      !onApprovedLeave(employee._id, date),
  ).length;
  const targetHours = (expectedDays * ATTENDANCE_CONFIG.expectedDailyMinutes) / 60;
  const monthlyHours = round1(totalMinutes / 60);
  const calendar = buildCalendar(employee._id, month);
  const pto = ptoStats(employee._id, Number(month.slice(0, 4)));

  return {
    month,
    monthlyHours,
    targetHours,
    targetPercentage: targetHours ? Math.round((monthlyHours / targetHours) * 100) : 0,
    averageDailyHours: workedRecords.length ? round1(totalMinutes / 60 / workedRecords.length) : 0,
    punctualityRate: records.length
      ? round1((records.filter((record) => record.status !== "late").length / records.length) * 100)
      : 0,
    daysPresent: records.length,
    daysLate: records.filter((record) => record.status === "late").length,
    daysAbsent: calendar.filter((entry) => entry.status === "absent").length,
    daysOnLeave: calendar.filter((entry) => entry.status === "on_leave").length,
    ptoBalance: pto.remaining,
    ptoPending: pto.pending,
    ptoAllowance: pto.allowance,
  };
};

/* ---------------------------------- Seeds --------------------------------- */

const seedLeave = (employeeId, type, startDate, endDate, status, handoverNote = "") => {
  leaves.push({
    _id: randomUUID(),
    employeeId,
    type,
    startDate,
    endDate,
    days: countWorkingDays(startDate, endDate),
    handoverNote,
    status,
    approvedBy: status === "approved" || status === "rejected" ? "admin-1" : null,
    reviewedAt: status === "approved" || status === "rejected" ? daysAgo(10) : null,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(10),
  });
};

seedLeave("admin-1", "paid_time_off", "2026-03-09", "2026-03-13", "approved", "Family trip.");
seedLeave("admin-1", "paid_time_off", "2026-06-01", "2026-06-01", "approved");
seedLeave("admin-1", "paid_time_off", "2026-10-26", "2026-10-27", "pending", "Please cover the deployment tasks.");
seedLeave("employee-1", "sick", "2026-09-14", "2026-09-14", "approved");
seedLeave("employee-4", "paid_time_off", "2026-08-24", "2026-08-25", "approved");
seedLeave("employee-3", "paid_time_off", "2026-10-19", "2026-10-21", "pending");

// About 45 days of history per active employee, with a few late, half-day and absent days
const SEED_HISTORY_DAYS = 45;
employees
  .filter((employee) => employee.status === "active")
  .forEach((employee, employeeIndex) => {
    for (let back = SEED_HISTORY_DAYS; back >= 1; back -= 1) {
      const date = localDate(new Date(Date.now() - back * DAY));
      if (date < employee.joiningDate) continue;
      if (!isWorkingDay(date) || onApprovedLeave(employee._id, date)) continue;

      const roll = (back * 7 + employeeIndex * 13) % 20;
      if (roll === 0) continue; // absent: no record

      const kind = roll <= 2 ? "late" : roll === 3 ? "half_day" : "present";
      const mode = (back + employeeIndex) % 4 === 0 ? "remote" : "office";
      const inMinute = kind === "late" ? 9 * 60 + 20 + (back % 25) : 8 * 60 + 45 + (back % 20);
      const outMinute = kind === "half_day" ? 12 * 60 + 30 : 17 * 60 + 45 + ((back * 3) % 45);
      const breakLength = kind === "half_day" ? 0 : 30 + (back % 2) * 15;
      const breakStart = 12 * 60 + 30 + (back % 3) * 15;

      const record = {
        _id: randomUUID(),
        employeeId: employee._id,
        date,
        checkIn: timeAt(date, inMinute),
        checkOut: timeAt(date, outMinute),
        breaks: breakLength
          ? [{
              start: timeAt(date, breakStart),
              end: timeAt(date, breakStart + breakLength),
              duration: breakLength,
            }]
          : [],
        totalBreakMinutes: breakLength,
        totalWorkedMinutes: 0,
        status: kind,
        mode,
        createdAt: timeAt(date, inMinute),
        updatedAt: timeAt(date, outMinute),
      };
      record.totalWorkedMinutes = workedMinutesOf(record);
      attendanceRecords.push(record);
    }
  });

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

// Every response carries `success`, plus the `data` / `message` the route sends
const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": res.req?.headers.origin || "http://localhost:5173",
    "Access-Control-Allow-Credentials": "true",
    ...headers,
  });
  res.end(JSON.stringify({ success: status < 400, ...body }));
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

// Reads ?page and ?limit and returns the slice plus pagination info
const paginate = (items, searchParams, defaultLimit, maxLimit) => {
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || defaultLimit, 1), maxLimit);
  return {
    items: items.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(Math.ceil(items.length / limit), 1),
    },
  };
};

/* ----------------------------- Department helpers ------------------------- */

// Turns "developer" into "engineering" and trims/lowercases the value
const normalizeDepartment = (value) => {
  const key = String(value ?? "").trim().toLowerCase();
  return DEPARTMENT_ALIASES[key] ?? key;
};

const isDepartment = (slug) => departments.some((department) => department.slug === slug);

const departmentSlugs = () => departments.map((department) => department.slug);

const departmentName = (slug) => departments.find((d) => d.slug === slug)?.name || slug;

const defaultDepartment = () =>
  isDepartment("engineering") ? "engineering" : departments[0]?.slug ?? "engineering";

const slugify = (name) =>
  String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const uniqueSlug = (name) => {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  while (departments.some((department) => department.slug === slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

// Adds the head of department and live counts to a department
const withStats = (department) => {
  const members = employees.filter((e) => e.department === department.slug);
  const departmentTasks = tasks.filter((t) => t.department === department.slug);
  const head = employees.find((e) => e._id === department.headId);
  return {
    ...department,
    head: head ? { _id: head._id, name: head.name, avatar: head.avatar } : null,
    memberCount: members.length,
    taskCount: departmentTasks.length,
    openTaskCount: departmentTasks.filter((t) => t.status !== "done").length,
  };
};

// Returns [statusCode, message] on failure, or null when everything is valid.
const validateDepartmentBody = (body, currentId = null) => {
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return [400, "Department name cannot be empty."];
    if (name.length > 50) return [400, "Department name must be 50 characters or fewer."];
    if (!slugify(name)) return [400, "Department name must contain letters or numbers."];
    const duplicate = departments.some(
      (d) => d._id !== currentId && d.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) return [409, "A department with that name already exists."];
  }
  if (body.description !== undefined && String(body.description).length > 500) {
    return [400, "Description must be 500 characters or fewer."];
  }
  if (body.color !== undefined && !/^#[0-9a-fA-F]{6}$/.test(String(body.color))) {
    return [400, "Color must be a hex value like #6366f1."];
  }
  if (body.headId && !employees.some((e) => e._id === body.headId)) {
    return [404, "Head of department was not found."];
  }
  return null;
};

/* ------------------------------- Task helpers ----------------------------- */

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

// Returns [statusCode, message] on failure, or null when everything is valid.
const validateTaskBody = (body) => {
  if (body.status !== undefined && !TASK_STATUSES.includes(body.status)) {
    return [400, `Status must be one of: ${TASK_STATUSES.join(", ")}.`];
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    return [400, `Priority must be one of: ${PRIORITIES.join(", ")}.`];
  }
  if (body.department !== undefined && !isDepartment(normalizeDepartment(body.department))) {
    return [400, `Department must be one of: ${departmentSlugs().join(", ")}.`];
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

/* ------------------------------ Dashboard helpers ------------------------- */

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
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
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
        department: defaultDepartment(),
        status: "active",
        presence: "Available",
        bio: "",
        avatar: "",
        joiningDate: localDate(),
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
      const department = normalizeDepartment(searchParams.get("department") || "");
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
      const departmentSlug = normalizeDepartment(body.department);
      if (!isDepartment(departmentSlug)) {
        send(response, 400, { message: `Department must be one of: ${departmentSlugs().join(", ")}.` });
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
        department: departmentSlug,
        status: body.status === "inactive" ? "inactive" : "active",
        presence: "Available",
        bio: body.bio || "",
        avatar: body.avatar || "",
        joiningDate: body.joiningDate || localDate(),
        createdAt: now(),
      };
      employees.push(employee);
      addActivity("join", "New member joined", departmentName(employee.department));
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
      if (body.department !== undefined) {
        const departmentSlug = normalizeDepartment(body.department);
        if (!isDepartment(departmentSlug)) {
          send(response, 400, { message: `Department must be one of: ${departmentSlugs().join(", ")}.` });
          return;
        }
        employee.department = departmentSlug;
      }
      ["name", "role", "status", "bio", "avatar", "joiningDate"].forEach((field) => {
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

    /* ---------------------------- Departments ----------------------------- */
    // List: any signed-in user (the task and employee forms need it for dropdowns)
    if (request.method === "GET" && pathname === "/api/departments") {
      if (!requireUser(request, response)) return;
      const search = (searchParams.get("search") || "").trim().toLowerCase();
      const filtered = departments
        .filter((department) =>
          !search ||
          department.name.toLowerCase().includes(search) ||
          department.description.toLowerCase().includes(search))
        .sort((a, b) => a.name.localeCompare(b.name));
      const { items, pagination } = paginate(filtered, searchParams, 100, 200);
      send(response, 200, { data: { departments: items.map(withStats), pagination } });
      return;
    }

    // Create: admin only
    if (request.method === "POST" && pathname === "/api/departments") {
      const user = requireAdmin(request, response);
      if (!user) return;
      const body = await readBody(request);

      if (!body.name || !String(body.name).trim()) {
        send(response, 400, { message: "Department name is required." });
        return;
      }
      const invalid = validateDepartmentBody(body);
      if (invalid) {
        send(response, invalid[0], { message: invalid[1] });
        return;
      }

      const name = String(body.name).trim();
      const department = {
        _id: randomUUID(),
        name,
        slug: uniqueSlug(name),
        description: body.description ? String(body.description).trim() : "",
        color: body.color || "#6366f1",
        headId: body.headId || null,
        createdAt: now(),
        updatedAt: now(),
      };
      departments.push(department);
      addActivity("create", `${user.name.split(" ")[0]} created department`, department.name);
      send(response, 201, { data: withStats(department) });
      return;
    }

    const departmentMatch = pathname.match(/^\/api\/departments\/([^/]+)$/);

    // Single department with its members
    if (departmentMatch && request.method === "GET") {
      if (!requireUser(request, response)) return;
      const department = departments.find((item) => item._id === departmentMatch[1]);
      if (!department) {
        send(response, 404, { message: "Department not found." });
        return;
      }
      const members = employees
        .filter((e) => e.department === department.slug)
        .map(teamMember);
      send(response, 200, { data: { ...withStats(department), members } });
      return;
    }

    // Update: admin only. PUT and PATCH behave the same and accept partial bodies.
    if (departmentMatch && (request.method === "PUT" || request.method === "PATCH")) {
      const user = requireAdmin(request, response);
      if (!user) return;
      const department = departments.find((item) => item._id === departmentMatch[1]);
      if (!department) {
        send(response, 404, { message: "Department not found." });
        return;
      }
      const body = await readBody(request);
      const invalid = validateDepartmentBody(body, department._id);
      if (invalid) {
        send(response, invalid[0], { message: invalid[1] });
        return;
      }

      if (body.name !== undefined) department.name = String(body.name).trim();
      if (body.description !== undefined) department.description = String(body.description).trim();
      if (body.color !== undefined) department.color = body.color;
      if (body.headId !== undefined) department.headId = body.headId || null;
      department.updatedAt = now();

      send(response, 200, { data: withStats(department) });
      return;
    }

    // Delete: admin only, blocked while people or tasks still use it
    if (departmentMatch && request.method === "DELETE") {
      const user = requireAdmin(request, response);
      if (!user) return;
      const index = departments.findIndex((item) => item._id === departmentMatch[1]);
      if (index === -1) {
        send(response, 404, { message: "Department not found." });
        return;
      }
      const department = departments[index];
      const memberCount = employees.filter((e) => e.department === department.slug).length;
      const taskCount = tasks.filter((t) => t.department === department.slug).length;

      if (memberCount > 0 || taskCount > 0) {
        const parts = [];
        if (memberCount) parts.push(`${memberCount} ${memberCount === 1 ? "member" : "members"}`);
        if (taskCount) parts.push(`${taskCount} ${taskCount === 1 ? "task" : "tasks"}`);
        send(response, 409, {
          message: `Cannot delete "${department.name}": it still has ${parts.join(" and ")}. Move them to another department first.`,
        });
        return;
      }

      departments.splice(index, 1);
      addActivity("update", `${user.name.split(" ")[0]} deleted department`, department.name);
      send(response, 200, { message: "Department deleted." });
      return;
    }

    /* ------------------------------ Attendance ---------------------------- */
    // Today's state for the signed-in employee (drives the clock-in card)
    if (request.method === "GET" && pathname === "/api/attendance/today") {
      const user = requireUser(request, response);
      if (!user) return;
      const date = localDate();
      const record = findAttendance(user._id, date);
      send(response, 200, {
        data: {
          ...(record ? serializeAttendance(record) : emptyToday(user._id, date)),
          onLeave: onApprovedLeave(user._id, date),
          holiday: holidayOn(date)?.name || null,
          config: ATTENDANCE_CONFIG,
        },
      });
      return;
    }

    // History table: ?month=2026-05&status=late&mode=remote&page=1&limit=6
    if (request.method === "GET" && pathname === "/api/attendance") {
      const user = requireUser(request, response);
      if (!user) return;
      const month = searchParams.get("month");
      const status = searchParams.get("status");
      const mode = searchParams.get("mode");
      if (month && !isValidMonth(month)) {
        send(response, 400, { message: "Month must look like 2026-05." });
        return;
      }
      if (status && !ATTENDANCE_STATUSES.includes(status)) {
        send(response, 400, { message: `Status must be one of: ${ATTENDANCE_STATUSES.join(", ")}.` });
        return;
      }
      if (mode && !ATTENDANCE_MODES.includes(mode)) {
        send(response, 400, { message: `Mode must be one of: ${ATTENDANCE_MODES.join(", ")}.` });
        return;
      }

      const at = new Date();
      const filtered = attendanceRecords
        .filter((record) =>
          record.employeeId === user._id &&
          (!month || record.date.startsWith(month)) &&
          (!status || record.status === status) &&
          (!mode || record.mode === mode))
        .sort((a, b) => b.date.localeCompare(a.date));
      const { items, pagination } = paginate(filtered, searchParams, 10, 100);
      send(response, 200, { data: { records: items.map((record) => historyRow(record, at)), pagination } });
      return;
    }

    // Monthly summary cards
    if (request.method === "GET" && pathname === "/api/attendance/summary") {
      const user = requireUser(request, response);
      if (!user) return;
      const month = searchParams.get("month") || currentMonth();
      if (!isValidMonth(month)) {
        send(response, 400, { message: "Month must look like 2026-05." });
        return;
      }
      send(response, 200, { data: buildSummary(user, month) });
      return;
    }

    // Calendar dots
    if (request.method === "GET" && pathname === "/api/attendance/calendar") {
      const user = requireUser(request, response);
      if (!user) return;
      const month = searchParams.get("month") || currentMonth();
      if (!isValidMonth(month)) {
        send(response, 400, { message: "Month must look like 2026-05." });
        return;
      }
      send(response, 200, { data: buildCalendar(user._id, month) });
      return;
    }

    // Clock in. The employee and the time always come from the server.
    if (request.method === "POST" && pathname === "/api/attendance/check-in") {
      const user = requireUser(request, response);
      if (!user) return;
      const body = await readBody(request);
      const mode = body.mode ?? "office";
      if (!ATTENDANCE_MODES.includes(mode)) {
        send(response, 400, { message: `Mode must be one of: ${ATTENDANCE_MODES.join(", ")}.` });
        return;
      }

      const t = new Date();
      const date = localDate(t);
      if (findAttendance(user._id, date)) {
        send(response, 409, { message: "You have already checked in today." });
        return;
      }
      if (onApprovedLeave(user._id, date)) {
        send(response, 409, { message: "You are on approved leave today." });
        return;
      }

      const minutesAfterStart = localMinutesOfDay(t) - toMinutes(ATTENDANCE_CONFIG.workStartTime);
      const record = {
        _id: randomUUID(),
        employeeId: user._id,
        date,
        checkIn: t.toISOString(),
        checkOut: null,
        breaks: [],
        totalBreakMinutes: 0,
        totalWorkedMinutes: 0,
        status: minutesAfterStart > ATTENDANCE_CONFIG.lateAfterMinutes ? "late" : "present",
        mode,
        createdAt: t.toISOString(),
        updatedAt: t.toISOString(),
      };
      attendanceRecords.push(record);
      send(response, 201, { message: "Checked in successfully.", data: serializeAttendance(record, t) });
      return;
    }

    // Clock out
    if (request.method === "POST" && pathname === "/api/attendance/check-out") {
      const user = requireUser(request, response);
      if (!user) return;
      const t = new Date();
      const record = findAttendance(user._id, localDate(t));
      if (!record) {
        send(response, 409, { message: "You have not checked in today." });
        return;
      }
      if (record.checkOut) {
        send(response, 409, { message: "You have already checked out today." });
        return;
      }

      // End any running break first
      const running = activeBreak(record);
      if (running) {
        running.end = t.toISOString();
        running.duration = minutesBetween(running.start, running.end);
      }

      record.checkOut = t.toISOString();
      record.totalBreakMinutes = breakMinutesOf(record, t);
      record.totalWorkedMinutes = workedMinutesOf(record, t);
      if (record.totalWorkedMinutes < ATTENDANCE_CONFIG.halfDayMinutes) record.status = "half_day";
      record.updatedAt = t.toISOString();

      send(response, 200, { message: "Checked out successfully.", data: serializeAttendance(record, t) });
      return;
    }

    // Start a break
    if (request.method === "POST" && pathname === "/api/attendance/break/start") {
      const user = requireUser(request, response);
      if (!user) return;
      const t = new Date();
      const record = findAttendance(user._id, localDate(t));
      if (!record) {
        send(response, 409, { message: "You have not checked in today." });
        return;
      }
      if (record.checkOut) {
        send(response, 409, { message: "Your shift has already ended." });
        return;
      }
      if (activeBreak(record)) {
        send(response, 409, { message: "You are already on a break." });
        return;
      }
      record.breaks.push({ start: t.toISOString(), end: null, duration: 0 });
      record.updatedAt = t.toISOString();
      send(response, 200, { message: "Break started.", data: serializeAttendance(record, t) });
      return;
    }

    // End a break
    if (request.method === "POST" && pathname === "/api/attendance/break/end") {
      const user = requireUser(request, response);
      if (!user) return;
      const t = new Date();
      const record = findAttendance(user._id, localDate(t));
      const running = record && !record.checkOut ? activeBreak(record) : null;
      if (!running) {
        send(response, 409, { message: "You are not on a break." });
        return;
      }
      running.end = t.toISOString();
      running.duration = minutesBetween(running.start, running.end);
      record.totalBreakMinutes = breakMinutesOf(record, t);
      record.totalWorkedMinutes = workedMinutesOf(record, t);
      record.updatedAt = t.toISOString();
      send(response, 200, { message: "Break ended.", data: serializeAttendance(record, t) });
      return;
    }

    /* ------------------------ Attendance (admin only) --------------------- */
    // All employees: ?employeeId&department&status&mode&date&startDate&endDate&page&limit
    if (request.method === "GET" && pathname === "/api/admin/attendance") {
      if (!requireAdmin(request, response)) return;
      const employeeId = searchParams.get("employeeId");
      const department = normalizeDepartment(searchParams.get("department") || "");
      const status = searchParams.get("status");
      const mode = searchParams.get("mode");
      const date = searchParams.get("date");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      for (const [label, value] of [["date", date], ["startDate", startDate], ["endDate", endDate]]) {
        if (value && !isValidDateString(value)) {
          send(response, 400, { message: `${label} must look like 2026-05-26.` });
          return;
        }
      }
      if (status && !ATTENDANCE_STATUSES.includes(status)) {
        send(response, 400, { message: `Status must be one of: ${ATTENDANCE_STATUSES.join(", ")}.` });
        return;
      }
      if (mode && !ATTENDANCE_MODES.includes(mode)) {
        send(response, 400, { message: `Mode must be one of: ${ATTENDANCE_MODES.join(", ")}.` });
        return;
      }

      const at = new Date();
      const rows = attendanceRecords
        .map((record) => ({ record, employee: employees.find((e) => e._id === record.employeeId) }))
        .filter(({ record, employee }) =>
          employee &&
          (!employeeId || record.employeeId === employeeId) &&
          (!department || employee.department === department) &&
          (!status || record.status === status) &&
          (!mode || record.mode === mode) &&
          (!date || record.date === date) &&
          (!startDate || record.date >= startDate) &&
          (!endDate || record.date <= endDate))
        .sort((a, b) => b.record.date.localeCompare(a.record.date) || a.employee.name.localeCompare(b.employee.name));
      const { items, pagination } = paginate(rows, searchParams, 20, 100);

      send(response, 200, {
        data: {
          records: items.map(({ record, employee }) => ({
            ...historyRow(record, at),
            employee: {
              _id: employee._id,
              name: employee.name,
              avatar: employee.avatar,
              department: employee.department,
            },
          })),
          pagination,
        },
      });
      return;
    }

    // Company-wide numbers for one day (defaults to today)
    if (request.method === "GET" && pathname === "/api/admin/attendance/summary") {
      if (!requireAdmin(request, response)) return;
      const date = searchParams.get("date") || localDate();
      if (!isValidDateString(date)) {
        send(response, 400, { message: "date must look like 2026-05-26." });
        return;
      }
      const active = employees.filter((e) => e.status === "active" && e.joiningDate <= date);
      const records = active
        .map((e) => findAttendance(e._id, date))
        .filter(Boolean);
      const onLeave = active.filter(
        (e) => !findAttendance(e._id, date) && onApprovedLeave(e._id, date),
      ).length;
      const working = isWorkingDay(date);

      send(response, 200, {
        data: {
          date,
          isWorkingDay: working,
          totalEmployees: active.length,
          presentToday: records.length,
          lateToday: records.filter((r) => r.status === "late").length,
          remoteToday: records.filter((r) => r.mode === "remote").length,
          onLeaveToday: onLeave,
          absentToday: working ? active.length - records.length - onLeave : 0,
        },
      });
      return;
    }

    /* -------------------------------- Leave ------------------------------- */
    // The signed-in employee's requests, upcoming holidays and PTO balance
    if (request.method === "GET" && pathname === "/api/leaves/my") {
      const user = requireUser(request, response);
      if (!user) return;
      const status = searchParams.get("status");
      if (status && !LEAVE_STATUSES.includes(status)) {
        send(response, 400, { message: `Status must be one of: ${LEAVE_STATUSES.join(", ")}.` });
        return;
      }
      const today = localDate();
      send(response, 200, {
        data: {
          leaves: leaves
            .filter((leave) => leave.employeeId === user._id && (!status || leave.status === status))
            .sort((a, b) => b.startDate.localeCompare(a.startDate))
            .map(leaveWithEmployee),
          upcomingHolidays: holidays.filter((holiday) => holiday.date >= today).slice(0, 5),
          pto: ptoStats(user._id),
        },
      });
      return;
    }

    // Request leave
    if (request.method === "POST" && pathname === "/api/leaves") {
      const user = requireUser(request, response);
      if (!user) return;
      const body = await readBody(request);

      if (!LEAVE_TYPES.includes(body.type)) {
        send(response, 400, { message: `Type must be one of: ${LEAVE_TYPES.join(", ")}.` });
        return;
      }
      const startDate = body.startDate;
      const endDate = body.endDate || body.startDate;
      if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
        send(response, 400, { message: "Start and end dates must look like 2026-06-01." });
        return;
      }
      if (endDate < startDate) {
        send(response, 400, { message: "End date cannot be before the start date." });
        return;
      }
      if (startDate < localDate() && body.type !== "sick") {
        send(response, 400, { message: "Start date cannot be in the past." });
        return;
      }
      if (body.handoverNote !== undefined && String(body.handoverNote).length > 1000) {
        send(response, 400, { message: "Handover note must be 1000 characters or fewer." });
        return;
      }

      const days = countWorkingDays(startDate, endDate);
      if (days === 0) {
        send(response, 400, { message: "The selected dates contain no working days." });
        return;
      }
      const overlaps = leaves.some(
        (leave) =>
          leave.employeeId === user._id &&
          ["pending", "approved"].includes(leave.status) &&
          leave.startDate <= endDate &&
          startDate <= leave.endDate,
      );
      if (overlaps) {
        send(response, 409, { message: "You already have a leave request for these dates." });
        return;
      }
      if (body.type === "paid_time_off") {
        const { available } = ptoStats(user._id, Number(startDate.slice(0, 4)));
        if (days > available) {
          send(response, 400, {
            message: `Not enough PTO balance. You have ${available} ${available === 1 ? "day" : "days"} available.`,
          });
          return;
        }
      }

      const leave = {
        _id: randomUUID(),
        employeeId: user._id,
        type: body.type,
        startDate,
        endDate,
        days,
        handoverNote: body.handoverNote ? String(body.handoverNote).trim() : "",
        status: "pending",
        approvedBy: null,
        reviewedAt: null,
        createdAt: now(),
        updatedAt: now(),
      };
      leaves.push(leave);
      send(response, 201, { message: "Leave request submitted.", data: leaveWithEmployee(leave) });
      return;
    }

    // All leave requests: admin only
    if (request.method === "GET" && pathname === "/api/leaves") {
      if (!requireAdmin(request, response)) return;
      const status = searchParams.get("status");
      const employeeId = searchParams.get("employeeId");
      if (status && !LEAVE_STATUSES.includes(status)) {
        send(response, 400, { message: `Status must be one of: ${LEAVE_STATUSES.join(", ")}.` });
        return;
      }
      const filtered = leaves
        .filter((leave) => (!status || leave.status === status) && (!employeeId || leave.employeeId === employeeId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const { items, pagination } = paginate(filtered, searchParams, 20, 100);
      send(response, 200, { data: { leaves: items.map(leaveWithEmployee), pagination } });
      return;
    }

    const leaveActionMatch = pathname.match(/^\/api\/leaves\/([^/]+)\/(cancel|review)$/);

    // Cancel your own request
    if (leaveActionMatch && leaveActionMatch[2] === "cancel" && request.method === "PATCH") {
      const user = requireUser(request, response);
      if (!user) return;
      const leave = leaves.find((item) => item._id === leaveActionMatch[1]);
      if (!leave) {
        send(response, 404, { message: "Leave request not found." });
        return;
      }
      if (leave.employeeId !== user._id) {
        send(response, 403, { message: "You can only cancel your own leave requests." });
        return;
      }
      const cancellable =
        leave.status === "pending" || (leave.status === "approved" && leave.startDate > localDate());
      if (!cancellable) {
        send(response, 409, { message: "This leave request can no longer be cancelled." });
        return;
      }
      leave.status = "cancelled";
      leave.updatedAt = now();
      send(response, 200, { message: "Leave request cancelled.", data: leaveWithEmployee(leave) });
      return;
    }

    // Approve or reject: admin only. Body: { "status": "approved" | "rejected" }
    if (leaveActionMatch && leaveActionMatch[2] === "review" && request.method === "PATCH") {
      const admin = requireAdmin(request, response);
      if (!admin) return;
      const leave = leaves.find((item) => item._id === leaveActionMatch[1]);
      if (!leave) {
        send(response, 404, { message: "Leave request not found." });
        return;
      }
      const { status } = await readBody(request);
      if (!["approved", "rejected"].includes(status)) {
        send(response, 400, { message: "Status must be approved or rejected." });
        return;
      }
      if (leave.status !== "pending") {
        send(response, 409, { message: "Only pending requests can be reviewed." });
        return;
      }
      leave.status = status;
      leave.approvedBy = admin._id;
      leave.reviewedAt = now();
      leave.updatedAt = now();
      const owner = employees.find((e) => e._id === leave.employeeId);
      addActivity("update", `${admin.name.split(" ")[0]} ${status} leave for`, owner?.name || "an employee");
      send(response, 200, { message: `Leave request ${status}.`, data: leaveWithEmployee(leave) });
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
      const department = normalizeDepartment(searchParams.get("department") || "");
      const projectId = searchParams.get("projectId");
      const assigneeId = searchParams.get("assigneeId");
      const search = (searchParams.get("search") || "").toLowerCase();

      const filtered = tasks
        .filter((task) =>
          (!status || task.status === status) &&
          (!priority || task.priority === priority) &&
          (!department || task.department === department) &&
          (!projectId || task.projectId === projectId) &&
          (!assigneeId || task.assigneeIds.includes(assigneeId)) &&
          (!search || task.title.toLowerCase().includes(search)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const { items, pagination } = paginate(filtered, searchParams, 100, 200);
      send(response, 200, { data: { tasks: items.map(withNames), pagination } });
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
        department: body.department ? normalizeDepartment(body.department) : defaultDepartment(),
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
      if (body.department !== undefined) task.department = normalizeDepartment(body.department);
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
        send(response, 200, { data: { tasks: [], projects: [], people: [], departments: [] } });
        return;
      }
      send(response, 200, {
        data: {
          tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5).map(withNames),
          projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5),
          people: employees.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 5).map(teamMember),
          departments: departments
            .filter((d) => d.name.toLowerCase().includes(q))
            .slice(0, 5)
            .map(({ _id, name, slug, color }) => ({ _id, name, slug, color })),
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