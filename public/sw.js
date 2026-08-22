// Service Worker do FORJA — a única missão dele é garantir que o app sempre
// busque a versão mais nova direto do servidor, mesmo quando instalado na
// tela inicial do celular (onde o cache costuma travar mais).

self.addEventListener("install", (event) => {
  // Assume o controle imediatamente, sem esperar todas as abas fecharem.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Sempre tenta buscar fresco da rede primeiro. Só usa algo salvo em cache
  // como último recurso, se o dispositivo estiver de fato sem internet.
  event.respondWith(
    fetch(event.request, { cache: "no-store" }).catch(() => caches.match(event.request))
  );
});
