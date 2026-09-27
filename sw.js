// Spor Defteri - service worker (basit çevrimdışı önbellek)
// v2: aynı origin dosyalar için "önce ağ, olmazsa önbellek" (network-first) —
// böylece her deploy sonrası site her zaman en güncel halini gösterir,
// sadece internet yokken önbellekteki son bilinen haline düşer.
var CACHE_NAME = 'spor-defteri-v2';
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
  if (req.method !== 'GET') return; // Firestore/Auth/AI çağrılarına dokunma

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return; // başka origin'ler (fontlar, Firebase, Anthropic) doğrudan ağdan

  event.respondWith(
    fetch(req).then(function(res){
      if (res && res.ok){
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req);
    })
  );
});
