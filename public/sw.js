var CACHE_NAME = 'site-cache-v1';
var urlsToCache = [
  '/',
  '/style.css',
  '/assets/jquery-1.11.3.min.js',
  '/assets/jquery.unparam.min.js',
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

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

var DYNAMIC_CACHE_NAME = 'site-dynamic-cache-v1';
self.addEventListener('fetch', function (event) {
  caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then(function (response) {
          // Validate that the response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(function () {
              caches.put(event.request, responseToCache);
            });

          return response;
        });
    });
  return event.respondWith(fetch(event.request));
});

self.addEventListener('activate', function (event) {
  // console.log('Activating the Service Worker ', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            // console.log('Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});
