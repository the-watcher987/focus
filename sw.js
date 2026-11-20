/* FOCUS service worker: works offline and shows reminder notifications.
   Bump VERSION when you upload a new index.html so phones pick it up. */
const VERSION = "focus-v4";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png"];
const CDN = ["https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs", "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).then(() => Promise.allSettled(CDN.map(u => c.add(u))))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Never cache Google sign-in, APIs or calendar data
  if (/googleapis\.com|accounts\.google\.com|calendar\.google\.com|workers\.dev|corsproxy|allorigins/.test(url.hostname + url.pathname)) return;
  if (url.origin === location.origin) {
    // network first for the app itself (so updates show up), cache as fallback offline
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
  } else if (url.hostname === "cdn.jsdelivr.net") {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res; })));
  }
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    for (const c of list) if ("focus" in c) { c.navigate?.("./#/calendar/agenda"); return c.focus(); }
    return self.clients.openWindow("./#/calendar/agenda");
  }));
});
