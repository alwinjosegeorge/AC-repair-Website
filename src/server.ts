import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  checkDatabaseHealth,
  insertBookingToDatabase,
  fetchBookingsFromDatabase,
  fetchCustomersFromDatabase,
} from "./lib/db";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const CORS_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
};

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Handle preflight OPTIONS
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check endpoint
    if (url.pathname === "/api/health") {
      try {
        const health = await checkDatabaseHealth();
        return new Response(JSON.stringify(health), {
          status: health.ok ? 200 : 503,
          headers: CORS_HEADERS,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // Bookings API endpoint
    if (url.pathname === "/api/bookings") {
      if (request.method === "GET") {
        try {
          const bookings = await fetchBookingsFromDatabase();
          return new Response(JSON.stringify({ success: true, bookings }), {
            headers: CORS_HEADERS,
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), {
            status: 500,
            headers: CORS_HEADERS,
          });
        }
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();
          const result = await insertBookingToDatabase(body);
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 400,
            headers: CORS_HEADERS,
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
            status: 400,
            headers: CORS_HEADERS,
          });
        }
      }
    }

    // Customers API endpoint
    if (url.pathname === "/api/customers" && request.method === "GET") {
      try {
        const customers = await fetchCustomersFromDatabase();
        return new Response(JSON.stringify({ success: true, customers }), {
          headers: CORS_HEADERS,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
