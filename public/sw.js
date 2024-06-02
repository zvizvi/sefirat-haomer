const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/script.js',
  '/fonts/sbl/sbl.css',
  '/script.js',
  '/assets/icons/logo-128.png',
  'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/locale/he.js',
  'https://cdn.jsdelivr.net/npm/hebcal@2.3/client/hebcal.noloc.min.js',
  'https://cdn.jsdelivr.net/gh/zvizvi/sefirat-haomer@sbl/public/fonts/sbl/SBL_Hbrw.ttf',
  'https://cdn.jsdelivr.net/gh/zvizvi/sefirat-haomer@sbl/public/fonts/sbl/SBL_Hbrw.eot',
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400..700&display=swap'
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
