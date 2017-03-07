importScripts('cache-polyfill.js');

self.addEventListener('install', function(e) {
  self.skipWaiting();
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
    caches.open('todo').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
        return response || fetchPromise;
      });
    })
  );
});
