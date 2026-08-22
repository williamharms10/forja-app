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
  // Só mexe em pedidos GET (não interfere em nada que grava dados, tipo POST).
  if (event.request.method !== "GET") return;

  // Constrói o pedido do zero, sem reaproveitar o objeto original — alguns
  // navegadores (Safari incluso) às vezes ignoram o "no-store" quando ele vem
  // junto de um Request já pronto, então evitamos essa ambiguidade aqui.
  const url = event.request.url;
  event.respondWith(
    fetch(url, { cache: "no-store" }).catch(() => caches.match(event.request))
  );
});
