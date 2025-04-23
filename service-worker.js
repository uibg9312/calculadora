// service-worker.js

const CACHE_NAME = 'titan-cache-v1'; // Cambia 'v1' si actualizas los archivos cacheados
const urlsToCache = [
  '/', // Si tu servidor sirve index.html en la raíz
  '/index.html', // El HTML principal
  // '/style.css', // Si tuvieras CSS externo
  // '/script.js', // Si tuvieras JS externo
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // ¡OJO! No puedes cachear directamente recursos de CDNs como Tailwind o Inter font
  // Para offline completo con esos, necesitarías descargarlos y servirlos localmente.
];

// Evento 'install': Se dispara cuando el navegador instala el SW.
// Aquí es donde generalmente cacheamos los archivos estáticos principales.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto:', CACHE_NAME);
        // addAll toma un array de URLs, las busca, y las añade al cache.
        // Si alguna falla, toda la operación falla.
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la página pide un recurso (HTML, CSS, JS, imagen...).
// Aquí interceptamos la petición y decidimos si servir desde el caché o desde la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) // Busca en el caché si ya tenemos la respuesta
      .then(response => {
        // Si encontramos la respuesta en el caché, la devolvemos.
        if (response) {
          return response;
        }
        // Si no está en el caché, vamos a la red a buscarla.
        return fetch(event.request);
      }
    )
  );
});
