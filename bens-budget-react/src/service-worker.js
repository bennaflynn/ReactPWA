var doCache = false;

var CACHE_NAME = 'budget-cache';

self.addEventListener('activate', event => {
    const currentCachelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList => 
                Promise.all(keyList.map(key => {
                    if(!currentCachelist.includes(key)) {
                        return caches.delete(key);
                    }
                })))
    );
});

//user starts the app
self.addEventListener('install', (event) => {
    if(doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    fetch('assets-manifest.json')
                        .then(response => {
                            response.json();
                        })
                        .then(assets => {
                            const urlsToCache = [
                            '/',
                            '/newuser',
                            '/finances',
                            '/newflow',
                            '/all',
                            'BitchinBudgeter.png',
                            'garbage.png',
                            'hamburger.png',
                            'loading.png',
                            'X.png',
                            assets['app.js']
                            ];
                            cache.addAll(urlsToCache);
                        })
                })
        )
    }
})
self.addEventListener('fetch', (event) => {
    if(doCache) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});