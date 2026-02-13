const CACHE = 'faultnet-static-e7c5660c';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.e7c5660c.webp',
  '/fonts/roboto-400.woff2',
  '/fonts/roboto-700.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async url => {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res && res.ok) await cache.put(url, res.clone());
      } catch (err) {
        console.warn('SW: failed to fetch and cache', url, err && err.message);
      }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  })());
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        return await fetch(req);
      } catch (err) {
        console.warn('SW: navigation fetch failed, serving fallback', err && err.message);
        return await caches.match('/index.html');
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      return await fetch(req);
    } catch (err) {
      console.warn('SW: fetch failed for', req.url, err && err.message);
      return new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});

self.addEventListener('error', e => {
  console.error('ServiceWorker error', e && e.message);
});

self.addEventListener('unhandledrejection', e => {
  console.error('ServiceWorker unhandledrejection', e && (e.reason || e.reason && e.reason.message));
});
