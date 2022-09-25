import { open } from "sqlite";
import sqlite3 from "sqlite3";

/*
 * The `users` table DB schema
 */
interface User {
  id: number;
  email: string;
  password: string;
  username: string;
}

/*
 * Loads user that matches the email and password provided
 */
export async function findUserByCredentials(email: string, password: string) {
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

const openDB = async () => {
  return await open({
    filename: "./app/db/db.sqlite",
    driver: sqlite3.Database,
  });
};
