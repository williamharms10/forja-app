function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function docRef(key) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  return db.collection("users").doc(user.uid).collection("data").doc(key);
}

async function storageGet(key) {
  const snap = await docRef(key).get();
  if (!snap.exists) return null;
  return snap.data().value;
}

async function storageSet(key, value) {
  await docRef(key).set({ value, updatedAt: Date.now() });
}

async function loadKey(key, fallback) {
  try {
    const raw = await storageGet(key);
    if (raw) return JSON.parse(raw);
    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    await storageSet(key, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao salvar", key, e);
  }
}

function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function fmtDate(d) {
  const today = dateKey(new Date());
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const k = dateKey(d);
  if (k === today) return "Hoje";
  if (k === dateKey(y)) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
