/**
 * Service worker.
 */

const CACHE_NAME = 'mws-restaurant-review-static-v1';
const urlsToCache = [
    'index.html',
    'restaurant.html',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'js/register.js',
    'css/styles.css',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'data/restaurants.json',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

// Worker setup.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .catch(error => console.error('Installing the ServiceWorker: ' + error.message))
    );
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames =>
            Promise.all(cacheNames.filter(cacheName =>
                cacheName.startsWith('mws-') && cacheName !== CACHE_NAME
            ).map(cacheName => caches.delete(cacheName)))
        )
    );
});

const cacheWhitelist = [CACHE_NAME];

// Activate Service worker and delete old cache (if any) add new cache.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});


// Intercept all request and match against the cache to respond properly.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest)
                .then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseToCache))
                        .catch(error => console.error('ServiceWorker, fetch, opening cache: ' + error.message));

                    return response;
                });
        })
        .catch(error => console.error('ServiceWorker, fetch: ' + error.message))
    );
});