const cacheName = 'pwa-demo-v2';

const baseUrl = "https://58821a93.ngrok.io"; //Todo: dynamic

const filesToCache = [
    '/',
    '/storage',
    '/pushnotification',
    '/camera',
    '/geolocation',
    '/morefeatures',
    '/images/refresh.svg',
    '/images/pwa.png',
    '/images/push-off.png',
    '/images/push-on.png'
]

// Install Service Worker
self.addEventListener('install', function(event){
    console.log('Service Worker: Installing....');

    event.waitUntil(
        // fetch dynamic filename which need to be cache
        fetch(baseUrl+"/api/files").then(function(response){
            return response.json()
        }).then(function(content){
            // adding required files 
            filesToCache.push(content.data["index.css"])
            filesToCache.push(content.data["manifest.js"])
            filesToCache.push(content.data["lib.js"])
            filesToCache.push(content.data["index.js"])
            return caches.open(cacheName)
        }).then(function(cache){
            console.log('Service Worker: Caching App Shell at the moment......');
            // Add Files to the Cache
            return cache.addAll(filesToCache);
        }).catch(function(e){
            console.log(e)
        })
    )
})

// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if( key !== cacheName) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.clients.claim()

self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});



// triggered everytime, when a push notification is received.
self.addEventListener('push', function(event) {

    console.info('Event: Push', event);

    event.waitUntil(
        // Unable to access dynamic message content while app opened. To handle such situation this api is created
        // this api will return last push notification template. based on this notification send while app opened
        // if Our app running in background. You can get dynamic message without this event
        fetch(baseUrl+"/api/notifytemplate")
        .then(function(fetchResponse){ 
            return fetchResponse.json();
        })
        .then(function(response) {
            console.log(response, response.data.title)
            // Important event.waituntill is required - if u remove this, u will get "this site updated in background message" it is default message from push notification
            event.waitUntil(self.registration.showNotification(response.data.title, response.data.options))
        })
        .catch(function(e){
            console.log(e)
        })
    )

});


self.addEventListener('notificationclick', function(event) {

var url = './index.html';

event.notification.close(); //Close the notification

// Open the app and navigate to latest.html after clicking the notification
event.waitUntil(
    clients.openWindow(url)
);

});