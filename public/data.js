const MUSCLES = ["Peito", "Costas", "Perna", "Ombro", "Braço", "Core", "Cardio"];
const MUSCLE_COLOR = {
  Peito: "#FF7A52", Costas: "#4FA8FF", Perna: "#C8FF4D",
  Ombro: "#FFD166", Braço: "#FF5C8A", Core: "#8B8F97", Cardio: "#4FE3C2",
};

// Valores por 100g — baseados na Tabela Brasileira de Composição de Alimentos (TACO/UNICAMP)
// e referências nutricionais padrão (USDA) para itens não brasileiros.
const FOOD_DB = [
  // Cereais, grãos e massas
  { name: "Arroz branco cozido", kcal: 128, protein: 2.5, carb: 28.1, fat: 0.2 },
  { name: "Arroz integral cozido", kcal: 124, protein: 2.6, carb: 25.8, fat: 1.0 },
  { name: "Feijão carioca cozido", kcal: 76, protein: 4.8, carb: 13.6, fat: 0.5 },
  { name: "Feijão preto cozido", kcal: 77, protein: 4.5, carb: 14.0, fat: 0.5 },
  { name: "Lentilha cozida", kcal: 93, protein: 6.3, carb: 16.3, fat: 0.5 },
  { name: "Grão de bico cozido", kcal: 121, protein: 6.7, carb: 20.4, fat: 1.9 },
  { name: "Macarrão cozido", kcal: 111, protein: 3.5, carb: 22.7, fat: 0.5 },
  { name: "Aveia em flocos", kcal: 394, protein: 13.9, carb: 67.0, fat: 8.5 },
  { name: "Pão francês", kcal: 300, protein: 8.0, carb: 58.6, fat: 3.1 },
  { name: "Pão de forma integral", kcal: 253, protein: 9.4, carb: 43.3, fat: 4.0 },
  { name: "Tapioca (goma hidratada)", kcal: 240, protein: 0.2, carb: 59.0, fat: 0.0 },
  { name: "Batata inglesa cozida", kcal: 52, protein: 1.2, carb: 11.9, fat: 0.1 },
  { name: "Batata doce cozida", kcal: 77, protein: 0.6, carb: 18.4, fat: 0.1 },
  { name: "Mandioca cozida", kcal: 125, protein: 0.6, carb: 30.1, fat: 0.3 },
  { name: "Quinoa cozida", kcal: 120, protein: 4.4, carb: 21.3, fat: 1.9 },
  // Proteínas animais
  { name: "Peito de frango grelhado", kcal: 159, protein: 32.0, carb: 0.0, fat: 3.5 },
  { name: "Frango, coxa/sobrecoxa assada", kcal: 214, protein: 26.0, carb: 0.0, fat: 11.5 },
  { name: "Carne moída cozida (patinho)", kcal: 212, protein: 26.0, carb: 0.0, fat: 11.0 },
  { name: "Contra-filé grelhado (sem gordura)", kcal: 194, protein: 35.9, carb: 0.0, fat: 4.8 },
  { name: "Alcatra grelhada", kcal: 241, protein: 32.5, carb: 0.0, fat: 11.7 },
  { name: "Carne suína (lombo assado)", kcal: 210, protein: 30.0, carb: 0.0, fat: 9.0 },
  { name: "Tilápia grelhada", kcal: 128, protein: 26.2, carb: 0.0, fat: 2.0 },
  { name: "Salmão grelhado", kcal: 208, protein: 22.1, carb: 0.0, fat: 13.0 },
  { name: "Atum em água (lata)", kcal: 116, protein: 25.5, carb: 0.0, fat: 1.0 },
  { name: "Camarão cozido", kcal: 99, protein: 20.9, carb: 0.5, fat: 1.1 },
  { name: "Ovo cozido (unidade ~50g)", kcal: 78, protein: 6.5, carb: 0.6, fat: 5.3 },
  { name: "Ovo, clara (unidade)", kcal: 17, protein: 3.6, carb: 0.2, fat: 0.1 },
  // Laticínios
  { name: "Leite integral", kcal: 61, protein: 3.2, carb: 4.5, fat: 3.3 },
  { name: "Leite desnatado", kcal: 35, protein: 3.4, carb: 4.9, fat: 0.2 },
  { name: "Iogurte natural integral", kcal: 61, protein: 3.5, carb: 4.7, fat: 3.0 },
  { name: "Iogurte grego natural", kcal: 97, protein: 9.0, carb: 4.0, fat: 5.0 },
  { name: "Queijo minas frescal", kcal: 264, protein: 17.4, carb: 3.2, fat: 20.2 },
  { name: "Queijo muçarela", kcal: 330, protein: 22.6, carb: 3.0, fat: 25.2 },
  { name: "Requeijão cremoso", kcal: 257, protein: 9.6, carb: 3.0, fat: 23.0 },
  { name: "Whey protein (pó)", kcal: 400, protein: 80.0, carb: 8.0, fat: 6.0 },
  // Gorduras e oleaginosas
  { name: "Azeite de oliva", kcal: 884, protein: 0.0, carb: 0.0, fat: 100.0 },
  { name: "Óleo de coco", kcal: 862, protein: 0.0, carb: 0.0, fat: 100.0 },
  { name: "Manteiga", kcal: 726, protein: 0.6, carb: 0.1, fat: 82.4 },
  { name: "Pasta de amendoim", kcal: 588, protein: 25.0, carb: 20.0, fat: 50.0 },
  { name: "Amendoim torrado", kcal: 567, protein: 27.2, carb: 20.3, fat: 43.9 },
  { name: "Castanha do Pará", kcal: 656, protein: 14.5, carb: 12.3, fat: 66.4 },
  { name: "Castanha de caju", kcal: 570, protein: 18.5, carb: 29.1, fat: 46.3 },
  { name: "Amêndoas", kcal: 579, protein: 21.2, carb: 21.6, fat: 49.9 },
  { name: "Abacate", kcal: 96, protein: 1.2, carb: 6.0, fat: 8.4 },
  // Frutas
  { name: "Banana prata", kcal: 98, protein: 1.3, carb: 26.0, fat: 0.1 },
  { name: "Maçã", kcal: 56, protein: 0.3, carb: 15.2, fat: 0.2 },
  { name: "Laranja", kcal: 45, protein: 1.0, carb: 11.5, fat: 0.1 },
  { name: "Mamão", kcal: 40, protein: 0.6, carb: 10.4, fat: 0.1 },
  { name: "Manga", kcal: 64, protein: 0.4, carb: 16.7, fat: 0.2 },
  { name: "Morango", kcal: 30, protein: 0.9, carb: 6.8, fat: 0.3 },
  { name: "Uva", kcal: 53, protein: 0.6, carb: 13.3, fat: 0.2 },
  { name: "Abacaxi", kcal: 48, protein: 0.9, carb: 12.3, fat: 0.1 },
  { name: "Melancia", kcal: 33, protein: 0.9, carb: 8.1, fat: 0.0 },
  // Vegetais e legumes
  { name: "Brócolis cozido", kcal: 25, protein: 2.1, carb: 4.4, fat: 0.3 },
  { name: "Cenoura crua", kcal: 34, protein: 0.9, carb: 7.7, fat: 0.2 },
  { name: "Alface", kcal: 11, protein: 1.3, carb: 1.7, fat: 0.2 },
  { name: "Tomate", kcal: 15, protein: 1.1, carb: 3.1, fat: 0.2 },
  { name: "Espinafre cozido", kcal: 19, protein: 2.4, carb: 2.3, fat: 0.3 },
  { name: "Abobrinha cozida", kcal: 17, protein: 1.0, carb: 3.9, fat: 0.2 },
  { name: "Couve refogada", kcal: 80, protein: 1.8, carb: 6.5, fat: 5.8 },
  { name: "Pepino", kcal: 10, protein: 0.9, carb: 2.0, fat: 0.1 },
  { name: "Beterraba cozida", kcal: 32, protein: 1.3, carb: 7.3, fat: 0.1 },
  // Outros / suplementos e itens comuns
  { name: "Açúcar refinado", kcal: 387, protein: 0.0, carb: 99.8, fat: 0.0 },
  { name: "Mel", kcal: 309, protein: 0.4, carb: 84.0, fat: 0.0 },
  { name: "Chocolate ao leite", kcal: 540, protein: 7.3, carb: 58.3, fat: 31.4 },
  { name: "Granola", kcal: 471, protein: 10.1, carb: 61.7, fat: 20.1 },
  { name: "Tofu", kcal: 76, protein: 8.1, carb: 1.9, fat: 4.8 },
  { name: "Proteína de soja (PTS) hidratada", kcal: 89, protein: 13.0, carb: 6.0, fat: 1.0 },
];

// Biblioteca de exercícios por grupo muscular (referência de treino de força comum em academias)
const EXERCISE_DB = [
  { name: "Supino reto", muscle: "Peito" },
  { name: "Supino inclinado", muscle: "Peito" },
  { name: "Supino declinado", muscle: "Peito" },
  { name: "Crucifixo reto", muscle: "Peito" },
  { name: "Crossover", muscle: "Peito" },
  { name: "Flexão de braço", muscle: "Peito" },
  { name: "Peck deck (voador)", muscle: "Peito" },
  { name: "Puxada frontal (pulley)", muscle: "Costas" },
  { name: "Remada curvada", muscle: "Costas" },
  { name: "Remada baixa (cabo)", muscle: "Costas" },
  { name: "Remada unilateral (serrote)", muscle: "Costas" },
  { name: "Barra fixa", muscle: "Costas" },
  { name: "Levantamento terra", muscle: "Costas" },
  { name: "Pulldown", muscle: "Costas" },
  { name: "Hiperextensão lombar", muscle: "Costas" },
  { name: "Agachamento livre", muscle: "Perna" },
  { name: "Agachamento no smith", muscle: "Perna" },
  { name: "Leg press 45°", muscle: "Perna" },
  { name: "Cadeira extensora", muscle: "Perna" },
  { name: "Mesa flexora", muscle: "Perna" },
  { name: "Cadeira flexora", muscle: "Perna" },
  { name: "Afundo (passada)", muscle: "Perna" },
  { name: "Stiff", muscle: "Perna" },
  { name: "Panturrilha em pé", muscle: "Perna" },
  { name: "Panturrilha sentado", muscle: "Perna" },
  { name: "Cadeira adutora", muscle: "Perna" },
  { name: "Cadeira abdutora", muscle: "Perna" },
  { name: "Desenvolvimento militar", muscle: "Ombro" },
  { name: "Desenvolvimento Arnold", muscle: "Ombro" },
  { name: "Elevação lateral", muscle: "Ombro" },
  { name: "Elevação frontal", muscle: "Ombro" },
  { name: "Remada alta", muscle: "Ombro" },
  { name: "Face pull", muscle: "Ombro" },
  { name: "Encolhimento de trapézio", muscle: "Ombro" },
  { name: "Rosca direta (barra)", muscle: "Braço" },
  { name: "Rosca alternada (halteres)", muscle: "Braço" },
  { name: "Rosca martelo", muscle: "Braço" },
  { name: "Rosca scott", muscle: "Braço" },
  { name: "Tríceps testa", muscle: "Braço" },
  { name: "Tríceps corda (pulley)", muscle: "Braço" },
  { name: "Tríceps francês", muscle: "Braço" },
  { name: "Mergulho no banco (dips)", muscle: "Braço" },
  { name: "Abdominal supra", muscle: "Core" },
  { name: "Abdominal infra", muscle: "Core" },
  { name: "Prancha", muscle: "Core" },
  { name: "Elevação de pernas", muscle: "Core" },
  { name: "Russian twist", muscle: "Core" },
  { name: "Esteira (corrida/caminhada)", muscle: "Cardio" },
  { name: "Bicicleta ergométrica", muscle: "Cardio" },
  { name: "Elíptico", muscle: "Cardio" },
  { name: "Pular corda", muscle: "Cardio" },
  { name: "HIIT", muscle: "Cardio" },
  { name: "Remo (ergômetro)", muscle: "Cardio" },
];

const DEFAULT_PLANS = [
  {
    id: "planA", name: "Treino A — Peito e Tríceps", muscle: "Peito",
    exercises: [
      { name: "Supino reto", muscle: "Peito" },
      { name: "Supino inclinado", muscle: "Peito" },
      { name: "Crucifixo reto", muscle: "Peito" },
      { name: "Tríceps corda (pulley)", muscle: "Braço" },
      { name: "Tríceps testa", muscle: "Braço" },
    ],
  },
  {
    id: "planB", name: "Treino B — Costas e Bíceps", muscle: "Costas",
    exercises: [
      { name: "Puxada frontal (pulley)", muscle: "Costas" },
      { name: "Remada curvada", muscle: "Costas" },
      { name: "Remada unilateral (serrote)", muscle: "Costas" },
      { name: "Rosca direta (barra)", muscle: "Braço" },
      { name: "Rosca martelo", muscle: "Braço" },
    ],
  },
  {
    id: "planC", name: "Treino C — Perna", muscle: "Perna",
    exercises: [
      { name: "Agachamento livre", muscle: "Perna" },
      { name: "Leg press 45°", muscle: "Perna" },
      { name: "Cadeira extensora", muscle: "Perna" },
      { name: "Mesa flexora", muscle: "Perna" },
      { name: "Panturrilha em pé", muscle: "Perna" },
    ],
  },
  {
    id: "planD", name: "Treino D — Ombro e Core", muscle: "Ombro",
    exercises: [
      { name: "Desenvolvimento militar", muscle: "Ombro" },
      { name: "Elevação lateral", muscle: "Ombro" },
      { name: "Remada alta", muscle: "Ombro" },
      { name: "Abdominal supra", muscle: "Core" },
      { name: "Prancha", muscle: "Core" },
    ],
  },
];

/* ---------------- GERADOR AUTOMÁTICO DE DIETA (100% local, sem IA/API paga) ---------------- */
function findFood(name) {
  return FOOD_DB.find((f) => f.name === name);
}

const MEAL_COMBOS = {
  breakfast: [
    [{ name: "Pão francês", grams: 50 }, { name: "Ovo cozido (unidade ~50g)", grams: 100 }, { name: "Mamão", grams: 120 }],
    [{ name: "Tapioca (goma hidratada)", grams: 80 }, { name: "Queijo minas frescal", grams: 40 }, { name: "Banana prata", grams: 100 }],
    [{ name: "Aveia em flocos", grams: 40 }, { name: "Leite integral", grams: 200 }, { name: "Banana prata", grams: 100 }],
  ],
  lunch: [
    [{ name: "Arroz branco cozido", grams: 150 }, { name: "Feijão carioca cozido", grams: 100 }, { name: "Peito de frango grelhado", grams: 120 }, { name: "Brócolis cozido", grams: 80 }],
    [{ name: "Arroz integral cozido", grams: 150 }, { name: "Feijão preto cozido", grams: 100 }, { name: "Carne moída cozida (patinho)", grams: 120 }, { name: "Cenoura crua", grams: 60 }],
    [{ name: "Batata doce cozida", grams: 150 }, { name: "Peito de frango grelhado", grams: 130 }, { name: "Espinafre cozido", grams: 80 }],
    [{ name: "Quinoa cozida", grams: 130 }, { name: "Grão de bico cozido", grams: 100 }, { name: "Tofu", grams: 100 }, { name: "Couve refogada", grams: 60 }],
  ],
  snack: [
    [{ name: "Iogurte natural integral", grams: 170 }, { name: "Banana prata", grams: 100 }, { name: "Aveia em flocos", grams: 20 }],
    [{ name: "Pasta de amendoim", grams: 20 }, { name: "Pão de forma integral", grams: 50 }, { name: "Maçã", grams: 120 }],
    [{ name: "Whey protein (pó)", grams: 30 }, { name: "Banana prata", grams: 100 }],
    [{ name: "Castanha do Pará", grams: 20 }, { name: "Maçã", grams: 120 }],
  ],
  dinner: [
    [{ name: "Batata doce cozida", grams: 130 }, { name: "Tilápia grelhada", grams: 130 }, { name: "Brócolis cozido", grams: 80 }],
    [{ name: "Arroz branco cozido", grams: 120 }, { name: "Ovo cozido (unidade ~50g)", grams: 100 }, { name: "Tomate", grams: 60 }, { name: "Alface", grams: 30 }],
    [{ name: "Ovo cozido (unidade ~50g)", grams: 150 }, { name: "Queijo minas frescal", grams: 30 }, { name: "Alface", grams: 30 }],
    [{ name: "Grão de bico cozido", grams: 120 }, { name: "Tofu", grams: 100 }, { name: "Abobrinha cozida", grams: 80 }],
  ],
  supper: [
    [{ name: "Iogurte natural integral", grams: 170 }],
    [{ name: "Leite integral", grams: 200 }, { name: "Aveia em flocos", grams: 20 }],
  ],
};

const SLOT_TEMPLATES = {
  2: [{ name: "Almoço", cat: "lunch", pct: 0.55, time: "12:30" }, { name: "Jantar", cat: "dinner", pct: 0.45, time: "19:30" }],
  3: [{ name: "Café da manhã", cat: "breakfast", pct: 0.25, time: "07:30" }, { name: "Almoço", cat: "lunch", pct: 0.45, time: "12:30" }, { name: "Jantar", cat: "dinner", pct: 0.30, time: "19:30" }],
  4: [{ name: "Café da manhã", cat: "breakfast", pct: 0.25, time: "07:30" }, { name: "Almoço", cat: "lunch", pct: 0.35, time: "12:30" }, { name: "Lanche da tarde", cat: "snack", pct: 0.15, time: "16:00" }, { name: "Jantar", cat: "dinner", pct: 0.25, time: "19:30" }],
  5: [{ name: "Café da manhã", cat: "breakfast", pct: 0.20, time: "07:30" }, { name: "Lanche da manhã", cat: "snack", pct: 0.10, time: "10:00" }, { name: "Almoço", cat: "lunch", pct: 0.30, time: "12:30" }, { name: "Lanche da tarde", cat: "snack", pct: 0.15, time: "16:00" }, { name: "Jantar", cat: "dinner", pct: 0.25, time: "19:30" }],
  6: [{ name: "Café da manhã", cat: "breakfast", pct: 0.18, time: "07:00" }, { name: "Lanche da manhã", cat: "snack", pct: 0.10, time: "10:00" }, { name: "Almoço", cat: "lunch", pct: 0.27, time: "12:30" }, { name: "Lanche da tarde", cat: "snack", pct: 0.12, time: "16:00" }, { name: "Jantar", cat: "dinner", pct: 0.23, time: "19:30" }, { name: "Ceia", cat: "supper", pct: 0.10, time: "21:30" }],
};

const RESTRICTION_EXCLUDES = {
  vegetariano: ["Peito de frango grelhado", "Frango, coxa/sobrecoxa assada", "Carne moída cozida (patinho)", "Contra-filé grelhado (sem gordura)", "Alcatra grelhada", "Carne suína (lombo assado)", "Tilápia grelhada", "Salmão grelhado", "Atum em água (lata)", "Camarão cozido"],
  vegano: ["Peito de frango grelhado", "Frango, coxa/sobrecoxa assada", "Carne moída cozida (patinho)", "Contra-filé grelhado (sem gordura)", "Alcatra grelhada", "Carne suína (lombo assado)", "Tilápia grelhada", "Salmão grelhado", "Atum em água (lata)", "Camarão cozido", "Ovo cozido (unidade ~50g)", "Queijo minas frescal", "Leite integral", "Iogurte natural integral", "Requeijão cremoso", "Whey protein (pó)", "Manteiga"],
  lactose: ["Leite integral", "Leite desnatado", "Iogurte natural integral", "Iogurte grego natural", "Queijo minas frescal", "Queijo muçarela", "Requeijão cremoso", "Manteiga", "Whey protein (pó)"],
  gluten: ["Pão francês", "Pão de forma integral", "Macarrão cozido"],
};

function comboExcluded(combo, excludedNames) {
  return combo.some((item) => excludedNames.includes(item.name));
}

function filterCombosByRestriction(combos, restricoesText) {
  const q = normalize(restricoesText || "");
  let excluded = [];
  if (q.includes("vegan")) excluded = excluded.concat(RESTRICTION_EXCLUDES.vegano);
  else if (q.includes("vegetarian")) excluded = excluded.concat(RESTRICTION_EXCLUDES.vegetariano);
  if (q.includes("lactose") || q.includes("laticinio") || q.includes("leite")) excluded = excluded.concat(RESTRICTION_EXCLUDES.lactose);
  if (q.includes("gluten")) excluded = excluded.concat(RESTRICTION_EXCLUDES.gluten);
  if (excluded.length === 0) return combos;
  const filtered = combos.filter((c) => !comboExcluded(c, excluded));
  return filtered.length > 0 ? filtered : combos;
}

function generateAutoDiet(form) {
  const peso = Number(form.peso) || 70;
  const altura = Number(form.altura) || 170;
  const idade = Number(form.idade) || 30;
  const isMale = form.sexo === "Masculino";

  // Fórmula de Mifflin-St Jeor (padrão nutricional)
  let bmr = 10 * peso + 6.25 * altura - 5 * idade + (isMale ? 5 : -161);
  const activityFactor = { "Sedentário": 1.2, "Leve (1-3x/sem)": 1.375, "Moderado (3-5x/sem)": 1.55, "Intenso (6-7x/sem)": 1.725 }[form.atividade] || 1.375;
  let tdee = bmr * activityFactor;

  let calorieGoal = tdee;
  if (form.objetivo === "Emagrecimento") calorieGoal -= 500;
  if (form.objetivo === "Ganho de massa") calorieGoal += 300;
  calorieGoal = Math.max(1200, Math.round(calorieGoal / 10) * 10);

  const proteinGoal = Math.round(peso * (form.objetivo === "Ganho de massa" ? 2.2 : 2.0));
  const fatGoal = Math.round(peso * 0.8);
  const carbGoal = Math.max(50, Math.round((calorieGoal - proteinGoal * 4 - fatGoal * 9) / 4));

  const n = Math.min(6, Math.max(2, Number(form.refeicoes) || 4));
  const slots = SLOT_TEMPLATES[n];

  const meals = slots.map((slot) => {
    const combosAll = MEAL_COMBOS[slot.cat];
    const combos = filterCombosByRestriction(combosAll, form.restricoes);
    const combo = combos[Math.floor(Math.random() * combos.length)];

    const baseTotals = combo.reduce((acc, item) => {
      const food = findFood(item.name);
      if (!food) return acc;
      const f = item.grams / 100;
      return { kcal: acc.kcal + food.kcal * f, protein: acc.protein + food.protein * f, carb: acc.carb + food.carb * f, fat: acc.fat + food.fat * f };
    }, { kcal: 0, protein: 0, carb: 0, fat: 0 });

    const targetKcal = calorieGoal * slot.pct;
    let scale = baseTotals.kcal > 0 ? targetKcal / baseTotals.kcal : 1;
    scale = Math.max(0.5, Math.min(2.2, scale));

    const items = combo.map((item) => ({ name: item.name, grams: Math.round((item.grams * scale) / 5) * 5 }));
    const totals = items.reduce((acc, item) => {
      const food = findFood(item.name);
      if (!food) return acc;
      const f = item.grams / 100;
      return { kcal: acc.kcal + food.kcal * f, protein: acc.protein + food.protein * f, carb: acc.carb + food.carb * f, fat: acc.fat + food.fat * f };
    }, { kcal: 0, protein: 0, carb: 0, fat: 0 });

    return {
      name: slot.name, time: slot.time,
      calories: Math.round(totals.kcal), protein: Math.round(totals.protein), carb: Math.round(totals.carb), fat: Math.round(totals.fat),
      items,
    };
  });

  return { calorieGoal, proteinGoal, carbGoal, fatGoal, meals };
}
