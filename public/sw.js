// Service Worker for caching and performance optimization
const CACHE_NAME = 'authencore-v1';
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/final-logo.png',
  '/src/assets/final-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_RESOURCES))
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests for static assets
  if (event.request.method === 'GET' && 
      (event.request.url.includes('/assets/') || 
       event.request.url.includes('/images/') ||
       event.request.url.endsWith('.png') ||
       event.request.url.endsWith('.jpg') ||
       event.request.url.endsWith('.svg'))) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});