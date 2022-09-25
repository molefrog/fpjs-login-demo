import { ActionFunction, json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useTransition,
  useLoaderData,
} from "@remix-run/react";

import { delay } from "../utils/delay";
import { findUserByCredentials } from "../db/queries.server";

// describes the reponse type of the action
interface FormResponse {
  errorMessage: string;
  errorCode: LoginErrorCode;
}

enum LoginErrorCode {
  wrongCredentials,
  securityAlert,
}

export const action: ActionFunction = async ({ request }) => {
  // An artificial delay for the demonstration purposes
  await delay(1000);

  const data = await request.formData();

  const user = await findUserByCredentials(
    data.get("email") as string,
    data.get("password") as string
  );

  // no such user found, return an error
  if (!user) {
    return json<FormResponse>({
      errorMessage: "Bad luck, please try different login or password!",
      errorCode: LoginErrorCode.wrongCredentials,
    });
  }

  return redirect("/account");
};

// returns a formatted error icon based on the error code
const formatErrorIcon = (errorCode?: LoginErrorCode) => {
  switch (errorCode) {
    case LoginErrorCode.wrongCredentials:
      return "⛔️";

    case LoginErrorCode.securityAlert:
      return "⚠️";
  }

  return "";
};

export default function Login() {
  const formResponse = useActionData<FormResponse>();
  const transition = useTransition();

  // Transitions in Remix represent the navigation state
  // That's how we know if the form is being sumbitted or not
  const isLoading = transition.state !== "idle";

  return (
    <section>
      <h3>Please Log In</h3>
      <p>
        Hi and welcome back! Please enter your email and password to proceed.
      </p>

      {/* Display an error message if there is anything returned from the action */}
      {formResponse && (
        <blockquote>
          {formatErrorIcon(formResponse.errorCode)} {formResponse.errorMessage}
        </blockquote>
      )}

      <Form method="post" action="/login">
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
            👌 We deeply care about the privacy of our users. You can rest
            assured that your data <b>never gets leaked</b>.
          </small>
        </p>

        <p>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : <dd>Log In</dd>}
          </button>
        </p>
      </Form>
    </section>
  );
}
