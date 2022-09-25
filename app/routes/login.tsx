import { ActionFunction, json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useTransition,
  useLoaderData,
} from "@remix-run/react";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";

import { delay } from "../utils/delay";
import {
  findUserByCredentials,
  logFailedLoginAttempt,
} from "../db/queries.server";

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

  // parse form data provided
  const data = await request.formData();

  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const visitorId = data.get("visitorId") as string;

  const user = await findUserByCredentials(email, password);

  // no such user found, return an error
  if (!user) {
    await logFailedLoginAttempt(email, visitorId);

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

  // Get the current browser identifier
  const { isLoading: isVisitorIdLoading, data: visitorData } = useVisitorData();

  const visitorId = visitorData?.visitorId;

  // Transitions in Remix represent the navigation state
  // That's how we know if the form is being sumbitted or not
  const isSubmitting = transition.state !== "idle";

  // We can't use the form when there are unfinished async tasks
  const isLoading = isSubmitting || isVisitorIdLoading;

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
          <input type="email" name="email" autoFocus disabled={isLoading} />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input type="password" name="password" disabled={isLoading} />
        </p>

        <input type="hidden" name="visitorId" value={visitorId} />

        <p>
          <small>
            👌 We deeply care about the privacy of our users. You can rest
            assured that your data <b>never gets leaked</b>.
          </small>
        </p>

        <p>
          <button type="submit" disabled={isLoading}>
            {isSubmitting ? "Please wait..." : <dd>Log In</dd>}
          </button>
        </p>
      </Form>
    </section>
  );
}
