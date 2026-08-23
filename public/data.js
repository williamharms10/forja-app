const MUSCLES = ["Peito", "Costas", "Perna", "Ombro", "Braço", "Core", "Cardio", "Pliometria", "Alongamento"];
const MUSCLE_COLOR = {
  Peito: "#FF7A52", Costas: "#4FA8FF", Perna: "#C8FF4D",
  Ombro: "#FFD166", Braço: "#FF5C8A", Core: "#8B8F97", Cardio: "#4FE3C2",
  Pliometria: "#FF3B5C", Alongamento: "#7FD8E8",
};
const LOCAIS = ["Ambos", "Academia", "Casa"];

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
  // Peito
  { name: "Supino reto", muscle: "Peito", local: "Academia", enQuery: "barbell bench press" },
  { name: "Supino inclinado", muscle: "Peito", local: "Academia", enQuery: "incline bench press" },
  { name: "Supino declinado", muscle: "Peito", local: "Academia", enQuery: "decline bench press" },
  { name: "Crucifixo reto", muscle: "Peito", local: "Academia", enQuery: "dumbbell fly" },
  { name: "Crossover", muscle: "Peito", local: "Academia", enQuery: "cable crossover" },
  { name: "Flexão de braço", muscle: "Peito", local: "Ambos", enQuery: "push up" },
  { name: "Flexão diamante", muscle: "Peito", local: "Ambos", enQuery: "diamond push up" },
  { name: "Flexão inclinada", muscle: "Peito", local: "Ambos", enQuery: "incline push up" },
  { name: "Flexão declinada (pés elevados)", muscle: "Peito", local: "Ambos", enQuery: "decline push up" },
  { name: "Peck deck (voador)", muscle: "Peito", local: "Academia", enQuery: "pec deck fly" },
  // Costas
  { name: "Puxada frontal (pulley)", muscle: "Costas", local: "Academia", enQuery: "lat pulldown" },
  { name: "Remada curvada", muscle: "Costas", local: "Academia", enQuery: "bent over row" },
  { name: "Remada baixa (cabo)", muscle: "Costas", local: "Academia", enQuery: "seated cable row" },
  { name: "Remada unilateral (serrote)", muscle: "Costas", local: "Academia", enQuery: "one arm dumbbell row" },
  { name: "Barra fixa", muscle: "Costas", local: "Ambos", enQuery: "pull up" },
  { name: "Levantamento terra", muscle: "Costas", local: "Academia", enQuery: "deadlift" },
  { name: "Pulldown", muscle: "Costas", local: "Academia", enQuery: "pulldown" },
  { name: "Hiperextensão lombar", muscle: "Costas", local: "Academia", enQuery: "back extension" },
  { name: "Superman (extensão lombar no chão)", muscle: "Costas", local: "Ambos", enQuery: "superman exercise" },
  // Perna
  { name: "Agachamento livre", muscle: "Perna", local: "Ambos", enQuery: "barbell full squat" },
  { name: "Agachamento no smith", muscle: "Perna", local: "Academia", enQuery: "smith machine squat" },
  { name: "Agachamento sumô", muscle: "Perna", local: "Ambos", enQuery: "sumo squat" },
  { name: "Leg press 45°", muscle: "Perna", local: "Academia", enQuery: "leg press" },
  { name: "Cadeira extensora", muscle: "Perna", local: "Academia", enQuery: "leg extension" },
  { name: "Mesa flexora", muscle: "Perna", local: "Academia", enQuery: "lying leg curl" },
  { name: "Cadeira flexora", muscle: "Perna", local: "Academia", enQuery: "seated leg curl" },
  { name: "Afundo (passada)", muscle: "Perna", local: "Ambos", enQuery: "lunge" },
  { name: "Afundo búlgaro", muscle: "Perna", local: "Ambos", enQuery: "bulgarian split squat" },
  { name: "Stiff", muscle: "Perna", local: "Ambos", enQuery: "stiff leg deadlift" },
  { name: "Panturrilha em pé", muscle: "Perna", local: "Ambos", enQuery: "standing calf raise" },
  { name: "Panturrilha sentado", muscle: "Perna", local: "Academia", enQuery: "seated calf raise" },
  { name: "Panturrilha unilateral", muscle: "Perna", local: "Ambos", enQuery: "single leg calf raise" },
  { name: "Cadeira adutora", muscle: "Perna", local: "Academia", enQuery: "hip adduction machine" },
  { name: "Cadeira abdutora", muscle: "Perna", local: "Academia", enQuery: "hip abduction machine" },
  { name: "Elevação de quadril (ponte de glúteo)", muscle: "Perna", local: "Ambos", enQuery: "glute bridge" },
  { name: "Cadeira na parede (wall sit)", muscle: "Perna", local: "Ambos", enQuery: "wall sit" },
  // Ombro
  { name: "Desenvolvimento militar", muscle: "Ombro", local: "Academia", enQuery: "military press" },
  { name: "Desenvolvimento Arnold", muscle: "Ombro", local: "Academia", enQuery: "arnold press" },
  { name: "Elevação lateral", muscle: "Ombro", local: "Ambos", enQuery: "lateral raise" },
  { name: "Elevação frontal", muscle: "Ombro", local: "Ambos", enQuery: "front raise" },
  { name: "Remada alta", muscle: "Ombro", local: "Academia", enQuery: "upright row" },
  { name: "Face pull", muscle: "Ombro", local: "Academia", enQuery: "face pull" },
  { name: "Encolhimento de trapézio", muscle: "Ombro", local: "Academia", enQuery: "shrug" },
  // Braço
  { name: "Rosca direta (barra)", muscle: "Braço", local: "Academia", enQuery: "barbell curl" },
  { name: "Rosca alternada (halteres)", muscle: "Braço", local: "Academia", enQuery: "alternate dumbbell curl" },
  { name: "Rosca martelo", muscle: "Braço", local: "Academia", enQuery: "hammer curl" },
  { name: "Rosca scott", muscle: "Braço", local: "Academia", enQuery: "preacher curl" },
  { name: "Tríceps testa", muscle: "Braço", local: "Academia", enQuery: "lying triceps extension" },
  { name: "Tríceps corda (pulley)", muscle: "Braço", local: "Academia", enQuery: "triceps pushdown" },
  { name: "Tríceps francês", muscle: "Braço", local: "Academia", enQuery: "overhead triceps extension" },
  { name: "Mergulho no banco (dips)", muscle: "Braço", local: "Ambos", enQuery: "bench dip" },
  { name: "Dips entre duas cadeiras", muscle: "Braço", local: "Casa", enQuery: "chair dip" },
  // Core
  { name: "Abdominal supra", muscle: "Core", local: "Ambos", enQuery: "crunch" },
  { name: "Abdominal infra", muscle: "Core", local: "Ambos", enQuery: "reverse crunch" },
  { name: "Prancha", muscle: "Core", local: "Ambos", enQuery: "plank" },
  { name: "Prancha lateral", muscle: "Core", local: "Ambos", enQuery: "side plank" },
  { name: "Elevação de pernas", muscle: "Core", local: "Ambos", enQuery: "hanging leg raise" },
  { name: "Russian twist", muscle: "Core", local: "Ambos", enQuery: "russian twist" },
  { name: "Mountain climber", muscle: "Core", local: "Ambos", enQuery: "mountain climber" },
  { name: "Bicicleta abdominal", muscle: "Core", local: "Ambos", enQuery: "bicycle crunch" },
  // Cardio
  { name: "Esteira (corrida/caminhada)", muscle: "Cardio", local: "Academia", enQuery: "treadmill running" },
  { name: "Bicicleta ergométrica", muscle: "Cardio", local: "Academia", enQuery: "stationary bike" },
  { name: "Elíptico", muscle: "Cardio", local: "Academia", enQuery: "elliptical trainer" },
  { name: "Pular corda", muscle: "Cardio", local: "Ambos", enQuery: "jump rope" },
  { name: "HIIT", muscle: "Cardio", local: "Ambos", enQuery: "high intensity interval training" },
  { name: "Remo (ergômetro)", muscle: "Cardio", local: "Academia", enQuery: "rowing machine" },
  { name: "Corrida com elevação de joelhos (high knees)", muscle: "Cardio", local: "Ambos", enQuery: "high knees" },
  // Pliometria (movimentos explosivos)
  { name: "Agachamento com salto (jump squat)", muscle: "Pliometria", local: "Ambos", enQuery: "jump squat" },
  { name: "Salto na caixa (box jump)", muscle: "Pliometria", local: "Academia", enQuery: "box jump" },
  { name: "Burpee", muscle: "Pliometria", local: "Ambos", enQuery: "burpee" },
  { name: "Avanço com salto (jump lunge)", muscle: "Pliometria", local: "Ambos", enQuery: "jumping lunge" },
  { name: "Polichinelo", muscle: "Pliometria", local: "Ambos", enQuery: "jumping jack" },
  { name: "Flexão com palmas (clap push-up)", muscle: "Pliometria", local: "Ambos", enQuery: "clap push up" },
  { name: "Salto lateral (skater jump)", muscle: "Pliometria", local: "Ambos", enQuery: "skater jump" },
  { name: "Salto em distância (broad jump)", muscle: "Pliometria", local: "Ambos", enQuery: "broad jump" },
  { name: "Tuck jump (joelhos ao peito)", muscle: "Pliometria", local: "Ambos", enQuery: "tuck jump" },
  { name: "Corrida estacionária explosiva", muscle: "Pliometria", local: "Ambos", enQuery: "high knees running in place" },
  // Alongamento
  { name: "Alongamento de isquiotibiais", muscle: "Alongamento", local: "Ambos", enQuery: "hamstring stretch" },
  { name: "Alongamento de quadríceps", muscle: "Alongamento", local: "Ambos", enQuery: "quad stretch" },
  { name: "Alongamento de panturrilha", muscle: "Alongamento", local: "Ambos", enQuery: "calf stretch" },
  { name: "Alongamento de peitoral", muscle: "Alongamento", local: "Ambos", enQuery: "chest stretch" },
  { name: "Alongamento de ombros (cruzado)", muscle: "Alongamento", local: "Ambos", enQuery: "shoulder stretch" },
  { name: "Alongamento de tríceps", muscle: "Alongamento", local: "Ambos", enQuery: "triceps stretch" },
  { name: "Alongamento de pescoço", muscle: "Alongamento", local: "Ambos", enQuery: "neck stretch" },
  { name: "Alongamento lombar (joelhos ao peito)", muscle: "Alongamento", local: "Ambos", enQuery: "lower back stretch" },
  { name: "Gato-vaca (mobilidade de coluna)", muscle: "Alongamento", local: "Ambos", enQuery: "cat cow stretch" },
  { name: "Alongamento de adutores", muscle: "Alongamento", local: "Ambos", enQuery: "groin stretch" },
  { name: "Alongamento de flexores do quadril", muscle: "Alongamento", local: "Ambos", enQuery: "hip flexor stretch" },
  { name: "Torção de tronco sentado", muscle: "Alongamento", local: "Ambos", enQuery: "seated trunk rotation" },
  // Aparelhos de máquina — nomes reais usados nas academias
  { name: "Supino articulado (máquina)", muscle: "Peito", local: "Academia", enQuery: "hammer strength chest press" },
  { name: "Voador inverso (deltoide posterior)", muscle: "Ombro", local: "Academia", enQuery: "reverse pec deck" },
  { name: "Remada articulada (máquina)", muscle: "Costas", local: "Academia", enQuery: "hammer strength row machine" },
  { name: "Remada cavalinho (T-bar row)", muscle: "Costas", local: "Academia", enQuery: "t bar row" },
  { name: "Graviton (barra fixa assistida)", muscle: "Costas", local: "Academia", enQuery: "assisted pull up machine" },
  { name: "Puxada alta unilateral", muscle: "Costas", local: "Academia", enQuery: "single arm lat pulldown" },
  { name: "Hack machine (agachamento hack)", muscle: "Perna", local: "Academia", enQuery: "hack squat machine" },
  { name: "Leg press horizontal", muscle: "Perna", local: "Academia", enQuery: "horizontal leg press" },
  { name: "Panturrilha no leg press", muscle: "Perna", local: "Academia", enQuery: "calf press on leg press" },
  { name: "Mesa flexora em pé (unilateral)", muscle: "Perna", local: "Academia", enQuery: "standing leg curl" },
  { name: "Desenvolvimento articulado (máquina)", muscle: "Ombro", local: "Academia", enQuery: "hammer strength shoulder press" },
  { name: "Elevação lateral na máquina", muscle: "Ombro", local: "Academia", enQuery: "lateral raise machine" },
  { name: "Mergulho assistido (graviton)", muscle: "Braço", local: "Academia", enQuery: "assisted dip machine" },
  { name: "Tríceps na polia alta (corda unilateral)", muscle: "Braço", local: "Academia", enQuery: "single arm triceps pushdown" },
  { name: "Rosca na polia baixa", muscle: "Braço", local: "Academia", enQuery: "cable curl" },
  { name: "Abdominal na polia (cable crunch)", muscle: "Core", local: "Academia", enQuery: "cable crunch" },
  { name: "Rotativo de tronco (máquina)", muscle: "Core", local: "Academia", enQuery: "torso rotation machine" },
  { name: "Cadeira romana (elevação de joelhos)", muscle: "Core", local: "Academia", enQuery: "captains chair leg raise" },
];

// Busca exercícios equivalentes (mesmo grupo muscular), útil quando a academia
// não tem o aparelho ou você quer uma opção diferente pra treinar em casa.
// Prioriza sugerir primeiro os que dá pra fazer em qualquer lugar (mais chance
// de você conseguir fazer na hora), deixando os que exigem academia por último.
function getExerciseSubstitutes(name, muscle, limit) {
  const priority = { "Ambos": 0, "Casa": 1, "Academia": 2 };
  const subs = EXERCISE_DB.filter((e) => e.muscle === muscle && e.name !== name);
  subs.sort((a, b) => (priority[a.local] ?? 3) - (priority[b.local] ?? 3));
  return subs.slice(0, limit || 6);
}

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
  {
    id: "planE", name: "Treino E — Casa (sem equipamento)", muscle: "Perna",
    exercises: [
      { name: "Agachamento livre", muscle: "Perna" },
      { name: "Flexão de braço", muscle: "Peito" },
      { name: "Afundo (passada)", muscle: "Perna" },
      { name: "Elevação de quadril (ponte de glúteo)", muscle: "Perna" },
      { name: "Prancha", muscle: "Core" },
      { name: "Superman (extensão lombar no chão)", muscle: "Costas" },
    ],
  },
  {
    id: "planF", name: "Treino F — Pliometria e explosão", muscle: "Pliometria",
    exercises: [
      { name: "Polichinelo", muscle: "Pliometria" },
      { name: "Agachamento com salto (jump squat)", muscle: "Pliometria" },
      { name: "Burpee", muscle: "Pliometria" },
      { name: "Avanço com salto (jump lunge)", muscle: "Pliometria" },
      { name: "Salto lateral (skater jump)", muscle: "Pliometria" },
    ],
  },
  {
    id: "planG", name: "Treino G — Alongamento e mobilidade", muscle: "Alongamento",
    exercises: [
      { name: "Alongamento de isquiotibiais", muscle: "Alongamento" },
      { name: "Alongamento de quadríceps", muscle: "Alongamento" },
      { name: "Alongamento de panturrilha", muscle: "Alongamento" },
      { name: "Gato-vaca (mobilidade de coluna)", muscle: "Alongamento" },
      { name: "Alongamento lombar (joelhos ao peito)", muscle: "Alongamento" },
      { name: "Alongamento de ombros (cruzado)", muscle: "Alongamento" },
    ],
  },
];

/* ---------------- GERADOR AUTOMÁTICO DE DIETA (100% local, sem IA/API paga) ---------------- */
// Agrupamento por categoria nutricional — usado pra sugerir trocas equivalentes
// (ex: trocar arroz por batata-doce, ambos carboidratos; frango por peixe, ambos proteína).
const FOOD_GROUP = {
  "Arroz branco cozido": "carb", "Arroz integral cozido": "carb", "Macarrão cozido": "carb",
  "Aveia em flocos": "carb", "Pão francês": "carb", "Pão de forma integral": "carb",
  "Tapioca (goma hidratada)": "carb", "Batata inglesa cozida": "carb", "Batata doce cozida": "carb",
  "Mandioca cozida": "carb", "Quinoa cozida": "carb", "Granola": "carb",

  "Feijão carioca cozido": "leguminosa", "Feijão preto cozido": "leguminosa",
  "Lentilha cozida": "leguminosa", "Grão de bico cozido": "leguminosa",

  "Peito de frango grelhado": "proteina", "Frango, coxa/sobrecoxa assada": "proteina",
  "Carne moída cozida (patinho)": "proteina", "Contra-filé grelhado (sem gordura)": "proteina",
  "Alcatra grelhada": "proteina", "Carne suína (lombo assado)": "proteina",
  "Tilápia grelhada": "proteina", "Salmão grelhado": "proteina", "Atum em água (lata)": "proteina",
  "Camarão cozido": "proteina", "Ovo cozido (unidade ~50g)": "proteina", "Ovo, clara (unidade)": "proteina",
  "Tofu": "proteina", "Proteína de soja (PTS) hidratada": "proteina",

  "Leite integral": "laticinio", "Leite desnatado": "laticinio", "Iogurte natural integral": "laticinio",
  "Iogurte grego natural": "laticinio", "Queijo minas frescal": "laticinio", "Queijo muçarela": "laticinio",
  "Requeijão cremoso": "laticinio", "Whey protein (pó)": "laticinio",

  "Azeite de oliva": "gordura", "Óleo de coco": "gordura", "Manteiga": "gordura",
  "Pasta de amendoim": "gordura", "Amendoim torrado": "gordura", "Castanha do Pará": "gordura",
  "Castanha de caju": "gordura", "Amêndoas": "gordura", "Abacate": "gordura",

  "Banana prata": "fruta", "Maçã": "fruta", "Laranja": "fruta", "Mamão": "fruta",
  "Manga": "fruta", "Morango": "fruta", "Uva": "fruta", "Abacaxi": "fruta", "Melancia": "fruta",

  "Brócolis cozido": "vegetal", "Cenoura crua": "vegetal", "Alface": "vegetal", "Tomate": "vegetal",
  "Espinafre cozido": "vegetal", "Abobrinha cozida": "vegetal", "Couve refogada": "vegetal",
  "Pepino": "vegetal", "Beterraba cozida": "vegetal",
};

function getSubstitutes(foodName, limit) {
  const group = FOOD_GROUP[foodName];
  if (!group) return [];
  return FOOD_DB.filter((f) => FOOD_GROUP[f.name] === group && f.name !== foodName).slice(0, limit || 6);
}

// Recomendação padrão nutricional: 35ml de água por kg de peso corporal
function calcWaterGoal(kg) {
  if (!kg || kg <= 0) return 0;
  return Math.round((kg * 35) / 50) * 50;
}

/* ---------------- GERADOR AUTOMÁTICO DE TREINO (100% local, sem IA/API paga) ---------------- */
const SPLIT_TEMPLATES = {
  2: [
    { label: "Treino A — Corpo todo", muscles: ["Peito", "Costas", "Perna"] },
    { label: "Treino B — Corpo todo", muscles: ["Ombro", "Braço", "Core", "Perna"] },
  ],
  3: [
    { label: "Treino A — Peito e Tríceps", muscles: ["Peito", "Braço"] },
    { label: "Treino B — Costas e Bíceps", muscles: ["Costas", "Braço"] },
    { label: "Treino C — Perna e Ombro", muscles: ["Perna", "Ombro"] },
  ],
  4: [
    { label: "Treino A — Peito e Tríceps", muscles: ["Peito", "Braço"] },
    { label: "Treino B — Costas e Bíceps", muscles: ["Costas", "Braço"] },
    { label: "Treino C — Perna", muscles: ["Perna"] },
    { label: "Treino D — Ombro e Core", muscles: ["Ombro", "Core"] },
  ],
  5: [
    { label: "Treino A — Peito", muscles: ["Peito"] },
    { label: "Treino B — Costas", muscles: ["Costas"] },
    { label: "Treino C — Perna", muscles: ["Perna"] },
    { label: "Treino D — Ombro", muscles: ["Ombro"] },
    { label: "Treino E — Braço e Core", muscles: ["Braço", "Core"] },
  ],
  6: [
    { label: "Treino A — Peito", muscles: ["Peito"] },
    { label: "Treino B — Costas", muscles: ["Costas"] },
    { label: "Treino C — Perna", muscles: ["Perna"] },
    { label: "Treino D — Ombro", muscles: ["Ombro"] },
    { label: "Treino E — Braço", muscles: ["Braço"] },
    { label: "Treino F — Core e Cardio", muscles: ["Core", "Cardio"] },
  ],
};

// Faixas de repetição baseadas em princípios comuns de treinamento:
// força/composto ~8 reps, hipertrofia ~8-12, resistência/emagrecimento ~12-15+.
// O primeiro exercício de cada grupo muscular no dia é tratado como "composto"
// (mais pesado, menos reps); os seguintes como "isolados" (mais reps, foco em volume).
function setsForGoal(objetivo, isCompound) {
  if (objetivo === "Ganho de massa") return isCompound ? 4 : 3;
  return 3;
}
function repsForGoal(objetivo, isCompound) {
  const table = {
    "Ganho de massa": isCompound ? 8 : 12,
    "Manutenção": isCompound ? 10 : 12,
    "Emagrecimento": isCompound ? 12 : 15,
  };
  return table[objetivo] || 12;
}

function generateWorkoutSplit(form) {
  const dias = Math.min(6, Math.max(2, Number(form.dias) || 3));
  const templates = SPLIT_TEMPLATES[dias];
  const local = form.local || "Ambos";
  const objetivo = form.objetivo || "Manutenção";

  const pool = local === "Ambos" ? EXERCISE_DB : EXERCISE_DB.filter((e) => e.local === local || e.local === "Ambos");

  return templates.map((tpl, idx) => {
    let exercises = [];
    tpl.muscles.forEach((m) => {
      const candidates = pool.filter((e) => e.muscle === m);
      const perMuscle = Math.max(2, Math.floor(6 / tpl.muscles.length));
      candidates.slice(0, perMuscle).forEach((e, i) => {
        const isCompound = i === 0; // primeiro da lista pro grupo = exercício principal
        exercises.push({
          name: e.name, muscle: e.muscle,
          sets: setsForGoal(objetivo, isCompound),
          reps: repsForGoal(objetivo, isCompound),
        });
      });
    });
    if (objetivo === "Emagrecimento") {
      const extra = pool.filter((e) => e.muscle === "Pliometria" || e.muscle === "Cardio");
      if (extra.length > 0) {
        const e = extra[idx % extra.length];
        exercises.push({ name: e.name, muscle: e.muscle, sets: 3, reps: 15 });
      }
    }
    exercises = exercises.slice(0, 6);
    return {
      id: uid(), name: tpl.label, muscle: tpl.muscles[0],
      exercises,
      genSets: setsForGoal(objetivo, true), genReps: repsForGoal(objetivo, true),
    };
  });
}

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
  const metaPeso = Number(form.metaPeso) || 0;

  // Fórmula de Mifflin-St Jeor (padrão nutricional)
  let bmr = 10 * peso + 6.25 * altura - 5 * idade + (isMale ? 5 : -161);
  const activityFactor = { "Sedentário": 1.2, "Leve (1-3x/sem)": 1.375, "Moderado (3-5x/sem)": 1.55, "Intenso (6-7x/sem)": 1.725 }[form.atividade] || 1.375;
  let tdee = bmr * activityFactor;

  // Se a pessoa tem peso atual e meta registrados, calcula o déficit/superávit
  // proporcional à distância até a meta (mais longe da meta = ajuste um pouco maior,
  // dentro de limites seguros). Sem meta registrada, usa um valor padrão fixo.
  const diffToGoal = metaPeso > 0 ? peso - metaPeso : 0;
  let adjust = 0;
  if (form.objetivo === "Emagrecimento") {
    if (diffToGoal > 0) {
      adjust = -Math.min(750, Math.max(300, Math.round(diffToGoal * 40)));
    } else {
      adjust = -500;
    }
  } else if (form.objetivo === "Ganho de massa") {
    if (diffToGoal < 0) {
      adjust = Math.min(500, Math.max(200, Math.round(Math.abs(diffToGoal) * 25)));
    } else {
      adjust = 300;
    }
  }

  let calorieGoal = tdee + adjust;
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
