const CACHE="kyle-fit-v10-3-1-full";
const ASSETS=["./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png","./xiaochou.jpg?v=1031"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith("kyle-fit")).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const req=e.request;
  const html=req.mode==="navigate"||(req.headers.get("accept")||"").includes("text/html");
  if(html){
    e.respondWith(fetch(req,{cache:"no-store"}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{
    const x=r.clone();caches.open(CACHE).then(c=>c.put(req,x));return r;
  })));
});