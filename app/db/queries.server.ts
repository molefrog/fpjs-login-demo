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

/*
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
 * @param visitorId - the unique browser/visitor identifier
 */
export async function logFailedLoginAttempt(
  email: string,
  visitorId: string
): Promise<void> {
  const db = await openDB();

  await db.run(
    "INSERT INTO login_attempts (email, visitor_id, created_at) VALUES (?, ?, ?)",
    email,
    visitorId,
    Date.now()
  );
}

const openDB = async () => {
  return await open({
    filename: "./app/db/db.sqlite",
    driver: sqlite3.Database,
  });
};
