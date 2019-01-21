/**
 * Service worker setup.
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker
        .register('/sw.js', {
            scope: '/'
        })
        .then(reg => console.log('ServiceWorker registration successful: ' + reg.scope))
        .catch(error => console.log('ServiceWorker registration failed: ' + error)));
}
