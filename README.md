# Preventing credential stuffing attacks

In this demo we're going to explore how [FingerpringJS Pro](https://fingerprint.com/) can easily help you to protect your website or web service 
against automated [credential stuffing attacks](https://auth0.com/resources/whitepapers/credential-stuffing-attacks). To to so, we're going to 
build a simple login form experience with a server-side request throttling based on the current [`visitorId`](https://dev.fingerprint.com/docs/js-agent#visitorid).

Why is this important? Almost every app on the Web starts with a login form. Although, developers have being doing this for years, it's always hard 
to build a bulletproof and secure login and session management in your apps. User credentials are [being leaked](https://haveibeenpwned.com/) all 
the time, mature businesses are not the exceptions.

What you'll learn in this tutoral:
- How to build a simple login form with Remix and React
- How to implement a basic login attemps logging
- How to use Fingerprint's [React integration](https://github.com/fingerprintjs/fingerprintjs-pro-react) to get the current browser identifier
- How to implement request throttling based on that identifier

## 1. Getting Started
Let's bootstrap our app! 

We're going to use [Remix](https://remix.run/) – a React framework which is currently getting a nice adoption in the 
web community. Remix uses a slightly different approach from other isomorphic React toolkits utilizing a concept of loaders and actions. 
It might sound a bit complicated, but please bear with me, it's going to be fun!

```bash
# let's bootstrap a basic Remix app
npx create-remix@latest login-app
```

👉 **[Commit](https://github.com/molefrog/fpjs-login-demo/commit/106167647f78c06520dd83ccaef239ab1387e096)**

## 2. Shaping Up Our Login Form

It's nice to start with some fake implementation first, so we can focus on the real logic later on. While it's always fun to write CSS, for 
the prototype I recommend using something that doesn't require much configuration (like classeless CSS framework [new.css](https://newcss.net/)).

👉 **[Commit](https://github.com/molefrog/fpjs-login-demo/commit/3285d1153486f4fdd92176f7ce016e7ae1db9130)**

Remix provides a handy component `Form` for form submission and `useTransition` hook that we're going to use for a loader. 

```tsx
import { useTransition, Form } from "@remix-run/react";

const transition = useTransition();

// Transitions in Remix represent the navigation state
// That's how we know if the form is being sumbitted or not
const isLoading = transition.state !== "idle";

return (
  <Form method="post" action="/login">
    {/* form fields and loading indicator */}
  </Form>
)
```

Next, let's implement fake form submission: it's will only accept one hardcoded email and return an error otherwise.

```tsx
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const username = data.get("email") as string;

  // login successful!
  if (username === "admin@example.com") {
    return redirect("/account");
  }

  return json<FormResponse>({
    errorMessage: "Bad luck, please try different login or password!"
  });
};
```

👉 **[Commit](https://github.com/molefrog/fpjs-login-demo/commit/4e3edd4717c6409e321730a275d64b87a509c126)**

## 3. Wiring It Up

Alright, now it's time to implement a real authentication which will rely on email and password stored in a database. To do that, we're going to 
create a SQLite database and provision it with some users. Let's initialize a new database file and create `users` table. Tip: to speed things up, use a GUI client like SQLPro. 

```bash
CREATE TABLE "users" (
  "id" integer PRIMARY KEY NOT NULL,
  "email" char(128) NOT NULL,
  "password" char(128) NOT NULL,
  "username" char(128) NOT NULL
)
```

> ⚠️ Warning: while in this particular example we use passwords as-is, you should never ever store passwords in plain text! 
> Always rely on hashed and salted values instead. [Read this](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
> for more information.

Now when a request comes in we just need to find if that email-password pair matches any 
record in our database:

```tsx 
// routes/index.tsx
import { findUserByCredentials } from "../db/queries.server";

// loader
export const action: ActionFunction = async ({ request }) => {
  // ... extract email and password from FormData

  const user = await findUserByCredentials(email, password);

  if (!user) {
    // no user found, respond with an error message
    return json<FormResponse>({
      errorMessage: "Bad luck, please try different login or password!"
    });
  }

  // respond with a redirect
}
```

You might notice that the file we're importing `findUserByCredentials` from is called `queries.server.ts`. That is a special [naming convention
Remix](https://remix.run/docs/en/v1/guides/constraints) uses to exclude server-side code from the bundle when it can't automatically prune it
(the library `sqlite` we're using can only be used within Node). 

👉 **[Commit](https://github.com/molefrog/fpjs-login-demo/commit/408ab58842e84b38030a2d0ec6a6445ab40068e9)**
