const TEST_APP_CACHE_NAME = "test-app-cache-name";

const toCache = ["/", "/styles.css", "/index.js"];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(TEST_APP_CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(toCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
