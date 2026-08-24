/* ---------------- EVENTOS DE ABA ---------------- */
function attachTabEvents() {
  const root = document.getElementById("tab-content");
  if (!root) return;

  root.addEventListener("click", handleTabClick);
  root.addEventListener("change", handleTabChange);
  root.addEventListener("input", handleTabInput);

  setupSearch("extra-ex-name", "extra-ex-suggestions", EXERCISE_DB, (ex) => ex.name, (ex) => {
    state.extraExerciseForm.name = ex.name;
    state.extraExerciseForm.muscle = ex.muscle;
    render();
  }, () => state.extraLocalFilter);

  setupSearch("new-plan-ex-query", "new-plan-ex-suggestions", EXERCISE_DB, (ex) => ex.name, (ex) => {
    if (!state.newPlanDraftExercises.some((d) => d.name === ex.name)) {
      state.newPlanDraftExercises.push({ name: ex.name, muscle: ex.muscle });
    }
    render();
  }, () => state.newPlanLocalFilter);

  setupFoodSearch();
}

function handleTabInput(e) {
  const path = e.target.dataset.model;
  if (path) setPath(path, e.target.value);
}

function handleTabChange(e) {
  const t = e.target;
  const path = t.dataset.model;
  if (path) setPath(path, t.value);

  if (t.dataset.bind === "set-reps") editSet(t.dataset.ex, Number(t.dataset.idx), "reps", Number(t.value)).then(render);
  if (t.dataset.bind === "set-weight") editSet(t.dataset.ex, Number(t.dataset.idx), "weight", Number(t.value)).then(render);

  if (t.id === "goal-calorie") updateConfig({ calorieGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "goal-protein") updateConfig({ proteinGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "goal-carb") updateConfig({ carbGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "goal-fat") updateConfig({ fatGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "goal-water") updateConfig({ waterGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "ai-peso" || t.id === "ai-meta-peso") render();
  if (t.id === "goal-weight") updateConfig({ weightGoal: Number(t.value) || 0 }).then(render);
  if (t.id === "rest-seconds-input") updateConfig({ restSeconds: Math.max(5, Number(t.value) || 60) }).then(render);

  if (t.dataset.actionOnchange === "update-draft-grams") {
    const idx = Number(t.dataset.idx);
    state.mealDraftItems[idx].grams = Number(t.value) || 0;
    render();
  }
}

function handleTabClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  switch (action) {
    case "start-plan": {
      const plan = state.plans.find((p) => p.id === btn.dataset.planId);
      if (plan) startPlan(plan);
      break;
    }
    case "start-plan-from-manager": {
      const plan = state.plans.find((p) => p.id === btn.dataset.planId);
      if (plan) { startPlan(plan); state.showManager = false; }
      break;
    }
    case "show-manager": state.showManager = true; render(); break;
    case "toggle-workout-rotation": toggleWorkoutRotation(); break;
    case "toggle-treino-settings": state.showTreinoSettings = !state.showTreinoSettings; render(); break;
    case "restart-workout-rotation": restartWorkoutRotation(); break;
    case "toggle-workout-gen-form":
      state.showWorkoutGenForm = !state.showWorkoutGenForm;
      if (state.showWorkoutGenForm && state.aiForm.objetivo) {
        state.workoutGenForm.objetivo = state.aiForm.objetivo;
      }
      state.workoutGenResult = null;
      render();
      break;
    case "gerar-treino-auto":
      state.workoutGenResult = generateWorkoutSplit(state.workoutGenForm);
      render();
      break;
    case "apply-workout-gen": {
      const generated = state.workoutGenResult;
      const next = [...state.plans, ...generated];
      saveKey("plans", next).then(() => {
        state.plans = next;
        state.workoutGenResult = null;
        state.showWorkoutGenForm = false;
        // Já ativa o primeiro treino da divisão gerada como o treino atual —
        // sem isso, o plano ficava salvo mas nunca "ligado" de verdade.
        if (generated && generated.length > 0) startPlan(generated[0]);
        else render();
      });
      break;
    }
    case "discard-workout-gen": state.workoutGenResult = null; render(); break;
    case "close-manager": state.showManager = false; render(); break;
    case "trocar-treino": trocarTreino(); break;
    case "convert-workout-home": convertWorkoutToHome(); break;
    case "remove-exercise": removeExercise(btn.dataset.ex); break;
    case "toggle-exercise-menu":
      state.exerciseMenuTarget = state.exerciseMenuTarget === btn.dataset.ex ? null : btn.dataset.ex;
      render();
      break;
    case "open-exercise-swap":
      state.exerciseSwapTarget = btn.dataset.ex;
      state.exerciseMenuTarget = null;
      render();
      break;
    case "toggle-exercise-swap-picker":
      state.exerciseSwapTarget = state.exerciseSwapTarget === btn.dataset.ex ? null : btn.dataset.ex;
      render();
      break;
    case "swap-exercise-item": swapExerciseItem(btn.dataset.ex, btn.dataset.newname); break;
    case "toggle-set": toggleSet(btn.dataset.ex, Number(btn.dataset.idx)); break;
    case "skip-rest-timer": stopRestTimer(); break;
    case "add-set": addSet(btn.dataset.ex); break;
    case "remove-set": removeSet(btn.dataset.ex, Number(btn.dataset.idx)); break;
    case "show-extra-exercise": state.showExtraExerciseForm = true; render(); break;
    case "set-extra-local-filter": state.extraLocalFilter = btn.dataset.local; render(); break;
    case "set-newplan-local-filter": state.newPlanLocalFilter = btn.dataset.local; render(); break;
    case "cancel-extra-exercise":
      state.showExtraExerciseForm = false;
      state.extraExerciseForm = { name: "", muscle: MUSCLES[0], sets: 3, reps: 10, weight: 0 };
      render();
      break;
    case "add-extra-exercise": addExtraExercise(); break;

    case "open-new-plan-form":
      state.showNewPlanForm = true;
      state.newPlanDraftExercises = [];
      state.newPlanForm = { name: "", muscle: MUSCLES[0] };
      render();
      break;
    case "cancel-new-plan":
      state.showNewPlanForm = false;
      state.newPlanDraftExercises = [];
      render();
      break;
    case "save-new-plan": saveNewPlan(); break;
    case "delete-plan": deletePlan(btn.dataset.planId); break;
    case "remove-draft-exercise":
      state.newPlanDraftExercises = state.newPlanDraftExercises.filter((d) => d.name !== btn.dataset.name);
      render();
      break;

    case "toggle-goals-edit": state.showGoalsEdit = !state.showGoalsEdit; render(); break;
    case "show-meal-form": state.showMealForm = true; state.mealDraftItems = []; render(); break;
    case "cancel-meal-form":
      state.showMealForm = false;
      state.mealDraftItems = [];
      state.showCustomFood = false;
      state.mealForm = { name: "" };
      render();
      break;
    case "toggle-custom-food": state.showCustomFood = !state.showCustomFood; render(); break;
    case "add-custom-food-item": addCustomFoodItem(); break;
    case "remove-draft-item": state.mealDraftItems.splice(Number(btn.dataset.idx), 1); render(); break;
    case "save-meal": saveMeal(); break;
    case "remove-meal": removeMeal(btn.dataset.meal); break;
    case "toggle-swap-picker": {
      const mealId = btn.dataset.meal, idx = Number(btn.dataset.idx);
      const isSame = state.swapTarget && state.swapTarget.mealId === mealId && state.swapTarget.idx === idx;
      state.swapTarget = isSame ? null : { mealId, idx };
      render();
      break;
    }
    case "swap-food-item": swapFoodItem(btn.dataset.meal, Number(btn.dataset.idx), btn.dataset.newname); break;

    case "toggle-ai-form":
      state.showAiForm = !state.showAiForm;
      state.aiError = "";
      state.aiPlan = null;
      if (state.showAiForm) syncAiFormFromProfile();
      render();
      break;
    case "gerar-dieta-ia": gerarDietaIA(); break;
    case "apply-ai-plan": applyAiPlan(); break;
    case "discard-ai-plan": state.aiPlan = null; render(); break;

    case "add-water": updateWater(state.water + Number(btn.dataset.ml)).then(render); break;
    case "add-custom-water": addCustomWater(); break;
    case "toggle-water-goal-edit": state.showWaterGoalEdit = !state.showWaterGoalEdit; render(); break;
    case "apply-suggested-water-goal": updateConfig({ waterGoal: Number(btn.dataset.value) }).then(render); break;
    case "toggle-weight-goal-edit": state.showWeightGoalEdit = !state.showWeightGoalEdit; render(); break;
    case "toggle-history": state.showHistory = !state.showHistory; render(); break;
    case "save-weight": saveWeight(); break;
  }
}

/* ---------------- BUSCA (autocomplete) ---------------- */
function setupSearch(inputId, boxId, db, nameFn, onPick, getLocalFilter) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);
  if (!input || !box) return;
  input.addEventListener("input", () => {
    const q = normalize(input.value);
    if (!q) { box.innerHTML = ""; return; }
    const localFilter = getLocalFilter ? getLocalFilter() : "Ambos";
    let pool = db;
    if (localFilter && localFilter !== "Ambos") {
      pool = db.filter((item) => item.local === localFilter || item.local === "Ambos");
    }
    const matches = pool.filter((item) => normalize(nameFn(item)).includes(q)).slice(0, 6);
    if (matches.length === 0) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="suggest-box">${matches.map((item, i) => `
      <button type="button" class="suggest-item" data-i="${i}">
        <span style="font-size:12.5px;">${escapeHtml(item.name)}</span>
        <span style="display:flex;align-items:center;gap:6px;">
          ${item.local ? `<span style="font-size:9.5px;color:var(--text-faint);">${item.local}</span>` : ""}
          <span style="font-size:10px;font-weight:700;color:${MUSCLE_COLOR[item.muscle] || "var(--text-faint)"};">${item.muscle || ""}</span>
        </span>
      </button>`).join("")}</div>`;
    box.querySelectorAll(".suggest-item").forEach((b) => {
      b.addEventListener("click", () => { onPick(matches[Number(b.dataset.i)]); });
    });
  });
}

function setupFoodSearch() {
  const input = document.getElementById("food-query");
  const box = document.getElementById("food-suggestions");
  if (!input || !box) return;
  input.addEventListener("input", () => {
    const q = normalize(input.value);
    if (!q) { box.innerHTML = ""; return; }
    const matches = FOOD_DB.filter((f) => normalize(f.name).includes(q)).slice(0, 7);
    if (matches.length === 0) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="suggest-box">${matches.map((f, i) => `
      <button type="button" class="suggest-item" data-i="${i}">
        <span style="font-size:12.5px;">${escapeHtml(f.name)}</span>
        <span style="font-size:10.5px;color:var(--text-faint);">${f.kcal} kcal/100g</span>
      </button>`).join("")}</div>`;
    box.querySelectorAll(".suggest-item").forEach((b) => {
      b.addEventListener("click", () => {
        const f = matches[Number(b.dataset.i)];
        state.mealDraftItems.push({ name: f.name, grams: 100, kcal100: f.kcal, protein100: f.protein, carb100: f.carb, fat100: f.fat });
        input.value = "";
        render();
      });
    });
  });
}

/* ---------------- TREINO: AÇÕES ---------------- */
function startPlan(plan) {
  const defaultSets = plan.genSets || 3;
  const defaultReps = plan.genReps || 10;
  const seeded = plan.exercises.map((ex) => {
    const numSets = ex.sets || defaultSets;
    const numReps = ex.reps || defaultReps;
    return {
      id: uid(), name: ex.name, muscle: ex.muscle,
      sets: Array.from({ length: numSets }, () => ({ reps: numReps, weight: 0, done: false })),
    };
  });
  updateWorkout(seeded).then(async () => {
    state.dayPlanName = plan.name;
    await saveKey(`dayplan:${dk()}`, { name: plan.name });
    render();
  });
}

function trocarTreino() {
  state.dayPlanName = null;
  saveKey(`dayplan:${dk()}`, null).then(render);
}

function toggleWorkoutRotation() {
  if (state.workoutRotation && state.workoutRotation.active) {
    state.workoutRotation = { active: false, planIds: [], position: 0 };
    saveKey("workoutRotation", state.workoutRotation).then(render);
  } else {
    if (state.plans.length === 0) return;
    state.workoutRotation = { active: true, planIds: state.plans.map((p) => p.id), position: 0 };
    saveKey("workoutRotation", state.workoutRotation).then(async () => {
      await saveKey(`dayplan:${dk()}`, null);
      await loadDayData();
      render();
    });
  }
}

function restartWorkoutRotation() {
  if (!state.workoutRotation) return;
  state.workoutRotation = { ...state.workoutRotation, position: 0, active: true };
  saveKey("workoutRotation", state.workoutRotation).then(async () => {
    await saveKey(`dayplan:${dk()}`, null);
    await loadDayData();
    render();
  });
}

function removeExercise(id) {
  state.exerciseMenuTarget = null;
  updateWorkout(state.workout.filter((e) => e.id !== id)).then(render);
}

function swapExerciseItem(exId, newName) {
  const newEx = EXERCISE_DB.find((e) => e.name === newName);
  if (!newEx) return;
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, name: newEx.name, muscle: newEx.muscle });
  updateWorkout(next).then(() => {
    state.exerciseSwapTarget = null;
    render();
  });
}

// Troca de uma vez só todo exercício que só dá pra fazer na academia por um
// equivalente de casa (mesmo grupo muscular), mantendo as séries/reps/pesos
// que a pessoa já tinha ajustado em cada um.
function convertWorkoutToHome() {
  const next = state.workout.map((ex) => {
    const dbEntry = EXERCISE_DB.find((e) => e.name === ex.name);
    if (!dbEntry || dbEntry.local !== "Academia") return ex;
    const subs = getExerciseSubstitutes(ex.name, ex.muscle);
    const home = subs.find((s) => s.local === "Casa" || s.local === "Ambos");
    if (!home) return ex;
    return { ...ex, name: home.name, muscle: home.muscle };
  });
  updateWorkout(next).then(render);
}

function hasGymOnlyExercise() {
  return state.workout.some((ex) => {
    const dbEntry = EXERCISE_DB.find((e) => e.name === ex.name);
    return dbEntry && dbEntry.local === "Academia";
  });
}

function toggleSet(exId, idx) {
  const ex = state.workout.find((e) => e.id === exId);
  const wasDone = ex ? ex.sets[idx].done : false;
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, sets: e.sets.map((s, i) => i === idx ? { ...s, done: !s.done } : s) });
  updateWorkout(next).then(render);
  if (!wasDone) startRestTimer(state.config.restSeconds || 60);
}

/* ---------------- CRONÔMETRO DE DESCANSO ---------------- */
let restInterval = null;
const restTimerState = { secondsLeft: 0, total: 0, active: false };

function formatRestTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function startRestTimer(seconds) {
  clearInterval(restInterval);
  restTimerState.total = seconds;
  restTimerState.secondsLeft = seconds;
  restTimerState.active = true;
  render();
  restInterval = setInterval(() => {
    restTimerState.secondsLeft--;
    const el = document.getElementById("rest-timer-seconds");
    if (el) el.textContent = formatRestTime(restTimerState.secondsLeft);
    if (restTimerState.secondsLeft <= 0) {
      clearInterval(restInterval);
      restTimerState.active = false;
      notifyRestDone();
      render();
    }
  }, 1000);
}

function stopRestTimer() {
  clearInterval(restInterval);
  restTimerState.active = false;
  render();
}

function notifyRestDone() {
  if (navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch (e) {} }
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function restTimerBarHTML() {
  if (!restTimerState.active) return "";
  const pct = restTimerState.total > 0 ? (restTimerState.total - restTimerState.secondsLeft) / restTimerState.total : 0;
  return `
    <div style="position:fixed;top:0;left:0;right:0;z-index:30;display:flex;justify-content:center;">
      <div style="max-width:460px;width:100%;background:var(--accent-water);color:#14161A;padding:10px 16px;padding-top:calc(10px + env(safe-area-inset-top));display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 16px rgba(0,0,0,0.3);">
        <div style="display:flex;align-items:center;gap:8px;">
          <strong style="font-size:13px;">Descanso:</strong>
          <span id="rest-timer-seconds" style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums;">${formatRestTime(restTimerState.secondsLeft)}</span>
        </div>
        <button data-action="skip-rest-timer" style="background:#14161A;color:var(--accent-water);border:none;border-radius:8px;padding:6px 12px;font-weight:700;font-size:12px;">Pular</button>
      </div>
    </div>`;
}

function editSet(exId, idx, field, val) {
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, sets: e.sets.map((s, i) => i === idx ? { ...s, [field]: val } : s) });
  return updateWorkout(next);
}

function addSet(exId) {
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, sets: [...e.sets, { reps: 10, weight: 0, done: false }] });
  updateWorkout(next).then(render);
}

function removeSet(exId, idx) {
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, sets: e.sets.filter((_, i) => i !== idx) });
  updateWorkout(next).then(render);
}

function addExtraExercise() {
  const f = state.extraExerciseForm;
  const name = (f.name || "").trim();
  if (!name) return;
  const numSets = Number(f.sets) || 3;
  const reps = Number(f.reps) || 10;
  const weight = Number(f.weight) || 0;
  const sets = Array.from({ length: numSets }, () => ({ reps, weight, done: false }));
  const ex = { id: uid(), name, muscle: f.muscle, sets };
  updateWorkout([...state.workout, ex]).then(() => {
    state.showExtraExerciseForm = false;
    state.extraExerciseForm = { name: "", muscle: MUSCLES[0], sets: 3, reps: 10, weight: 0 };
    render();
  });
}

function saveNewPlan() {
  const name = (state.newPlanForm.name || "").trim();
  if (!name || state.newPlanDraftExercises.length === 0) return;
  const plan = { id: uid(), name, muscle: state.newPlanForm.muscle, exercises: state.newPlanDraftExercises };
  state.plans = [...state.plans, plan];
  saveKey("plans", state.plans).then(() => {
    state.showNewPlanForm = false;
    state.newPlanDraftExercises = [];
    state.newPlanForm = { name: "", muscle: MUSCLES[0] };
    render();
  });
}

function deletePlan(id) {
  state.plans = state.plans.filter((p) => p.id !== id);
  saveKey("plans", state.plans).then(render);
}

/* ---------------- DIETA: AÇÕES ---------------- */
function addCustomFoodItem() {
  const f = state.customFood;
  const name = (f.name || "").trim();
  if (!name) return;
  state.mealDraftItems.push({
    name, grams: 100,
    kcal100: Number(f.kcal) || 0, protein100: Number(f.protein) || 0,
    carb100: Number(f.carb) || 0, fat100: Number(f.fat) || 0,
  });
  state.showCustomFood = false;
  state.customFood = { name: "", kcal: "", protein: "", carb: "", fat: "" };
  render();
}

function saveMeal() {
  if (state.mealDraftItems.length === 0) return;
  const name = (state.mealForm.name || "").trim() || "Refeição";
  const totals = state.mealDraftItems.reduce((a, it) => {
    const f = it.grams / 100;
    return { kcal: a.kcal + it.kcal100 * f, protein: a.protein + it.protein100 * f, carb: a.carb + it.carb100 * f, fat: a.fat + it.fat100 * f };
  }, { kcal: 0, protein: 0, carb: 0, fat: 0 });
  const meal = {
    id: uid(), name,
    calories: Math.round(totals.kcal), protein: Math.round(totals.protein), carb: Math.round(totals.carb), fat: Math.round(totals.fat),
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    items: state.mealDraftItems.map((it) => ({ name: it.name, grams: it.grams })),
  };
  updateMeals([...state.meals, meal]).then(() => {
    state.showMealForm = false;
    state.mealDraftItems = [];
    state.showCustomFood = false;
    state.mealForm = { name: "" };
    render();
  });
}

function removeMeal(id) {
  updateMeals(state.meals.filter((m) => m.id !== id)).then(render);
}

function swapFoodItem(mealId, itemIndex, newName) {
  const mealIdx = state.meals.findIndex((m) => m.id === mealId);
  if (mealIdx === -1) return;
  const meal = state.meals[mealIdx];
  const oldItem = meal.items[itemIndex];
  const oldFood = findFood(oldItem.name);
  const newFood = findFood(newName);
  if (!oldFood || !newFood) return;

  // Ajusta a quantidade do novo alimento pra manter as calorias parecidas com o que foi trocado
  const oldKcal = (oldFood.kcal * oldItem.grams) / 100;
  const newGrams = Math.max(5, Math.round((oldKcal / newFood.kcal) * 100 / 5) * 5);

  const newItems = meal.items.map((it, i) => i === itemIndex ? { name: newName, grams: newGrams } : it);
  const totals = newItems.reduce((acc, it) => {
    const food = findFood(it.name);
    if (!food) return acc;
    const f = it.grams / 100;
    return { kcal: acc.kcal + food.kcal * f, protein: acc.protein + food.protein * f, carb: acc.carb + food.carb * f, fat: acc.fat + food.fat * f };
  }, { kcal: 0, protein: 0, carb: 0, fat: 0 });

  const newMeals = state.meals.map((m, i) => i !== mealIdx ? m : {
    ...m, items: newItems,
    calories: Math.round(totals.kcal), protein: Math.round(totals.protein),
    carb: Math.round(totals.carb), fat: Math.round(totals.fat),
  });

  updateMeals(newMeals).then(() => {
    state.swapTarget = null;
    render();
  });
}

function syncAiFormFromProfile() {
  const current = state.config.currentWeight;
  const goal = state.config.weightGoal;
  if (current > 0) state.aiForm.peso = current;
  if (goal > 0) state.aiForm.metaPeso = goal;
  if (current > 0 && goal > 0) {
    const diff = current - goal;
    if (diff > 1) state.aiForm.objetivo = "Emagrecimento";
    else if (diff < -1) state.aiForm.objetivo = "Ganho de massa";
    else state.aiForm.objetivo = "Manutenção";
  }
}

async function syncProfileFromAiForm() {
  const peso = Number(state.aiForm.peso) || 0;
  const meta = Number(state.aiForm.metaPeso) || 0;
  const patch = {};
  if (peso > 0) { patch.currentWeight = peso; patch.waterGoal = calcWaterGoal(peso); }
  if (meta > 0) patch.weightGoal = meta;
  if (Object.keys(patch).length > 0) await updateConfig(patch);
  // Também registra o peso de hoje, pra aparecer certinho na aba Progresso
  if (peso > 0) {
    await saveKey(`weight:${dk()}`, { kg: peso });
    const idx = state.weightHistory.findIndex((h) => h.date === dk());
    if (idx >= 0) state.weightHistory[idx].kg = peso;
  }
}

async function gerarDietaIA() {
  state.aiLoading = true;
  state.aiError = "";
  state.aiPlan = null;
  render();
  try {
    await syncProfileFromAiForm();
    // Pequeno atraso só pra dar sensação de "processando" — o cálculo em si é instantâneo, local e gratuito.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const parsed = generateAutoDiet(state.aiForm);
    if (!parsed.meals || parsed.meals.length === 0) throw new Error("Não foi possível montar o plano.");
    state.aiPlan = parsed;
  } catch (e) {
    console.error(e);
    state.aiError = "Não consegui montar o plano agora. Tente novamente.";
  } finally {
    state.aiLoading = false;
    render();
  }
}

function applyAiPlan() {
  const plan = state.aiPlan;
  if (!plan) return;
  const templateMeals = plan.meals.map((m) => ({
    name: m.name, time: m.time || "",
    calories: Number(m.calories) || 0, protein: Number(m.protein) || 0,
    carb: Number(m.carb) || 0, fat: Number(m.fat) || 0,
    items: (m.items || []).map((it) => ({ name: it.name, grams: it.grams })),
  }));
  const withIds = templateMeals.map((m) => ({ ...m, id: uid(), items: m.items.map((it) => ({ ...it })) }));

  updateMeals(withIds).then(async () => {
    await updateConfig({
      calorieGoal: Number(plan.calorieGoal) || DEFAULT_CONFIG.calorieGoal,
      proteinGoal: Number(plan.proteinGoal) || DEFAULT_CONFIG.proteinGoal,
      carbGoal: Number(plan.carbGoal) || DEFAULT_CONFIG.carbGoal,
      fatGoal: Number(plan.fatGoal) || DEFAULT_CONFIG.fatGoal,
    });
    // Salva como a dieta FIXA — vale pra todos os dias a partir de agora,
    // até você gerar uma nova (dias já visitados antes não mudam retroativamente).
    await saveKey("fixedDiet", {
      calorieGoal: Number(plan.calorieGoal) || DEFAULT_CONFIG.calorieGoal,
      proteinGoal: Number(plan.proteinGoal) || DEFAULT_CONFIG.proteinGoal,
      carbGoal: Number(plan.carbGoal) || DEFAULT_CONFIG.carbGoal,
      fatGoal: Number(plan.fatGoal) || DEFAULT_CONFIG.fatGoal,
      meals: templateMeals,
    });
    state.aiPlan = null;
    state.showAiForm = false;
    render();
  });
}

/* ---------------- ÁGUA: AÇÕES ---------------- */
function addCustomWater() {
  const v = Number(state.customWaterValue);
  if (!v) return;
  updateWater(state.water + v).then(() => {
    state.customWaterValue = "";
    render();
  });
}

/* ---------------- PROGRESSO: AÇÕES ---------------- */
function saveWeight() {
  const kg = Number(state.weightInput);
  if (!kg || kg <= 0) return;
  saveKey(`weight:${dk()}`, { kg }).then(async () => {
    const idx = state.weightHistory.findIndex((h) => h.date === dk());
    if (idx >= 0) state.weightHistory[idx].kg = kg;
    // Se for o peso de hoje (ou mais recente que o já guardado), atualiza o perfil
    // pra esse valor ficar disponível em outras telas (como a geração de dieta),
    // e recalcula a meta de água automaticamente (35ml por kg).
    if (dk() === dateKey(new Date())) {
      await updateConfig({ currentWeight: kg, waterGoal: calcWaterGoal(kg) });
    }
    render();
  });
}
