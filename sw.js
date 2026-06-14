/* sw.js — Service Worker */
const CACHE = 'venilda-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './musica.mp3',
  './audio.ogg',
  './beijo.jpeg',
  './foto1.jpg',
  './foto2.jpg',
  './foto3.jpg',
  './foto4.jpg',
  './foto5.jpg',
  './foto6.jpg',
  './foto7.jpg',
  './foto8.jpg',
  './foto9.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
