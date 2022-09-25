export default function Login() {
  return (
    <section>
      <h3>Please Log In</h3>
      <p>
        Hi and welcome back! Please enter your email and password to proceed.
      </p>

      <form>
        <p>
          <label>Email</label>
          <br />
          <input type="email" name="email" autoFocus />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input type="password" name="password" />
        </p>
        <p>
          <small>
            We deeply care about the privacy of our users. You can rest assured
            that your data <b>never gets leaked</b>.
          </small>
        </p>

        <p>
          <button>
            <dd>Log In</dd>
          </button>
        </p>
      </form>
    </section>
  );
}
