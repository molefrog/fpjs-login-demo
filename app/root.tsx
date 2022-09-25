import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "🥷 Secure Website",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
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

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
