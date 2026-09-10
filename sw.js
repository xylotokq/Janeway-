const CACHE="kyle-fit-v10-0-1-full";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png","./xiaochou.jpg?v=1001"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request).then(cached=>{
   const network=fetch(e.request).then(r=>{
     const clone=r.clone();
     caches.open(CACHE).then(c=>c.put(e.request,clone));
     return r;
   }).catch(()=>cached);
   return cached||network;
 }));
});