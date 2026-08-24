const DEFAULT_CONFIG = { waterGoal: 2500, calorieGoal: 2200, proteinGoal: 150, carbGoal: 220, fatGoal: 70, weightGoal: 0, currentWeight: 0, restSeconds: 60 };

const state = {
  user: null,
  selectedDate: new Date(),
  config: { ...DEFAULT_CONFIG },
  workout: [],
  meals: [],
  water: 0,
  streak: 0,
  plans: [],
  dayPlanName: null,
  tab: "resumo",
  showManager: false,
  extraLocalFilter: "Ambos",
  newPlanLocalFilter: "Ambos",
  showWorkoutGenForm: false,
  workoutGenForm: { objetivo: "Manutenção", local: "Ambos", dias: 3 },
  workoutGenResult: null,
  workoutRotation: null,
  rotationExpired: false,
  rotationInfo: null,
  showTreinoSettings: false,
  showExtraExerciseForm: false,
  showMealForm: false,
  showCustomFood: false,
  mealDraftItems: [],
  showAiForm: false,
  aiLoading: false,
  aiError: "",
  aiPlan: null,
  showNewPlanForm: false,
  newPlanDraftExercises: [],
  showGoalsEdit: false,
  showWaterGoalEdit: false,
  swapTarget: null,
  exerciseSwapTarget: null,
  exerciseMenuTarget: null,
  mealForm: { name: "" },
  customFood: { name: "", kcal: "", protein: "", carb: "", fat: "" },
  extraExerciseForm: { name: "", muscle: MUSCLES[0], sets: 3, reps: 10, weight: 0 },
  newPlanForm: { name: "", muscle: MUSCLES[0] },
  customWaterValue: "",
  aiForm: { objetivo: "Emagrecimento", peso: 70, metaPeso: "", altura: 170, idade: 30, sexo: "Feminino", atividade: "Leve (1-3x/sem)", refeicoes: 4, restricoes: "" },
  weightInput: "",
  showWeightGoalEdit: false,
  progressLoaded: false,
  progressLoading: false,
  weightHistory: [],
  trainingHistory: [],
};

function setPath(path, value) {
  const parts = path.split(".");
  let obj = state;
  for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
  obj[parts[parts.length - 1]] = value;
}
function getPath(path) {
  const parts = path.split(".");
  let obj = state;
  for (const p of parts) obj = obj == null ? undefined : obj[p];
  return obj;
}
function selectOptionsHTML(options, selectedValue) {
  return options.map((o) => `<option value="${o}" ${o === selectedValue ? "selected" : ""}>${o}</option>`).join("");
}


function dk() { return dateKey(state.selectedDate); }
function isToday() { return dk() === dateKey(new Date()); }

/* ---------------- BOOT ---------------- */
initVoiceRecognition();
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    state.user = null;
    renderLogin();
    return;
  }
  state.user = user;
  state.config = { ...DEFAULT_CONFIG, ...(await loadKey("config", {})) };
  const savedPlans = await loadKey("plans", null);
  if (savedPlans && savedPlans.length > 0) {
    // Adiciona os treinos padrão novos (ex: Casa, Pliometria, Alongamento) que ainda
    // não existem na lista salva, sem mexer nos treinos que a pessoa já personalizou.
    const existingIds = new Set(savedPlans.map((p) => p.id));
    const missingDefaults = DEFAULT_PLANS.filter((p) => !existingIds.has(p.id));
    state.plans = missingDefaults.length > 0 ? [...savedPlans, ...missingDefaults] : savedPlans;
    if (missingDefaults.length > 0) await saveKey("plans", state.plans);
  } else {
    state.plans = DEFAULT_PLANS;
    await saveKey("plans", DEFAULT_PLANS);
  }
  state.workoutRotation = await loadKey("workoutRotation", null);
  await loadDayData();
  await computeStreak();
  await loadProgressData();
  render();
});

const MAX_ROTATION_CYCLES = 10;

// Calcula qual treino vem a seguir com base na POSIÇÃO na sequência (não na data).
// Isso significa que pular dias sem abrir o app não "perde" treinos nem embaralha
// a ordem — o próximo treino sempre continua de onde parou.
function computeRotationPlanForPosition(position) {
  const rot = state.workoutRotation;
  if (!rot || !rot.active || !rot.planIds || rot.planIds.length === 0) return null;
  const len = rot.planIds.length;
  const cycleNumber = Math.floor(position / len) + 1;
  if (cycleNumber > MAX_ROTATION_CYCLES) return { expired: true, cycleNumber };
  const idx = position % len;
  const plan = state.plans.find((p) => p.id === rot.planIds[idx]);
  if (!plan) return null;
  return { plan, cycleNumber, dayInCycle: idx + 1, totalDays: len };
}

async function loadDayData() {
  const key = dk();
  const ag = await loadKey(`water:${key}`, { ml: 0 });
  state.water = ag.ml || 0;

  const dp = await loadKey(`dayplan:${key}`, null);
  state.rotationExpired = false;
  state.rotationInfo = null;

  if (dp) {
    state.dayPlanName = dp.name;
    state.workout = await loadKey(`workout:${key}`, []);
  } else if (state.workoutRotation && state.workoutRotation.active) {
    const position = state.workoutRotation.position || 0;
    const rotResult = computeRotationPlanForPosition(position);
    if (rotResult && rotResult.expired) {
      state.dayPlanName = null;
      state.workout = [];
      state.rotationExpired = true;
    } else if (rotResult && rotResult.plan) {
      const defaultSets = rotResult.plan.genSets || 3;
      const defaultReps = rotResult.plan.genReps || 10;
      const seededWorkout = rotResult.plan.exercises.map((ex) => {
        const numSets = ex.sets || defaultSets;
        const numReps = ex.reps || defaultReps;
        return {
          id: uid(), name: ex.name, muscle: ex.muscle,
          sets: Array.from({ length: numSets }, () => ({ reps: numReps, weight: 0, done: false })),
        };
      });
      state.workout = seededWorkout;
      state.dayPlanName = rotResult.plan.name;
      state.rotationInfo = rotResult;
      await saveKey(`workout:${key}`, seededWorkout);
      await saveKey(`dayplan:${key}`, { name: rotResult.plan.name });
      // Só avança a posição quando um treino NOVO é gerado pra esse dia — abrir
      // o app várias vezes no mesmo dia não pula treinos da sequência.
      state.workoutRotation = { ...state.workoutRotation, position: position + 1 };
      await saveKey("workoutRotation", state.workoutRotation);
    } else {
      state.dayPlanName = null;
      state.workout = [];
    }
  } else {
    state.dayPlanName = null;
    state.workout = await loadKey(`workout:${key}`, []);
  }

  // Dieta: se esse dia específico ainda não tem refeições salvas, semeia a partir
  // da dieta fixa (o template gerado em "Gerar dieta automaticamente"), se existir.
  const dietRaw = await storageGet(`diet:${key}`);
  if (dietRaw !== null) {
    state.meals = JSON.parse(dietRaw);
  } else {
    const fixedDiet = await loadKey("fixedDiet", null);
    if (fixedDiet && fixedDiet.meals && fixedDiet.meals.length > 0) {
      const seeded = fixedDiet.meals.map((m) => ({
        ...m, id: uid(), items: (m.items || []).map((it) => ({ ...it })),
      }));
      state.meals = seeded;
      await saveKey(`diet:${key}`, seeded);
    } else {
      state.meals = [];
    }
  }
}

async function computeStreak() {
  let count = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i++) {
    const key = dateKey(cursor);
    const rec = await loadKey(`water:${key}`, null);
    if (i === 0 && key === dk()) {
      if (state.water >= state.config.waterGoal) count++; else break;
    } else if (rec && rec.ml >= state.config.waterGoal) {
      count++;
    } else break;
    cursor.setDate(cursor.getDate() - 1);
  }
  state.streak = count;
}

async function loadProgressData() {
  state.progressLoading = true;
  render();
  const days = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 29);
  for (let i = 0; i < 30; i++) {
    days.push(dateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  const weightEntries = await Promise.all(days.map((d) => loadKey(`weight:${d}`, null)));
  const workoutEntries = await Promise.all(days.map((d) => loadKey(`workout:${d}`, [])));

  state.weightHistory = days.map((d, i) => ({ date: d, kg: weightEntries[i] ? weightEntries[i].kg : null }));
  state.trainingHistory = days.map((d, i) => {
    const w = workoutEntries[i] || [];
    let setsDone = 0, setsTotal = 0;
    w.forEach((ex) => ex.sets.forEach((s) => { setsTotal++; if (s.done) setsDone++; }));
    return { date: d, exercises: w.length, setsDone, setsTotal };
  });

  const todayEntry = state.weightHistory.find((h) => h.date === dk());
  state.weightInput = todayEntry && todayEntry.kg != null ? String(todayEntry.kg) : "";

  state.progressLoaded = true;
  state.progressLoading = false;
  render();
}

async function changeDay(delta) {
  const d = new Date(state.selectedDate);
  d.setDate(d.getDate() + delta);
  if (d > new Date()) return;
  state.selectedDate = d;
  await loadDayData();
  if (state.progressLoaded) {
    const entry = state.weightHistory.find((h) => h.date === dk());
    state.weightInput = entry && entry.kg != null ? String(entry.kg) : "";
  }
  render();
}

async function updateConfig(patch) {
  state.config = { ...state.config, ...patch };
  await saveKey("config", state.config);
  await computeStreak();
}

async function updateWorkout(next) {
  state.workout = next;
  await saveKey(`workout:${dk()}`, next);
}

async function updateMeals(next) {
  state.meals = next;
  await saveKey(`diet:${dk()}`, next);
}

async function updateWater(ml) {
  state.water = Math.max(0, ml);
  await saveKey(`water:${dk()}`, { ml: state.water });
  await computeStreak();
}

function mealTotals() {
  return state.meals.reduce((acc, m) => ({
    cal: acc.cal + (Number(m.calories) || 0),
    protein: acc.protein + (Number(m.protein) || 0),
    carb: acc.carb + (Number(m.carb) || 0),
    fat: acc.fat + (Number(m.fat) || 0),
  }), { cal: 0, protein: 0, carb: 0, fat: 0 });
}

function setsProgress() {
  let done = 0, total = 0;
  state.workout.forEach((ex) => ex.sets.forEach((s) => { total++; if (s.done) done++; }));
  return { done, total };
}

/* ---------------- HELPERS DE UI ---------------- */
function ringHTML(pct, color, innerHtml, size, stroke) {
  size = size || 92; stroke = stroke || 9;
  const clamped = Math.max(0, Math.min(1, pct));
  const deg = clamped * 360;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:conic-gradient(${color} ${deg}deg, var(--border) 0deg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
    <div style="width:${size - stroke * 2}px;height:${size - stroke * 2}px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;flex-direction:column;">${innerHtml}</div>
  </div>`;
}

function barHTML(pct, color) {
  const clamped = Math.max(0, Math.min(1, pct)) * 100;
  return `<div class="bar-track"><div class="bar-fill" style="width:${clamped}%;background:${color}"></div></div>`;
}

function macroRowHTML(label, value, goal, color, unit) {
  return `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
        <span style="color:var(--text-muted);">${label}</span>
        <span style="font-weight:700;">${Math.round(value)} / ${goal} ${unit}</span>
      </div>
      ${barHTML(goal ? value / goal : 0, color)}
    </div>`;
}

/* ---------------- RENDER PRINCIPAL ---------------- */
function render() {
  const root = document.getElementById("root");
  root.innerHTML = `
    <div style="max-width:460px;width:100%;margin:0 auto;min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);">
      <div style="padding:20px 18px 16px;border-bottom:1px solid var(--border);background:radial-gradient(120% 100% at 15% 0%, rgba(200,255,77,0.09), transparent 55%), linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:27px;letter-spacing:0.5px;font-weight:800;text-transform:uppercase;">
            FORJ<span style="color:var(--accent-energy);">A</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="display:flex;align-items:center;gap:6px;background:var(--surface-2);border:1px solid var(--border);padding:5px 10px;border-radius:99px;">
              ${icon("flame", 15, state.streak > 0 ? "#FFB020" : "var(--text-faint)")}
              <span style="font-size:13px;font-weight:700;">${state.streak}</span>
            </div>
            <button class="icon-btn" data-action="logout" title="Sair">${icon("logout", 14)}</button>
          </div>
        </div>
        ${state.tab !== "treino" && state.tab !== "dieta" ? `
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;">
            <button class="icon-btn" data-action="change-day" data-delta="-1">${icon("chevronLeft", 16)}</button>
            <div style="font-size:13px;color:var(--text-muted);font-weight:600;text-transform:capitalize;">${fmtDate(state.selectedDate)}</div>
            <button class="icon-btn" data-action="change-day" data-delta="1" style="opacity:${isToday() ? 0.3 : 1};">${icon("chevronRight", 16)}</button>
          </div>
        ` : ""}
      </div>

      <div class="scrollarea" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;" id="tab-content"></div>

      <div style="display:flex;border-top:1px solid var(--border);background:var(--surface);">
        ${tabBtnHTML("resumo", "trending", "Resumo", "var(--text)")}
        ${tabBtnHTML("treino", "dumbbell", "Treino", "var(--accent-energy)")}
        ${tabBtnHTML("dieta", "apple", "Dieta", "var(--accent-food)")}
        ${tabBtnHTML("agua", "droplet", "Água", "var(--accent-water)")}
      </div>
    </div>
    ${voiceWidgetHTML()}
    ${restTimerBarHTML()}
  `;
  document.getElementById("tab-content").innerHTML = renderTabContent();
  attachRootEvents();
  attachTabEvents();
  attachVoiceEvents();
}

function tabBtnHTML(id, iconName, label, color) {
  const active = state.tab === id;
  return `
    <button class="tabbar-btn ${active ? "active" : ""}" data-action="change-tab" data-tab="${id}" style="color:${active ? color : "var(--text-faint)"};">
      ${icon(iconName, 19)}
      <span style="font-size:10.5px;font-weight:${active ? 700 : 500};">${label}</span>
    </button>`;
}

function renderTabContent() {
  if (state.tab === "resumo") return renderResumo();
  if (state.tab === "treino") return renderTreino();
  if (state.tab === "dieta") return renderDieta();
  if (state.tab === "agua") return renderAgua();
  return "";
}

/* Eventos de nível raiz (header, tabbar) — sempre presentes */
function attachRootEvents() {
  document.querySelectorAll('[data-action="change-tab"]').forEach((btn) => {
    btn.addEventListener("click", () => { state.tab = btn.dataset.tab; render(); });
  });
  document.querySelectorAll('[data-action="change-day"]').forEach((btn) => {
    btn.addEventListener("click", () => changeDay(Number(btn.dataset.delta)).then(render));
  });
  const logoutBtn = document.querySelector('[data-action="logout"]');
  if (logoutBtn) logoutBtn.addEventListener("click", () => auth.signOut());
  const skipRestBtn = document.querySelector('[data-action="skip-rest-timer"]');
  if (skipRestBtn) skipRestBtn.addEventListener("click", () => stopRestTimer());
}

/* ============ RESUMO ============ */
function renderResumo() {
  const totals = mealTotals();
  const waterPct = state.config.waterGoal ? state.water / state.config.waterGoal : 0;
  const calPct = state.config.calorieGoal ? totals.cal / state.config.calorieGoal : 0;
  const sp = setsProgress();
  const setPct = sp.total ? sp.done / sp.total : 0;

  let html = `
    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;font-weight:700;">Resumo do dia</div>
      <div style="display:flex;justify-content:space-around;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          ${ringHTML(waterPct, "var(--accent-water)", `<span style="font-size:15px;font-weight:800;">${Math.round(waterPct * 100)}%</span>`)}
          <span style="font-size:11px;color:var(--text-muted);">Água</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          ${ringHTML(calPct, "var(--accent-food)", `<span style="font-size:15px;font-weight:800;">${Math.round(calPct * 100)}%</span>`)}
          <span style="font-size:11px;color:var(--text-muted);">Calorias</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          ${ringHTML(setPct, "var(--accent-energy)", `<span style="font-size:15px;font-weight:800;">${sp.done}/${sp.total}</span>`)}
          <span style="font-size:11px;color:var(--text-muted);">Séries</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;font-weight:700;">Macros</div>
      ${macroRowHTML("Proteína", totals.protein, state.config.proteinGoal, "#FF5C8A", "g")}
      ${macroRowHTML("Carboidrato", totals.carb, state.config.carbGoal, "#FFD166", "g")}
      ${macroRowHTML("Gordura", totals.fat, state.config.fatGoal, "#4FE3C2", "g")}
    </div>
  `;

  if (state.progressLoading || !state.progressLoaded) {
    html += `<div class="card" style="text-align:center;padding:26px 16px;color:var(--text-muted);font-size:13px;">Carregando progresso...</div>`;
    return html;
  }

  const validWeights = state.weightHistory.filter((h) => h.kg != null);
  const currentWeight = validWeights.length ? validWeights[validWeights.length - 1].kg : null;
  const goal = state.config.weightGoal;
  const diff = currentWeight != null && goal ? currentWeight - goal : null;
  const chart = weightChartSVG(state.weightHistory);
  const trainingDays = state.trainingHistory.filter((h) => h.exercises > 0).length;

  html += `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;">Peso</div>
        <button data-action="toggle-weight-goal-edit" style="background:none;border:none;color:var(--text-faint);display:flex;align-items:center;gap:4px;font-size:11px;">${icon("pencil", 12)} Meta</button>
      </div>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <div>
          <div style="font-size:26px;font-weight:800;">${currentWeight != null ? currentWeight.toFixed(1) : "--"}<span style="font-size:13px;color:var(--text-muted);"> kg</span></div>
          <div style="font-size:11px;color:var(--text-faint);">Peso atual</div>
        </div>
        <div style="width:1px;height:32px;background:var(--border);"></div>
        <div>
          <div style="font-size:20px;font-weight:800;color:var(--accent-energy);">${goal ? goal.toFixed(1) : "--"}<span style="font-size:12px;color:var(--text-muted);"> kg</span></div>
          <div style="font-size:11px;color:var(--text-faint);">Meta</div>
        </div>
        ${diff != null ? `
          <div style="margin-left:auto;text-align:right;">
            <div style="font-size:14px;font-weight:700;color:${Math.abs(diff) < 0.3 ? "var(--accent-energy)" : "var(--text-muted)"};">${diff > 0 ? "+" : ""}${diff.toFixed(1)} kg</div>
            <div style="font-size:10.5px;color:var(--text-faint);">${diff > 0 ? "acima da meta" : diff < 0 ? "abaixo da meta" : "na meta"}</div>
          </div>` : ""}
      </div>
      ${state.showWeightGoalEdit ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">${goalInputHTML("Meta de peso (kg)", "goal-weight", state.config.weightGoal)}</div>` : ""}
      <div style="display:flex;gap:8px;margin-top:14px;">
        <input type="number" step="0.1" id="weight-input" data-model="weightInput" value="${escapeHtml(state.weightInput)}" placeholder="Registrar peso de hoje (kg)" />
        <button data-action="save-weight" style="background:var(--accent-energy);color:#14161A;border:none;border-radius:8px;padding:0 16px;font-weight:800;font-size:12.5px;">Salvar</button>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:10px;">Evolução do peso (30 dias)</div>
      ${chart ? chart : `<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px 0;">Registre seu peso por alguns dias pra ver o gráfico aqui.</div>`}
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
        <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;">Evolução do treino (30 dias)</div>
        <div style="font-size:11.5px;color:var(--accent-energy);font-weight:700;">${trainingDays} dias treinados</div>
      </div>
      ${trainingHeatmapHTML(state.trainingHistory)}
      <div style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:10.5px;color:var(--text-faint);">
        <span style="width:10px;height:10px;border-radius:3px;background:var(--border);display:inline-block;"></span> sem treino
        <span style="width:10px;height:10px;border-radius:3px;background:rgba(200,255,77,0.5);display:inline-block;margin-left:8px;"></span> parcial
        <span style="width:10px;height:10px;border-radius:3px;background:var(--accent-energy);display:inline-block;margin-left:8px;"></span> completo
      </div>
    </div>
  `;
  return html;
}

/* ============ TREINO ============ */
function renderTreino() {
  let html = "";
  const rotationActive = state.workoutRotation && state.workoutRotation.active;

  if (!state.dayPlanName) {
    html += `
      <div class="card" style="border-color:var(--accent-energy);text-align:center;padding:22px 18px;">
        ${icon("dumbbell", 26, "var(--accent-energy)")}
        <div style="font-weight:800;font-size:15px;margin-top:8px;">Gerar plano de treino</div>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:3px;margin-bottom:14px;">Monta uma divisão completa com base no seu objetivo — grátis, na hora.</div>
        <button data-action="toggle-workout-gen-form" class="btn-primary" style="background:var(--accent-energy);">Gerar plano de treino</button>
      </div>`;
  }

  if (state.rotationExpired) {
    html += `
      <div class="card" style="border-color:#FF9C7A;">
        <div style="font-weight:700;font-size:13.5px;">Você completou os 10 ciclos da sua rotina! 🎉</div>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:4px;">Hora de renovar — gera um treino novo ou reinicia essa mesma rotina do zero.</div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button data-action="restart-workout-rotation" class="btn-primary" style="flex:1;background:var(--accent-energy);">Reiniciar essa rotina</button>
          <button data-action="toggle-workout-gen-form" class="btn-secondary">Gerar nova</button>
        </div>
      </div>`;
  }

  if (state.dayPlanName) {
    const sp = setsProgress();
    const setPct = sp.total ? sp.done / sp.total : 0;
    const allDone = sp.total > 0 && sp.done === sp.total;
    html += `
      <div class="card" style="padding:14px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <div style="flex:1;min-width:0;">
            ${rotationActive && state.rotationInfo ? `
              <div style="font-size:10.5px;color:var(--accent-energy);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">
                Ciclo ${state.rotationInfo.cycleNumber} de ${MAX_ROTATION_CYCLES} · Treino ${state.rotationInfo.dayInCycle} de ${state.rotationInfo.totalDays}
              </div>
            ` : `
              <div style="font-size:10.5px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Treino atual</div>
            `}
            <div style="font-weight:700;font-size:16px;">${escapeHtml(state.dayPlanName)}</div>
            <button data-action="trocar-treino" style="background:none;border:none;color:var(--text-faint);font-size:11px;padding:0;margin-top:4px;text-decoration:underline;">Trocar treino</button>
          </div>
          ${sp.total > 0 ? ringHTML(setPct, allDone ? "var(--accent-energy)" : "var(--accent-water)", `<span style="font-size:12px;font-weight:800;">${sp.done}/${sp.total}</span>`, 56, 6) : ""}
        </div>
        ${rotationActive && state.rotationInfo ? `
          <div style="display:flex;gap:4px;margin-top:10px;">
            ${Array.from({ length: state.rotationInfo.totalDays }).map((_, i) => `
              <span style="flex:1;height:4px;border-radius:2px;background:${i < state.rotationInfo.dayInCycle ? "var(--accent-energy)" : "var(--border)"};"></span>
            `).join("")}
          </div>
        ` : ""}
        ${allDone ? `<div style="margin-top:12px;background:var(--accent-energy);color:#14161A;border-radius:10px;padding:9px;text-align:center;font-weight:800;font-size:13px;">💪 Treino concluído!</div>` : ""}
      </div>`;

    if (hasGymOnlyExercise()) {
      html += `
        <button data-action="convert-workout-home" style="display:flex;align-items:center;justify-content:center;gap:6px;background:var(--surface);border:1px dashed var(--accent-water);color:var(--accent-water);border-radius:12px;padding:11px 0;font-weight:700;font-size:12.5px;width:100%;">
          🏠 Não vou pra academia hoje — trocar por versão de casa
        </button>`;
    }
  }

  if (state.showWorkoutGenForm) html += renderWorkoutGenerator();

  if (state.showManager) html += renderPlanManager();

  if (state.dayPlanName && state.workout.length === 0 && !state.showExtraExerciseForm) {
    html += `
      <div class="card" style="text-align:center;padding:34px 16px;">
        ${icon("dumbbell", 26, "var(--accent-energy)")}
        <div style="font-weight:700;margin:8px 0 4px;">Nenhum exercício nesse treino</div>
        <div style="font-size:12px;color:var(--text-muted);">Adicione um exercício abaixo.</div>
      </div>`;
  }

  state.workout.forEach((ex) => {
    const exSubs = getExerciseSubstitutes(ex.name, ex.muscle);
    const exPickerOpen = state.exerciseSwapTarget === ex.id;
    const exMenuOpen = state.exerciseMenuTarget === ex.id;
    html += `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;position:relative;">
          <div>
            <div style="font-weight:700;font-size:15px;">${escapeHtml(ex.name)}</div>
            <span style="font-size:10.5px;font-weight:700;color:${MUSCLE_COLOR[ex.muscle]};text-transform:uppercase;letter-spacing:0.5px;">${ex.muscle}</span>
          </div>
          <button class="icon-btn" data-action="toggle-exercise-menu" data-ex="${ex.id}" style="color:${exMenuOpen ? "var(--accent-energy)" : "var(--text-muted)"};">${icon("moreVertical", 15)}</button>
          ${exMenuOpen ? `
            <div style="position:absolute;top:34px;right:0;z-index:5;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.35);min-width:170px;">
              ${exSubs.length > 0 ? `<button data-action="open-exercise-swap" data-ex="${ex.id}" style="display:flex;align-items:center;gap:6px;width:100%;background:none;border:none;padding:10px 12px;font-size:12.5px;color:var(--text);text-align:left;">${icon("swap", 13)} Trocar exercício</button>` : ""}
              <button data-action="remove-exercise" data-ex="${ex.id}" style="display:flex;align-items:center;gap:6px;width:100%;background:none;border:none;padding:10px 12px;font-size:12.5px;color:#FF5C5C;text-align:left;border-top:1px solid var(--border);">${icon("trash", 13)} Remover exercício</button>
            </div>
          ` : ""}
        </div>
        ${exPickerOpen ? `
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;padding:8px;background:var(--surface-2);border-radius:8px;">
            <div style="width:100%;font-size:10px;color:var(--text-faint);margin-bottom:2px;">Substitutos (${ex.muscle}) — mantém as séries/reps que você já ajustou:</div>
            ${exSubs.map((s) => `
              <button data-action="swap-exercise-item" data-ex="${ex.id}" data-newname="${escapeHtml(s.name)}" data-newlocal="${s.local || ""}" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:5px 9px;font-size:10.5px;color:var(--text);">
                ${escapeHtml(s.name)} ${s.local ? `<span style="color:var(--text-faint);">· ${s.local}</span>` : ""}
              </button>
            `).join("")}
          </div>
        ` : ""}
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${ex.sets.map((s, idx) => `
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:16px;font-size:11px;color:var(--text-faint);font-weight:700;">${idx + 1}</div>
              <input type="number" value="${s.reps}" data-bind="set-reps" data-ex="${ex.id}" data-idx="${idx}" style="width:56px;" />
              <span style="font-size:11px;color:var(--text-faint);">reps</span>
              <input type="number" value="${s.weight}" data-bind="set-weight" data-ex="${ex.id}" data-idx="${idx}" style="width:60px;" />
              <span style="font-size:11px;color:var(--text-faint);">kg</span>
              <button data-action="toggle-set" data-ex="${ex.id}" data-idx="${idx}" style="margin-left:auto;width:30px;height:30px;border-radius:8px;flex-shrink:0;border:1px solid ${s.done ? "var(--accent-energy)" : "var(--border)"};background:${s.done ? "var(--accent-energy)" : "transparent"};display:flex;align-items:center;justify-content:center;">
                ${icon("check", 15, s.done ? "#14161A" : "var(--text-faint)")}
              </button>
            </div>
          `).join("")}
        </div>
        <button data-action="add-set" data-ex="${ex.id}" style="margin-top:10px;font-size:12px;color:var(--accent-energy);background:none;border:none;display:flex;align-items:center;gap:4px;font-weight:600;">
          ${icon("plus", 13)} Adicionar série
        </button>
      </div>`;
  });

  if (state.showExtraExerciseForm) {
    html += `
      <div class="card">
        <div style="font-weight:700;font-size:13px;margin-bottom:10px;">Novo exercício</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;gap:6px;">
            ${LOCAIS.map((l) => `
              <button type="button" data-action="set-extra-local-filter" data-local="${l}" style="flex:1;background:${state.extraLocalFilter === l ? "var(--accent-energy)" : "var(--surface-2)"};color:${state.extraLocalFilter === l ? "#14161A" : "var(--text-muted)"};border:1px solid var(--border);border-radius:8px;padding:6px 0;font-size:11px;font-weight:700;">${l}</button>
            `).join("")}
          </div>
          <div style="position:relative;">
            <input id="extra-ex-name" data-model="extraExerciseForm.name" value="${escapeHtml(state.extraExerciseForm.name)}" placeholder="Buscar exercício (ex: Supino reto)" autocomplete="off" />
            <div id="extra-ex-suggestions"></div>
          </div>
          <select id="extra-ex-muscle" data-model="extraExerciseForm.muscle">${selectOptionsHTML(MUSCLES, state.extraExerciseForm.muscle)}</select>
          <div style="display:flex;gap:8px;">
            <div style="flex:1;"><label style="font-size:10.5px;color:var(--text-faint);">Séries</label><input type="number" id="extra-ex-sets" data-model="extraExerciseForm.sets" value="${state.extraExerciseForm.sets}" /></div>
            <div style="flex:1;"><label style="font-size:10.5px;color:var(--text-faint);">Reps</label><input type="number" id="extra-ex-reps" data-model="extraExerciseForm.reps" value="${state.extraExerciseForm.reps}" /></div>
            <div style="flex:1;"><label style="font-size:10.5px;color:var(--text-faint);">Kg</label><input type="number" id="extra-ex-weight" data-model="extraExerciseForm.weight" value="${state.extraExerciseForm.weight}" /></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <button data-action="add-extra-exercise" class="btn-primary" style="flex:1;background:var(--accent-energy);">Adicionar</button>
            <button data-action="cancel-extra-exercise" class="btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>`;
  } else if (state.dayPlanName) {
    html += `
      <button data-action="show-extra-exercise" style="display:flex;align-items:center;justify-content:center;gap:6px;background:var(--surface);border:1px dashed var(--border);color:var(--accent-energy);border-radius:14px;padding:14px 0;font-weight:700;font-size:13px;width:100%;">
        ${icon("plus", 15)} Adicionar exercício extra
      </button>`;
  }

  return html;
}

function renderPlanManager() {
  return `
    <div class="card" style="border-color:var(--accent-energy);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-weight:800;font-size:13.5px;">Gerenciar treinos</div>
        <button data-action="close-manager" style="background:none;border:none;color:var(--text-faint);">${icon("x", 16)}</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
        ${state.plans.map((plan) => `
          <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface-2);border-radius:10px;padding:10px 12px;">
            <div>
              <div style="font-weight:700;font-size:13px;">${escapeHtml(plan.name)}</div>
              <div style="font-size:10.5px;color:var(--text-faint);">${plan.exercises.map((e) => e.name).join(", ")}</div>
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0;">
              <button data-action="start-plan-from-manager" data-plan-id="${plan.id}" style="background:var(--surface);border:1px solid var(--accent-energy);color:var(--accent-energy);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:700;">Usar</button>
              <button class="icon-btn" data-action="delete-plan" data-plan-id="${plan.id}" style="color:#FF5C5C;">${icon("trash", 13)}</button>
            </div>
          </div>
        `).join("")}
      </div>

      ${state.showNewPlanForm ? `
        <div style="display:flex;flex-direction:column;gap:8px;padding-top:10px;border-top:1px solid var(--border);">
          <input id="new-plan-name" data-model="newPlanForm.name" value="${escapeHtml(state.newPlanForm.name)}" placeholder="Nome do treino (ex: Treino E — Braço)" />
          <select id="new-plan-muscle" data-model="newPlanForm.muscle">${selectOptionsHTML(MUSCLES, state.newPlanForm.muscle)}</select>
          <div style="display:flex;gap:6px;">
            ${LOCAIS.map((l) => `
              <button type="button" data-action="set-newplan-local-filter" data-local="${l}" style="flex:1;background:${state.newPlanLocalFilter === l ? "var(--accent-energy)" : "var(--surface-2)"};color:${state.newPlanLocalFilter === l ? "#14161A" : "var(--text-muted)"};border:1px solid var(--border);border-radius:8px;padding:6px 0;font-size:11px;font-weight:700;">${l}</button>
            `).join("")}
          </div>
          <div style="position:relative;">
            <input id="new-plan-ex-query" placeholder="Buscar exercício pra adicionar" autocomplete="off" />
            <div id="new-plan-ex-suggestions"></div>
          </div>
          <div id="new-plan-draft-list" style="display:flex;flex-wrap:wrap;gap:6px;">
            ${state.newPlanDraftExercises.map((ex) => `
              <span style="display:flex;align-items:center;gap:4px;background:var(--surface-2);border:1px solid var(--border);border-radius:99px;padding:4px 8px 4px 10px;font-size:11.5px;">
                ${escapeHtml(ex.name)}
                <button data-action="remove-draft-exercise" data-name="${escapeHtml(ex.name)}" style="background:none;border:none;color:var(--text-faint);display:flex;">${icon("x", 11)}</button>
              </span>
            `).join("")}
          </div>
          <div style="display:flex;gap:8px;">
            <button data-action="save-new-plan" class="btn-primary" style="flex:1;">Salvar treino</button>
            <button data-action="cancel-new-plan" class="btn-secondary">Cancelar</button>
          </div>
        </div>
      ` : `
        <button data-action="open-new-plan-form" style="display:flex;align-items:center;justify-content:center;gap:6px;background:var(--surface-2);border:1px dashed var(--border);color:var(--accent-energy);border-radius:10px;padding:10px 0;font-weight:700;font-size:12.5px;width:100%;">
          ${icon("plus", 13)} Criar novo treino
        </button>
      `}
    </div>`;
}

function renderWorkoutGenerator() {
  const f = state.workoutGenForm;
  return `
    <div class="card" style="border-color:var(--accent-energy);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:800;font-size:13.5px;">Gerar plano de treino</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Divisão montada com base no seu objetivo (grátis)</div>
        </div>
        <button data-action="toggle-workout-gen-form" style="background:var(--accent-energy);color:#14161A;border:none;border-radius:10px;padding:8px 14px;font-weight:800;font-size:12px;">Fechar</button>
      </div>

      <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
        <div>
          <label style="font-size:10.5px;color:var(--text-faint);">Objetivo (mesmo da dieta)</label>
          <select id="wg-objetivo" data-model="workoutGenForm.objetivo">${selectOptionsHTML(["Emagrecimento", "Manutenção", "Ganho de massa"], f.objetivo)}</select>
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:1;">
            <label style="font-size:10.5px;color:var(--text-faint);">Onde treina</label>
            <select id="wg-local" data-model="workoutGenForm.local">${selectOptionsHTML(LOCAIS, f.local)}</select>
          </div>
          <div style="flex:1;">
            <label style="font-size:10.5px;color:var(--text-faint);">Dias por semana</label>
            <input type="number" id="wg-dias" data-model="workoutGenForm.dias" value="${f.dias}" min="2" max="6" />
          </div>
        </div>
        <button data-action="gerar-treino-auto" class="btn-primary" style="background:var(--accent-energy);margin-top:4px;">Gerar divisão de treino</button>

        ${state.workoutGenResult ? `
          <div style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px;">
            ${state.workoutGenResult.map((p) => `
              <div style="font-size:12px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="font-weight:700;">${escapeHtml(p.name)}</span>
                  <span style="color:var(--text-faint);">${p.genSets}x${p.genReps}</span>
                </div>
                <div style="font-size:10.5px;color:var(--text-faint);margin-top:2px;">${p.exercises.map((e) => e.name).join(", ")}</div>
              </div>
            `).join("")}
            <div style="display:flex;gap:8px;margin-top:4px;">
              <button data-action="apply-workout-gen" class="btn-primary" style="flex:1;">Adicionar aos meus treinos</button>
              <button data-action="discard-workout-gen" class="btn-secondary">Descartar</button>
            </div>
          </div>
        ` : ""}
      </div>
    </div>`;
}

/* ============ DIETA ============ */
function renderDieta() {
  const totals = mealTotals();
  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;">Calorias</div>
        <button data-action="toggle-goals-edit" style="background:none;border:none;color:var(--text-faint);display:flex;align-items:center;gap:4px;font-size:11px;">${icon("pencil", 12)} Metas</button>
      </div>
      <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:8px;">
        <span style="font-size:26px;font-weight:800;">${Math.round(totals.cal)}</span>
        <span style="font-size:13px;color:var(--text-muted);">/ ${state.config.calorieGoal} kcal</span>
      </div>
      ${barHTML(state.config.calorieGoal ? totals.cal / state.config.calorieGoal : 0, "var(--accent-food)")}
      ${state.showGoalsEdit ? `
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid var(--border);">
          ${goalInputHTML("Meta de calorias (kcal)", "goal-calorie", state.config.calorieGoal)}
          ${goalInputHTML("Meta de proteína (g)", "goal-protein", state.config.proteinGoal)}
          ${goalInputHTML("Meta de carboidrato (g)", "goal-carb", state.config.carbGoal)}
          ${goalInputHTML("Meta de gordura (g)", "goal-fat", state.config.fatGoal)}
        </div>` : ""}
    </div>

    <div class="card">
      ${macroRowHTML("Proteína", totals.protein, state.config.proteinGoal, "#FF5C8A", "g")}
      ${macroRowHTML("Carboidrato", totals.carb, state.config.carbGoal, "#FFD166", "g")}
      ${macroRowHTML("Gordura", totals.fat, state.config.fatGoal, "#4FE3C2", "g")}
    </div>

    ${renderGeradorDieta()}



    <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-top:4px;">Refeições</div>

    ${state.meals.length === 0 && !state.showMealForm ? `
      <div class="card" style="text-align:center;padding:26px 16px;">
        ${icon("apple", 22, "var(--accent-food)")}
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px;">Nenhuma refeição registrada ainda.</div>
      </div>` : ""}

    ${state.meals.map((m) => `
      <div class="card" style="padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="flex:1;">
            <div style="font-weight:700;font-size:13.5px;">${escapeHtml(m.name)}</div>
            <div style="font-size:11px;color:var(--text-faint);margin-top:2px;">${m.time} · ${m.calories} kcal · P ${m.protein}g · C ${m.carb}g · G ${m.fat}g</div>
          </div>
          <button class="icon-btn" data-action="remove-meal" data-meal="${m.id}" style="color:#FF5C5C;">${icon("trash", 13)}</button>
        </div>
        ${m.items && m.items.length ? `
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px;">
            ${m.items.map((it, i) => {
              const subs = getSubstitutes(it.name);
              const pickerOpen = state.swapTarget && state.swapTarget.mealId === m.id && state.swapTarget.idx === i;
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:var(--text-faint);">
                    <span>${escapeHtml(it.name)} (${it.grams}g)</span>
                    ${subs.length > 0 ? `
                      <button data-action="toggle-swap-picker" data-meal="${m.id}" data-idx="${i}" style="background:none;border:none;color:${pickerOpen ? "var(--accent-food)" : "var(--text-faint)"};display:flex;align-items:center;gap:3px;padding:2px 4px;">
                        ${icon("swap", 11)} <span style="font-size:9.5px;">trocar</span>
                      </button>
                    ` : ""}
                  </div>
                  ${pickerOpen ? `
                    <div style="display:flex;flex-wrap:wrap;gap:5px;margin:5px 0 2px;padding:8px;background:var(--surface-2);border-radius:8px;">
                      ${subs.map((s) => `
                        <button data-action="swap-food-item" data-meal="${m.id}" data-idx="${i}" data-newname="${escapeHtml(s.name)}" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:5px 9px;font-size:10.5px;color:var(--text);">
                          ${escapeHtml(s.name)} <span style="color:var(--text-faint);">· ${s.kcal} kcal/100g</span>
                        </button>
                      `).join("")}
                    </div>
                  ` : ""}
                </div>`;
            }).join("")}
          </div>
        ` : ""}
      </div>
    `).join("")}

    ${state.showMealForm ? renderMealForm() : `
      <button data-action="show-meal-form" style="display:flex;align-items:center;justify-content:center;gap:6px;background:var(--surface);border:1px dashed var(--border);color:var(--accent-food);border-radius:14px;padding:14px 0;font-weight:700;font-size:13px;width:100%;">
        ${icon("plus", 15)} Nova refeição
      </button>`}
  `;
}

function goalInputHTML(label, id, value) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <label style="font-size:12px;color:var(--text-muted);">${label}</label>
      <input type="number" id="${id}" value="${value}" style="width:90px;text-align:right;" data-action-onchange="save-goal" />
    </div>`;
}

function renderMealForm() {
  return `
    <div class="card">
      <div style="font-weight:700;font-size:13px;margin-bottom:10px;">Nova refeição</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <input id="meal-name" data-model="mealForm.name" value="${escapeHtml(state.mealForm.name)}" placeholder="Nome da refeição (ex: Almoço)" />
        <div style="position:relative;">
          <input id="food-query" placeholder="Buscar alimento (ex: arroz, frango, banana...)" autocomplete="off" />
          <div id="food-suggestions"></div>
        </div>
        <button data-action="toggle-custom-food" style="align-self:flex-start;background:none;border:none;color:var(--text-faint);font-size:11.5px;display:flex;align-items:center;gap:4px;">
          ${icon("plus", 12)} Alimento não está na lista? Adicionar manualmente
        </button>
        ${state.showCustomFood ? `
          <div style="display:flex;flex-direction:column;gap:6px;padding:10px;background:var(--surface-2);border-radius:10px;">
            <input id="custom-food-name" data-model="customFood.name" value="${escapeHtml(state.customFood.name)}" placeholder="Nome do alimento" />
            <div style="font-size:10px;color:var(--text-faint);">Valores por 100g:</div>
            <div style="display:flex;gap:6px;">
              <input type="number" id="custom-food-kcal" data-model="customFood.kcal" value="${state.customFood.kcal}" placeholder="kcal" />
              <input type="number" id="custom-food-protein" data-model="customFood.protein" value="${state.customFood.protein}" placeholder="Prot (g)" />
              <input type="number" id="custom-food-carb" data-model="customFood.carb" value="${state.customFood.carb}" placeholder="Carb (g)" />
              <input type="number" id="custom-food-fat" data-model="customFood.fat" value="${state.customFood.fat}" placeholder="Gord (g)" />
            </div>
            <button data-action="add-custom-food-item" class="btn-primary" style="padding:7px 0;font-size:12px;">Adicionar item</button>
          </div>` : ""}
        ${state.mealDraftItems.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;padding-top:10px;border-top:1px solid var(--border);">
            ${state.mealDraftItems.map((it, i) => `
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="flex:1;font-size:12px;">${escapeHtml(it.name)}</div>
                <input type="number" value="${it.grams}" data-action-onchange="update-draft-grams" data-idx="${i}" style="width:56px;" />
                <span style="font-size:10.5px;color:var(--text-faint);">g</span>
                <span style="font-size:10.5px;color:var(--text-muted);width:52px;text-align:right;">${Math.round(it.kcal100 * it.grams / 100)} kcal</span>
                <button data-action="remove-draft-item" data-idx="${i}" style="background:none;border:none;color:var(--text-faint);">${icon("x", 13)}</button>
              </div>
            `).join("")}
            ${(() => {
              const t = state.mealDraftItems.reduce((a, it) => {
                const f = it.grams / 100;
                return { kcal: a.kcal + it.kcal100 * f, protein: a.protein + it.protein100 * f, carb: a.carb + it.carb100 * f, fat: a.fat + it.fat100 * f };
              }, { kcal: 0, protein: 0, carb: 0, fat: 0 });
              return `<div style="font-size:12px;font-weight:700;text-align:right;">Total: ${Math.round(t.kcal)} kcal · P ${Math.round(t.protein)}g · C ${Math.round(t.carb)}g · G ${Math.round(t.fat)}g</div>`;
            })()}
          </div>` : ""}
        <div style="display:flex;gap:8px;margin-top:4px;">
          <button data-action="save-meal" class="btn-primary" style="flex:1;background:${state.mealDraftItems.length === 0 ? "var(--surface-2)" : "var(--accent-food)"};color:${state.mealDraftItems.length === 0 ? "var(--text-faint)" : "#14161A"};" ${state.mealDraftItems.length === 0 ? "disabled" : ""}>Adicionar refeição</button>
          <button data-action="cancel-meal-form" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>`;
}

function renderGeradorDieta() {
  return `
    <div class="card" style="border-color:var(--accent-food);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:800;font-size:13.5px;">Gerar dieta automaticamente</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Vira sua dieta padrão todo dia — só muda se você gerar de novo (grátis)</div>
        </div>
        <button data-action="toggle-ai-form" style="background:var(--accent-food);color:#14161A;border:none;border-radius:10px;padding:8px 14px;font-weight:800;font-size:12px;">
          ${state.showAiForm ? "Fechar" : "Gerar"}
        </button>
      </div>
      ${state.showAiForm ? `
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
          <div style="background:var(--surface-2);border:1px solid ${(!state.aiForm.peso || !state.aiForm.metaPeso) ? "#FF7A52" : "var(--border)"};border-radius:10px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px;">Peso atual e meta (essencial pro cálculo)</div>
            <div style="display:flex;gap:8px;">
              <div style="flex:1;">
                <label style="font-size:10.5px;color:var(--text-faint);">Peso atual (kg)</label>
                <input type="number" id="ai-peso" data-model="aiForm.peso" value="${state.aiForm.peso}" placeholder="ex: 80" />
              </div>
              <div style="flex:1;">
                <label style="font-size:10.5px;color:var(--text-faint);">Meta de peso (kg)</label>
                <input type="number" id="ai-meta-peso" data-model="aiForm.metaPeso" value="${state.aiForm.metaPeso}" placeholder="ex: 75" />
              </div>
            </div>
            ${!state.aiForm.metaPeso ? `
              <div style="font-size:10.5px;color:#FF9C7A;margin-top:6px;">Sem meta, o ajuste de calorias fica genérico. Preenchendo os dois, o cálculo é bem mais preciso.</div>
            ` : `
              <div style="font-size:10.5px;color:var(--accent-energy);margin-top:6px;">
                ${(() => {
                  const diff = Number(state.aiForm.peso) - Number(state.aiForm.metaPeso);
                  if (Math.abs(diff) < 1) return "Você já está na meta — foco em manutenção.";
                  if (diff > 0) return `Faltam ${diff.toFixed(1)} kg pra meta — ajuste calculado pra emagrecimento.`;
                  return `Faltam ${Math.abs(diff).toFixed(1)} kg pra meta — ajuste calculado pra ganho de massa.`;
                })()}
              </div>
            `}
          </div>
          <select id="ai-objetivo" data-model="aiForm.objetivo">${selectOptionsHTML(["Emagrecimento", "Manutenção", "Ganho de massa"], state.aiForm.objetivo)}</select>
          <div style="display:flex;gap:8px;">
            <div style="flex:1;"><label style="font-size:10.5px;color:var(--text-faint);">Altura (cm)</label><input type="number" id="ai-altura" data-model="aiForm.altura" value="${state.aiForm.altura}" /></div>
            <div style="flex:1;"><label style="font-size:10.5px;color:var(--text-faint);">Idade</label><input type="number" id="ai-idade" data-model="aiForm.idade" value="${state.aiForm.idade}" /></div>
          </div>
          <div style="display:flex;gap:8px;">
            <select id="ai-sexo" data-model="aiForm.sexo" style="flex:1;">${selectOptionsHTML(["Feminino", "Masculino"], state.aiForm.sexo)}</select>
            <select id="ai-atividade" data-model="aiForm.atividade" style="flex:1.4;">${selectOptionsHTML(["Sedentário", "Leve (1-3x/sem)", "Moderado (3-5x/sem)", "Intenso (6-7x/sem)"], state.aiForm.atividade)}</select>
          </div>
          <div><label style="font-size:10.5px;color:var(--text-faint);">Refeições por dia</label><input type="number" id="ai-refeicoes" data-model="aiForm.refeicoes" value="${state.aiForm.refeicoes}" min="2" max="7" /></div>
          <input id="ai-restricoes" data-model="aiForm.restricoes" value="${escapeHtml(state.aiForm.restricoes)}" placeholder="Restrições/preferências (ex: vegetariano, sem lactose)" />
          <button data-action="gerar-dieta-ia" class="btn-primary" style="background:${state.aiLoading ? "var(--surface-2)" : "var(--accent-food)"};color:${state.aiLoading ? "var(--text-muted)" : "#14161A"};margin-top:4px;" ${state.aiLoading ? "disabled" : ""}>
            ${state.aiLoading ? "Gerando plano..." : "Gerar plano do dia"}
          </button>
          ${state.aiError ? `<div style="font-size:12px;color:#FF5C5C;">${escapeHtml(state.aiError)}</div>` : ""}
          ${state.aiPlan ? `
            <div style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px;">
              <div style="font-size:12px;font-weight:700;">Total: ${Math.round(state.aiPlan.calorieGoal)} kcal · P ${state.aiPlan.proteinGoal}g · C ${state.aiPlan.carbGoal}g · G ${state.aiPlan.fatGoal}g</div>
              ${state.aiPlan.meals.map((m) => `
                <div style="border-bottom:1px solid var(--border);padding-bottom:8px;">
                  <div style="font-size:11.5px;color:var(--text-muted);display:flex;justify-content:space-between;font-weight:700;">
                    <span>${m.time ? m.time + " · " : ""}${escapeHtml(m.name)}</span><span>${m.calories} kcal</span>
                  </div>
                  ${m.items && m.items.length ? `<div style="font-size:10.5px;color:var(--text-faint);margin-top:3px;">${m.items.map((it) => `${escapeHtml(it.name)} (${it.grams}g)`).join(" · ")}</div>` : ""}
                </div>`).join("")}
              <div style="display:flex;gap:8px;margin-top:4px;">
                <button data-action="apply-ai-plan" class="btn-primary" style="flex:1;background:var(--accent-energy);">Definir como minha dieta fixa</button>
                <button data-action="discard-ai-plan" class="btn-secondary">Descartar</button>
              </div>
            </div>` : ""}
        </div>` : ""}
    </div>`;
}

/* ============ ÁGUA ============ */
function renderAgua() {
  const pct = state.config.waterGoal ? state.water / state.config.waterGoal : 0;
  const glassSize = 250;
  const totalGlasses = Math.max(1, Math.ceil(state.config.waterGoal / glassSize));
  const filledGlasses = Math.floor(state.water / glassSize);

  return `
    <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:24px;">
      ${ringHTML(pct, "var(--accent-water)", `
        ${icon("droplet", 20, "var(--accent-water)")}
        <span style="font-size:22px;font-weight:800;">${state.water}</span>
        <span style="font-size:11px;color:var(--text-muted);">de ${state.config.waterGoal} ml</span>
      `, 140, 12)}
      <div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap;justify-content:center;">
        ${[200, 300, 500].map((v) => `
          <button data-action="add-water" data-ml="${v}" style="background:var(--surface-2);border:1px solid var(--border);color:var(--accent-water);border-radius:10px;padding:8px 14px;font-weight:700;font-size:12.5px;display:flex;align-items:center;gap:4px;">
            ${icon("plus", 12)} ${v} ml
          </button>`).join("")}
        <button data-action="add-water" data-ml="-250" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text-muted);border-radius:10px;padding:8px 14px;font-weight:700;font-size:12.5px;display:flex;align-items:center;gap:4px;">
          ${icon("minus", 12)} 250 ml
        </button>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;width:100%;">
        <input type="number" id="custom-water" data-model="customWaterValue" value="${state.customWaterValue}" placeholder="Quantidade personalizada (ml)" />
        <button data-action="add-custom-water" style="background:var(--accent-water);color:#14161A;border:none;border-radius:8px;padding:0 16px;font-weight:800;font-size:12.5px;">OK</button>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:12px;">Copos (${glassSize} ml cada)</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${Array.from({ length: totalGlasses }).map((_, i) => `
          <div style="width:30px;height:38px;border-radius:4px 4px 8px 8px;border:2px solid ${i < filledGlasses ? "var(--accent-water)" : "var(--border)"};background:${i < filledGlasses ? "rgba(79,168,255,0.25)" : "transparent"};"></div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">Meta diária de água</span>
        <button data-action="toggle-water-goal-edit" style="background:none;border:none;color:var(--text-faint);display:flex;align-items:center;gap:4px;font-size:11px;">${icon("pencil", 12)} Editar</button>
      </div>
      ${state.config.currentWeight > 0 ? (() => {
        const suggested = calcWaterGoal(state.config.currentWeight);
        const alreadySet = suggested === state.config.waterGoal;
        return `
          <div style="margin-top:8px;font-size:11px;color:var(--text-faint);">
            Com base no seu peso (${state.config.currentWeight} kg), a recomendação é <strong style="color:var(--text);">${suggested} ml/dia</strong> (35ml por kg).
            ${!alreadySet ? `<button data-action="apply-suggested-water-goal" data-value="${suggested}" style="margin-left:6px;background:none;border:none;color:var(--accent-water);font-weight:700;cursor:pointer;text-decoration:underline;">usar essa meta</button>` : ""}
          </div>`;
      })() : ""}
      ${state.showWaterGoalEdit ? `<div style="margin-top:10px;">${goalInputHTML("Meta (ml)", "goal-water", state.config.waterGoal)}</div>` : ""}
    </div>
  `;
}

/* ============ PROGRESSO (peso e evolução mensal) ============ */
function weightChartSVG(history) {
  const valid = history.filter((h) => h.kg != null);
  if (valid.length < 2) return null;
  const width = 400, height = 130, padX = 12, padY = 16;
  const kgs = valid.map((h) => h.kg);
  const min = Math.min(...kgs) - 0.5, max = Math.max(...kgs) + 0.5;
  const n = history.length;
  const x = (i) => padX + (i / (n - 1)) * (width - padX * 2);
  const y = (kg) => height - padY - ((kg - min) / (max - min || 1)) * (height - padY * 2);

  let path = "", started = false;
  history.forEach((h, i) => {
    if (h.kg == null) { started = false; return; }
    path += `${started ? "L" : "M"}${x(i).toFixed(1)},${y(h.kg).toFixed(1)} `;
    started = true;
  });
  const dots = history.map((h, i) => h.kg == null ? "" : `<circle cx="${x(i).toFixed(1)}" cy="${y(h.kg).toFixed(1)}" r="2.5" fill="var(--accent-energy)" />`).join("");

  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="none">
    <path d="${path}" fill="none" stroke="var(--accent-energy)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

function trainingHeatmapHTML(history) {
  return `<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:5px;">
    ${history.map((h) => {
      const done = h.setsTotal > 0;
      const ratio = h.setsTotal ? h.setsDone / h.setsTotal : 0;
      let bg = "var(--border)";
      if (done) bg = ratio >= 1 ? "var(--accent-energy)" : `rgba(200,255,77,${(0.25 + ratio * 0.6).toFixed(2)})`;
      const label = `${h.date}${done ? ` · ${h.setsDone}/${h.setsTotal} séries` : " · sem treino"}`;
      return `<div title="${label}" style="aspect-ratio:1;border-radius:4px;background:${bg};"></div>`;
    }).join("")}
  </div>`;
}
