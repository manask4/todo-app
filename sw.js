importScripts('cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('todo').then(function(cache) {
     return cache.addAll([
       '/todo-app/',
       '/todo-app/index.html',
       '/todo-app/css/main.css',
       '/todo-app/css/font-awesome.min.css',
       '/todo-app/js/main.js',
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
