importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('todo').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/css/main.css',
       '/css/font-awesome.min.css',
       '/js/main.js',
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
