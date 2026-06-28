const clearDineEaseCaches = async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(clearDineEaseCaches());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearDineEaseCaches()
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => Promise.all(clients.map((client) => client.navigate(client.url))))
  );
});

self.addEventListener('fetch', () => {});
