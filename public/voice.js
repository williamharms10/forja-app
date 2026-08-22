/* ---------------- ASSISTENTE DE VOZ "FORJA" ---------------- */

const voiceState = {
  supported: false,
  listening: false,
  lastHeard: "",
  lastResponse: "",
  showTextFallback: false,
  textInput: "",
};

let recognitionInstance = null;

function initVoiceRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceState.supported = !!SR;
  if (!SR) return;
  recognitionInstance = new SR();
  recognitionInstance.lang = "pt-BR";
  recognitionInstance.continuous = false;
  recognitionInstance.interimResults = false;
  recognitionInstance.maxAlternatives = 1;

  recognitionInstance.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceState.lastHeard = transcript;
    voiceState.listening = false;
    handleVoiceCommand(transcript);
    render();
  };
  recognitionInstance.onerror = () => {
    voiceState.listening = false;
    voiceState.lastResponse = "Não consegui ouvir direito. Tenta de novo, ou usa o campo de texto abaixo.";
    render();
  };
  recognitionInstance.onend = () => {
    voiceState.listening = false;
    render();
  };
}

function startVoiceListening() {
  if (!recognitionInstance) return;
  voiceState.listening = true;
  voiceState.lastHeard = "";
  render();
  try {
    recognitionInstance.start();
  } catch (e) {
    voiceState.listening = false;
    render();
  }
}

function stopVoiceListening() {
  if (recognitionInstance) recognitionInstance.stop();
  voiceState.listening = false;
  render();
}

function speak(text) {
  voiceState.lastResponse = text;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 1.02;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // silencioso — se a síntese falhar, a resposta ainda aparece escrita na tela
  }
}

/* ---------------- INTERPRETAÇÃO DE COMANDOS ---------------- */

function stripForjaPrefix(text) {
  const n = normalize(text);
  const cleaned = n.replace(/^(e[ıi]?\s+)?forja[,.]?\s*/i, "").trim();
  return cleaned || n;
}

function findBestFoodMatch(spokenText) {
  const words = normalize(spokenText).split(/\s+/).filter((w) => w.length > 2);
  let best = null, bestScore = 0;
  FOOD_DB.forEach((f) => {
    const nameWords = normalize(f.name).split(/\s+/);
    let score = 0;
    words.forEach((w) => { if (nameWords.some((nw) => nw.includes(w) || w.includes(nw))) score++; });
    if (score > bestScore) { bestScore = score; best = f; }
  });
  return bestScore > 0 ? best : null;
}

function extractGrams(text) {
  const m = normalize(text).match(/(\d+)\s*(gramas?|g)\b/);
  return m ? Number(m[1]) : 100;
}

function extractNumber(text) {
  const m = text.replace(",", ".").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

async function handleVoiceCommand(rawText) {
  const cmd = stripForjaPrefix(rawText);

  // --- Comer / registrar alimento ---
  if (/\b(comi|comer|comendo|almocei|jantei)\b/.test(cmd)) {
    const food = findBestFoodMatch(cmd);
    if (!food) {
      speak(`Não achei esse alimento na nossa base. Tenta ser mais específico, tipo "Forja, comi arroz".`);
      render();
      return;
    }
    const grams = extractGrams(cmd);
    const f = grams / 100;
    const meal = {
      id: uid(), name: "Registrado por voz",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      calories: Math.round(food.kcal * f), protein: Math.round(food.protein * f),
      carb: Math.round(food.carb * f), fat: Math.round(food.fat * f),
      items: [{ name: food.name, grams }],
    };
    await updateMeals([...state.meals, meal]);
    speak(`Beleza! Registrei ${grams} gramas de ${food.name}, ${meal.calories} calorias.`);
    render();
    return;
  }

  // --- Beber água ---
  if (/\b(bebi|tomei|beber)\b.*\bagua\b|^\bagua\b/.test(cmd)) {
    let ml = 250;
    if (/\d+\s*(ml|mililitros?)\b/.test(cmd)) {
      const n = extractNumber(cmd);
      if (n) ml = n;
    } else if (/meio litro/.test(cmd)) {
      ml = 500;
    } else if (/\blitros?\b/.test(cmd)) {
      ml = 1000;
    } else if (/\bcopo\b/.test(cmd)) {
      ml = 250;
    } else {
      const n = extractNumber(cmd);
      if (n) ml = n;
    }
    await updateWater(state.water + ml);
    speak(`Anotado! Mais ${ml} mililitros de água. Você já tomou ${state.water} de ${state.config.waterGoal} hoje.`);
    render();
    return;
  }

  // --- Registrar peso ---
  if (/\bpeso\b/.test(cmd)) {
    const n = extractNumber(cmd);
    if (!n) {
      speak("Não entendi o valor do peso. Tenta assim: Forja, meu peso é 80 quilos.");
      render();
      return;
    }
    await saveKey(`weight:${dk()}`, { kg: n });
    await updateConfig({ currentWeight: n });
    if (state.progressLoaded) {
      const idx = state.weightHistory.findIndex((h) => h.date === dk());
      if (idx >= 0) state.weightHistory[idx].kg = n;
    }
    speak(`Peso registrado: ${n} quilos.`);
    render();
    return;
  }

  // --- Iniciar treino ---
  if (/\b(treino|come[cç]ar treino|iniciar treino)\b/.test(cmd)) {
    const match = state.plans.find((p) => normalize(p.name).includes(cmd.replace(/treino/g, "").trim())) ||
      state.plans.find((p) => cmd.includes(normalize(p.name).split(" ")[1] || "___"));
    if (!match) {
      speak(`Não achei esse treino. Você tem: ${state.plans.map((p) => p.name).join(", ")}.`);
      render();
      return;
    }
    state.tab = "treino";
    startPlan(match);
    speak(`Começando o ${match.name}. Bora treinar!`);
    return;
  }

  // --- Resumo do dia ---
  if (/\b(resumo|como estou|status|meu dia)\b/.test(cmd)) {
    const totals = mealTotals();
    const sp = setsProgress();
    speak(`Hoje você já tomou ${state.water} mililitros de água, comeu ${Math.round(totals.cal)} calorias, e completou ${sp.done} de ${sp.total} séries no treino. Sua sequência é de ${state.streak} dias.`);
    render();
    return;
  }

  speak(`Não entendi esse comando. Você pode dizer, por exemplo: "Forja, comi arroz com frango", "Forja, bebi 300 mililitros de água", ou "Forja, resumo do dia".`);
  render();
}

/* ---------------- BOTÃO FLUTUANTE + PAINEL ---------------- */
function voiceWidgetHTML() {
  return `
    <div id="voice-widget" style="position:fixed;right:16px;bottom:76px;z-index:20;display:flex;flex-direction:column;align-items:flex-end;gap:8px;max-width:calc(100vw - 32px);">
      ${voiceState.lastResponse ? `
        <div style="background:var(--surface);border:1px solid var(--accent-energy);border-radius:12px;padding:10px 12px;max-width:260px;font-size:12px;color:var(--text);box-shadow:0 8px 20px rgba(0,0,0,0.4);">
          ${escapeHtml(voiceState.lastResponse)}
        </div>` : ""}
      ${voiceState.showTextFallback ? `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px;display:flex;gap:6px;box-shadow:0 8px 20px rgba(0,0,0,0.4);">
          <input id="voice-text-input" data-model="voiceTextInput" value="${escapeHtml(voiceState.textInput)}" placeholder='Ex: Forja, comi arroz' style="width:190px;" />
          <button data-action="submit-voice-text" style="background:var(--accent-energy);color:#14161A;border:none;border-radius:8px;padding:0 12px;font-weight:800;">Ir</button>
        </div>` : ""}
      <div style="display:flex;gap:8px;">
        <button data-action="toggle-voice-text-fallback" class="icon-btn" title="Digitar comando" style="width:40px;height:40px;border-radius:50%;background:var(--surface);">
          ${icon("pencil", 15)}
        </button>
        <button data-action="toggle-voice-listen" title="Falar com a FORJA" style="width:52px;height:52px;border-radius:50%;background:${voiceState.listening ? "var(--accent-energy)" : "var(--surface)"};border:2px solid var(--accent-energy);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,0.4);">
          ${micIconSVG(voiceState.listening)}
        </button>
      </div>
    </div>`;
}

function micIconSVG(active) {
  const color = active ? "#14161A" : "var(--accent-energy)";
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
}

function attachVoiceEvents() {
  const root = document.getElementById("root");
  const listenBtn = document.querySelector('[data-action="toggle-voice-listen"]');
  if (listenBtn) {
    listenBtn.addEventListener("click", () => {
      if (!voiceState.supported) {
        voiceState.showTextFallback = true;
        voiceState.lastResponse = "Seu navegador não suporta o microfone aqui — usa o campo de texto abaixo mesmo, funciona igual.";
        render();
        return;
      }
      if (voiceState.listening) stopVoiceListening();
      else startVoiceListening();
    });
  }
  const textToggle = document.querySelector('[data-action="toggle-voice-text-fallback"]');
  if (textToggle) {
    textToggle.addEventListener("click", () => {
      voiceState.showTextFallback = !voiceState.showTextFallback;
      render();
    });
  }
  const submitBtn = document.querySelector('[data-action="submit-voice-text"]');
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const input = document.getElementById("voice-text-input");
      const text = input ? input.value.trim() : "";
      if (!text) return;
      voiceState.textInput = "";
      handleVoiceCommand(text);
    });
  }
  const textInput = document.getElementById("voice-text-input");
  if (textInput) {
    textInput.addEventListener("input", (e) => { voiceState.textInput = e.target.value; });
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const text = textInput.value.trim();
        if (!text) return;
        voiceState.textInput = "";
        handleVoiceCommand(text);
      }
    });
  }
}
