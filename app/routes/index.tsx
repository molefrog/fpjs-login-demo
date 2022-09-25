import { redirect } from "@remix-run/node";

/*
 *  Always redirect to the login page
 * In a real application, you would probably want to implement a session support to
 * store the currently logged in user, check if it is present in the session and redirect
 * to the login page otherwise.
 *
 * Consider looking at Remix Sessions
 * https://remix.run/docs/en/v1/api/remix#sessions
 */
export async function loader() {
  return redirect("/login");
}

export default function Index() {
  return null;
}
