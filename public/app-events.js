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
  });

  setupSearch("new-plan-ex-query", "new-plan-ex-suggestions", EXERCISE_DB, (ex) => ex.name, (ex) => {
    if (!state.newPlanDraftExercises.some((d) => d.name === ex.name)) {
      state.newPlanDraftExercises.push({ name: ex.name, muscle: ex.muscle });
    }
    render();
  });

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
  if (t.id === "goal-weight") updateConfig({ weightGoal: Number(t.value) || 0 }).then(render);

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
    case "show-manager": state.showManager = true; render(); break;
    case "close-manager": state.showManager = false; render(); break;
    case "trocar-treino": trocarTreino(); break;
    case "remove-exercise": removeExercise(btn.dataset.ex); break;
    case "toggle-set": toggleSet(btn.dataset.ex, Number(btn.dataset.idx)); break;
    case "add-set": addSet(btn.dataset.ex); break;
    case "remove-set": removeSet(btn.dataset.ex, Number(btn.dataset.idx)); break;
    case "show-extra-exercise": state.showExtraExerciseForm = true; render(); break;
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

    case "toggle-ai-form":
      state.showAiForm = !state.showAiForm;
      state.aiError = "";
      state.aiPlan = null;
      render();
      break;
    case "gerar-dieta-ia": gerarDietaIA(); break;
    case "apply-ai-plan": applyAiPlan(); break;
    case "discard-ai-plan": state.aiPlan = null; render(); break;

    case "add-water": updateWater(state.water + Number(btn.dataset.ml)).then(render); break;
    case "add-custom-water": addCustomWater(); break;
    case "toggle-water-goal-edit": state.showWaterGoalEdit = !state.showWaterGoalEdit; render(); break;
    case "toggle-weight-goal-edit": state.showWeightGoalEdit = !state.showWeightGoalEdit; render(); break;
    case "save-weight": saveWeight(); break;
  }
}

/* ---------------- BUSCA (autocomplete) ---------------- */
function setupSearch(inputId, boxId, db, nameFn, onPick) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);
  if (!input || !box) return;
  input.addEventListener("input", () => {
    const q = normalize(input.value);
    if (!q) { box.innerHTML = ""; return; }
    const matches = db.filter((item) => normalize(nameFn(item)).includes(q)).slice(0, 6);
    if (matches.length === 0) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="suggest-box">${matches.map((item, i) => `
      <button type="button" class="suggest-item" data-i="${i}">
        <span style="font-size:12.5px;">${escapeHtml(item.name)}</span>
        <span style="font-size:10px;font-weight:700;color:${MUSCLE_COLOR[item.muscle] || "var(--text-faint)"};">${item.muscle || ""}</span>
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
  const seeded = plan.exercises.map((ex) => ({
    id: uid(), name: ex.name, muscle: ex.muscle,
    sets: [{ reps: 10, weight: 0, done: false }, { reps: 10, weight: 0, done: false }, { reps: 10, weight: 0, done: false }],
  }));
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

function removeExercise(id) {
  updateWorkout(state.workout.filter((e) => e.id !== id)).then(render);
}

function toggleSet(exId, idx) {
  const next = state.workout.map((e) => e.id !== exId ? e : { ...e, sets: e.sets.map((s, i) => i === idx ? { ...s, done: !s.done } : s) });
  updateWorkout(next).then(render);
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

async function gerarDietaIA() {
  state.aiLoading = true;
  state.aiError = "";
  state.aiPlan = null;
  render();
  try {
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
  const withIds = plan.meals.map((m) => ({
    id: uid(), name: m.name, time: m.time || "",
    calories: Number(m.calories) || 0, protein: Number(m.protein) || 0,
    carb: Number(m.carb) || 0, fat: Number(m.fat) || 0,
  }));
  updateMeals(withIds).then(async () => {
    await updateConfig({
      calorieGoal: Number(plan.calorieGoal) || DEFAULT_CONFIG.calorieGoal,
      proteinGoal: Number(plan.proteinGoal) || DEFAULT_CONFIG.proteinGoal,
      carbGoal: Number(plan.carbGoal) || DEFAULT_CONFIG.carbGoal,
      fatGoal: Number(plan.fatGoal) || DEFAULT_CONFIG.fatGoal,
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
  saveKey(`weight:${dk()}`, { kg }).then(() => {
    const idx = state.weightHistory.findIndex((h) => h.date === dk());
    if (idx >= 0) state.weightHistory[idx].kg = kg;
    render();
  });
}
