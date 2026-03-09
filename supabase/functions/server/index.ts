// Entrypoint for Supabase CLI (expects index.ts). Strips /functions/v1/server from path so app routes match.
import { app } from "./index.tsx";

// Supabase may pass path as /functions/v1/server/... or /server/...; strip so app sees /make-server-283466b6/...
const PREFIXES = ["/functions/v1/server", "/server"];

const handler = (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let path = url.pathname;
  for (const pre of PREFIXES) {
    if (path.startsWith(pre)) {
      path = path.slice(pre.length) || "/";
      break;
    }
  }
  if (path !== url.pathname) {
    const newUrl = new URL(path + url.search, url.origin);
    const newReq = new Request(newUrl.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
      duplex: "half",
    });
    return app.fetch(newReq);
  }
  return app.fetch(req);
};

Deno.serve(handler);
