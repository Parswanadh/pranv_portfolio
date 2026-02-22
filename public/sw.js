const CACHE_NAME = 'portfolio-v1'
const urlsToCache = [
  '/',
  '/projects',
  '/agents',
  '/about',
  '/contact',
  '/resume',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'no-cache' })))
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      // Only cache GET requests
      if (event.request.method !== 'GET') {
        return fetch(event.request)
      }

      // Network first, then cache strategy
      return fetch(event.request)
        .then((response) => {
          // Clone response before caching
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
        })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})
