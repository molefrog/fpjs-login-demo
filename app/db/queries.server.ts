import { open } from "sqlite";
import sqlite3 from "sqlite3";

// The `users` table DB schema
interface User {
  id: number;
  email: string;
  password: string;
  username: string;
}

// The `login_attempts` table DB schema
interface LoginAttempt {
  id: number;
  email: string;
  visitor_id?: string;
  created_at: number;
}

/**
 * Loads user that matches the email and password provided
 */
export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | undefined> {
  const db = await openDB();

  return await db.get<User>(
    "SELECT * FROM users WHERE email = (?) AND password = (?)",
    email,
    // NOTE: for educational purposes only!
    //
    // You should never-ever store plaintext passwords in your database.
    // For real-world applications, consider using salted password hashing (e.g. `bcrypt`)
    password
  );
}

/**
 * Creates new `login_attempt` record in the DB
 *
 * @param email - email used for authentication
 * @param visitorId? - the unique browser/visitor identifier, can be empty when identification
 * wasn't successful
 */
export async function logFailedLoginAttempt(
  email: string,
  visitorId?: string
): Promise<void> {
  const db = await openDB();

  await db.run(
    "INSERT INTO login_attempts (email, visitor_id, created_at) VALUES (?, ?, ?)",
    email,
    visitorId || null,
    Date.now()
  );
}

interface ThrottlingOptions {
  // no more than `maxAttempts` within a `periodMins` time window
  maxAttempts: number;
  periodMins: number;
}

/**
 * Checks if the number of allowed sign in attempts has been exceeded
 *
 * @param visitorId - unique identifier of the actor performing the sign in
 * @param options - throttling settings
 */
export async function shouldThrottleLoginRequest(
  visitorId: string,
  options: ThrottlingOptions = { maxAttempts: 5, periodMins: 5 }
): Promise<boolean> {
  const db = await openDB();

  // when does the throttling window start
  const startTime = Date.now() - options.periodMins * 60 * 1000;

  // get the number of failed login attempts for the current visitor
  const row = await db.get<{ numAttempts: number }>(
    `SELECT count(*) as numAttempts FROM login_attempts 
      WHERE visitor_id = (?) AND created_at > (?)`,
    visitorId,
    startTime
  );

  // threshold exceeded
  if (Number(row?.numAttempts) > options.maxAttempts) {
    return true;
  }

  return false;
}

const openDB = async () => {
  return await open({
    filename: "./app/db/db.sqlite",
    driver: sqlite3.Database,
  });
};
