/**
 * Service worker.
 */

const staticCacheName = 'mws-restaurant-review-static-v1';
const filesToCache = [
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
        caches.open(staticCacheName)
        .then(cache => cache.addAll(filesToCache))
        .catch(error => {
            console.error('Installing the service worker: ' + error.message);
            console.error(error);
        })
    );
});


// Activate Service worker and delete old cache (if any) add new cache.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames =>
            Promise.all(cacheNames.filter(cacheName =>
                cacheName.startsWith('mws-') && cacheName !== staticCacheName
            ).map(cacheName => caches.delete(cacheName)))
        )
    );
});

// Intercept all request and match against the cache to respond properly.
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
            return response ||
                caches.open(staticCacheName).then(cache =>
                    fetch(event.request).then(response => {
                        if (response.status === 404) {
                            return new Response("Page not found.")
                        }
                        return response;
                    })
                )
        })
        // Falback, if cache and network fail.
        .catch(() =>
            new Response("You seems to be offline, and we didn't find any old cache for the URL.")
        )
    );
});