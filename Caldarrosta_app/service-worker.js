// Service Worker per Caldarrosta - Permette all'app di funzionare offline

const CACHE_NAME = 'caldarrosta-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json'
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aperto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Rimuovo vecchia cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercetta le richieste di rete
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - restituisci la risposta dalla cache
                if (response) {
                    return response;
                }
                
                // Clona la richiesta
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then((response) => {
                    // Controlla se abbiamo ricevuto una risposta valida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clona la risposta
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Gestione notifiche push (per futuro utilizzo)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Hai ricevuto un nuovo messaggio!',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjAiIGZpbGw9IiNmZjAwNjYiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyMS4zNUwxMC41NSAyMC4wM0M1LjQgMTUuMzYgMiAxMi4yOCAyIDguNUMyIDUuNDIgNC40MiAzIDcuNSAzQzkuMjQgMyAxMC45MSAzLjgxIDEyIDUuMTlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgM0MxOS41OCAzIDIyIDUuNDIgMjIgOC41QzIyIDEyLjI4IDE4LjYgMTUuMzYgMTMuNDUgMjAuMDRMMTIgMjEuMzVaIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTIiIGZpbGw9IiNmZjAwNjYiLz4KPHN2ZyB4PSIxOCIgeT0iMTgiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyMS4zNUwxMC41NSAyMC4wM0M1LjQgMTUuMzYgMiAxMi4yOCAyIDguNUMyIDUuNDIgNC40MiAzIDcuNSAzQzkuMjQgMyAxMC45MSAzLjgxIDEyIDUuMTlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgM0MxOS41OCAzIDIyIDUuNDIgMjIgOC41QzIyIDEyLjI4IDE4LjYgMTUuMzYgMTMuNDUgMjAuMDRMMTIgMjEuMzVaIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        vibrate: [200, 100, 200],
        tag: 'caldarrosta-notification',
        renotify: true,
        actions: [
            {
                action: 'open',
                title: 'Apri App'
            },
            {
                action: 'close',
                title: 'Chiudi'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Caldarrosta 💕', options)
    );
});

// Gestione click sulle notifiche
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Messaggi tra Service Worker e client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Pulizia cache ogni 24 ore
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

console.log('Service Worker Caldarrosta caricato con successo! 💕');