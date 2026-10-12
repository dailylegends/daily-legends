/* Service worker do Daily Legends. A versão muda a cada build: o app mostra "Nova versão, toque pra atualizar". */
const VERSAO = '2026.10.12-1811';
const CACHE = 'dl-' + VERSAO;
const ARQUIVOS = ["./", "index.html", "config.js", "manifest.webmanifest", "vendor/three.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS.map(u=>new Request(u, { cache:'reload' })))));
  // não chama skipWaiting: espera o jogador tocar no aviso de nova versão
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dl-') && k!==CACHE && k!=='dl-fontes').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message', e=>{ if (e.data && e.data.tipo==='atualizar') self.skipWaiting(); });

self.addEventListener('fetch', e=>{
  const req=e.request; if (req.method!=='GET') return;
  const url=new URL(req.url);
  // fontes do Google: guarda na primeira vez
  if (url.hostname==='fonts.googleapis.com' || url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open('dl-fontes').then(c=>c.match(req).then(r=> r || fetch(req).then(res=>{ if (res.ok || res.type==='opaque') c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin!==self.location.origin) return; // Google login/Drive/Sheets: sempre direto na rede
  // config.js: rede primeiro (pra troca do Client ID valer na hora), cache se estiver sem internet
  if (url.pathname.endsWith('/config.js')){
    e.respondWith(fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req, cp)); return res; }).catch(()=>caches.match(req, { ignoreSearch:true })));
    return;
  }
  // página do jogo (inclusive a volta do login, que traz #token): versão guardada, funciona offline
  if (req.mode==='navigate'){
    e.respondWith(caches.match('./', { cacheName:CACHE }).then(r=> r || caches.match('index.html', { cacheName:CACHE })).then(r=> r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch:true }).then(r=> r || fetch(req)));
});
