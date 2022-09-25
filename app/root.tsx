import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

// Remix doesn't include server env variables in the bundle by default so we have to
// pass it to the browser via loader.
//
// See: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
export function loader() {
  return json({ FPJS_API_KEY: process.env.FPJS_API_KEY });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "🥷 Secure Website",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { FPJS_API_KEY } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />

        {/*
          We use so-called "classless" CSS framework for the sake of the demo.
          It has some nice defaults that doesn't require any custom CSS.
        */}
        <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
        />
        <link rel="stylesheet" href="https://newcss.net/theme/night.css" />
      </head>
      <body>
        {/* The header is the same for all app routes */}
        <header>
          <h1>🥷 Secure Website</h1>
        </header>

        {/* 
          By wrapping the <Outlet /> with <FpjsProvider /> we ensure that all routes
          in our app can properly access Fingerprint's API
        */}
        <FpjsProvider loadOptions={{ apiKey: FPJS_API_KEY }}>
          <Outlet />
        </FpjsProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
