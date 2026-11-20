import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE_NAME = "teamSyncSession";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Hash a password with a cryptographically random salt using Node's scrypt. */
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/** Compare a password against the stored salt:hash value in constant time. */
export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string" || !storedHash.includes(":")) {
    return false;
  }

  const [salt, encodedKey] = storedHash.split(":");
  const actualKey = await scrypt(password, salt, 64);
  const expectedKey = Buffer.from(encodedKey, "hex");

  return (
    expectedKey.length === actualKey.length &&
    timingSafeEqual(expectedKey, actualKey)
  );
}

/** Remove credential material before returning an employee to an API client. */
export function toPublicEmployee(employee) {
  return Object.fromEntries(
    Object.entries(employee).filter(([key]) => key !== "passwordHash"),
  );
}

/** Parse request cookies without depending on a framework. */
export function parseCookies(request) {
  return Object.fromEntries(
    (request.headers.cookie || "")
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const [name, ...value] = part.trim().split("=");
        return [name, decodeURIComponent(value.join("="))];
      }),
  );
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getAuthenticatedUser(request, data) {
  const sessionId = parseCookies(request)[SESSION_COOKIE_NAME];
  const employeeId = data.sessions[sessionId];

  return data.employees.find(
    (employee) => employee._id === employeeId && employee.status === "active",
  );
}

export function serializeSessionCookie(
  sessionId,
  maxAge = SESSION_MAX_AGE_SECONDS,
  isProduction = false,
) {
  const secureFlag = isProduction ? "; Secure" : "";

  return `${SESSION_COOKIE_NAME}=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

export async function createSession(user, data, persist, isProduction) {
  const sessionId = randomBytes(32).toString("hex");
  data.sessions[sessionId] = user._id;
  await persist("sessions");

  return serializeSessionCookie(sessionId, SESSION_MAX_AGE_SECONDS, isProduction);
}
