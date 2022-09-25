import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <nav>
      <Link to="/login">Login</Link> <Link to="/account">Account</Link>
    </nav>
  );
}
