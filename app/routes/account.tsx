import { Link } from "@remix-run/react";

export default function Account() {
  return (
    <section>
      <h3>We're glad to have you back!</h3>
      <p>Enjoy all the premium features of this website.</p>
      <br />

      <Link to="/login">← Back to Login</Link>
    </section>
  );
}
