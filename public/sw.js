const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/assets/moment-with-locales.min.js',
  '/assets/hebcal.noloc.min.js',
  '/script.js',
  '/fonts/sbl/sbl.css',
  '/fonts/assistant/assistant.css',
  '/script.js',
  '/assets/icons/logo-128.png',
  '/fonts/sbl/SBL_Hbrw.ttf',
  '/fonts/assistant/assistant.hebrew.400.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

const DYNAMIC_CACHE_NAME = 'site-dynamic-cache-v1';
self.addEventListener('fetch', (event) => {
  caches.match(event.request)
    .then((response) => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(() => {
              caches.put(event.request, responseToCache);
            });

          return response;
        });
    });
  return event.respondWith(fetch(event.request));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.forEach((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});
