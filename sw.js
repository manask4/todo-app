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
    event.respondWith(
        fetch(event.request).then(function(response) {
            caches.open('todo').then(function(cache) {
                cache.put(event.request, response);
            });
            return response.clone();
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
