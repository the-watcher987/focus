/* FOCUS calendar relay — a tiny Cloudflare Worker you own.
   It fetches ONLY Google Calendar iCal links and hands them to FOCUS,
   so your secret link never passes through a stranger's server.

   Deploy: dash.cloudflare.com → Workers & Pages → Create → Worker → paste this → Deploy.
   Optional but recommended: Settings → Variables → add a secret named KEY (any long random text),
   then use  https://<your-worker>.workers.dev/?key=<that text>  as the relay address in FOCUS. */
export default {
  async fetch(request, env) {
    const cors = {"access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS"};
    if (request.method === "OPTIONS") return new Response(null, {headers: cors});
    const u = new URL(request.url);
    if (env.KEY && u.searchParams.get("key") !== env.KEY) return new Response("Forbidden", {status: 403, headers: cors});
    const target = u.searchParams.get("url") || "";
    if (!/^https:\/\/calendar\.google\.com\/calendar\/ical\//.test(target)) return new Response("Only Google Calendar iCal links are allowed.", {status: 400, headers: cors});
    const r = await fetch(target, {headers: {"user-agent": "FOCUS-relay"}});
    return new Response(await r.text(), {status: r.status, headers: {...cors, "content-type": "text/calendar; charset=utf-8", "cache-control": "no-store"}});
  }
};
