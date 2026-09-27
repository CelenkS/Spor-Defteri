// Spor Defteri - service worker (basit çevrimdışı önbellek)
var CACHE_NAME = 'spor-defteri-v1';
var APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  var req = event.request;
  if (req.method !== 'GET') return; // Firestore/Auth çağrıları vs. dokunma

  // Uygulama kabuğu (aynı origin, navigasyon/HTML/CSS gibi) -> cache-first, arka planda güncelle
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  event.respondWith(
    caches.match(req).then(function(cached){
      var networkFetch = fetch(req).then(function(res){
        if (sameOrigin && res && res.ok){
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        }
        return res;
      }).catch(function(){ return cached; });
      // varsa önce önbellekten dön (hızlı açılış), arka planda ağdan tazele
      return cached || networkFetch;
    })
  );
});
