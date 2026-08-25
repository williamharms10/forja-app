const MUSCLES = ["Peito", "Costas", "Perna", "Ombro", "Bíceps", "Tríceps", "Core", "Cardio", "Pliometria", "Alongamento"];
const MUSCLE_COLOR = {
  Peito: "#FF7A52", Costas: "#4FA8FF", Perna: "#C8FF4D",
  Ombro: "#FFD166", Bíceps: "#FF5C8A", Tríceps: "#C77DFF", Core: "#8B8F97", Cardio: "#4FE3C2",
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

  // === Expansão TACO completa (NEPA/UNICAMP) — itens adicionais selecionados ===
  { name: "Abiu cru", kcal: 62.4, protein: 0.8, carb: 14.9, fat: 0.7 },
  { name: "Caju cru", kcal: 43.1, protein: 1.0, carb: 10.3, fat: 0.3 },
  { name: "Figo cru", kcal: 41.4, protein: 1.0, carb: 10.2, fat: 0.2 },
  { name: "Kiwi cru", kcal: 51.1, protein: 1.3, carb: 11.5, fat: 0.6 },
  { name: "Umbu cru", kcal: 37.0, protein: 0.8, carb: 9.4, fat: 0.0 },
  { name: "Cacau cru", kcal: 74.3, protein: 1.0, carb: 19.4, fat: 0.1 },
  { name: "Jaca crua", kcal: 87.9, protein: 1.4, carb: 22.5, fat: 0.3 },
  { name: "Jambo cru", kcal: 26.9, protein: 0.9, carb: 6.5, fat: 0.1 },
  { name: "Melão cru", kcal: 29.4, protein: 0.7, carb: 7.5, fat: 0.0 },
  { name: "Pequi cru", kcal: 205.0, protein: 2.3, carb: 13.0, fat: 18.0 },
  { name: "Romã crua", kcal: 55.7, protein: 0.4, carb: 15.1, fat: 0.0 },
  { name: "Pinha crua", kcal: 88.5, protein: 1.5, carb: 22.4, fat: 0.3 },
  { name: "Abacate cru", kcal: 96.2, protein: 1.2, carb: 6.0, fat: 8.4 },
  { name: "Abacaxi cru", kcal: 48.3, protein: 0.9, carb: 12.3, fat: 0.1 },
  { name: "Ameixa crua", kcal: 52.5, protein: 0.8, carb: 13.9, fat: 0.0 },
  { name: "Cupuaçu cru", kcal: 49.4, protein: 1.2, carb: 10.4, fat: 1.0 },
  { name: "Jamelão cru", kcal: 41.0, protein: 0.5, carb: 10.6, fat: 0.1 },
  { name: "Morango cru", kcal: 30.1, protein: 0.9, carb: 6.8, fat: 0.3 },
  { name: "Acerola crua", kcal: 33.5, protein: 0.9, carb: 8.0, fat: 0.2 },
  { name: "Atemóia crua", kcal: 97.0, protein: 1.0, carb: 25.3, fat: 0.3 },
  { name: "Macaúba crua", kcal: 404.3, protein: 2.1, carb: 13.9, fat: 40.7 },
  { name: "Maracujá cru", kcal: 68.4, protein: 2.0, carb: 12.3, fat: 2.1 },
  { name: "Nêspera crua", kcal: 42.5, protein: 0.3, carb: 11.5, fat: 0.0 },
  { name: "Pitanga crua", kcal: 41.4, protein: 0.9, carb: 10.2, fat: 0.2 },
  { name: "Melancia crua", kcal: 32.6, protein: 0.9, carb: 8.1, fat: 0.0 },
  { name: "Tamarindo cru", kcal: 275.7, protein: 3.2, carb: 72.5, fat: 0.5 },
  { name: "Uva Rubi crua", kcal: 49.1, protein: 0.6, carb: 12.7, fat: 0.2 },
  { name: "Cajá-Manga cru", kcal: 45.6, protein: 1.3, carb: 11.4, fat: 0.0 },
  { name: "Carambola crua", kcal: 45.7, protein: 0.9, carb: 11.5, fat: 0.2 },
  { name: "Ciriguela crua", kcal: 75.6, protein: 1.4, carb: 18.9, fat: 0.4 },
  { name: "Fruta-pão crua", kcal: 67.0, protein: 1.1, carb: 17.2, fat: 0.2 },
  { name: "Pêra Park crua", kcal: 60.6, protein: 0.2, carb: 16.1, fat: 0.2 },
  { name: "Uva Itália crua", kcal: 52.9, protein: 0.7, carb: 13.6, fat: 0.2 },
  { name: "Banana figo crua", kcal: 105.1, protein: 1.1, carb: 27.8, fat: 0.1 },
  { name: "Banana maçã crua", kcal: 86.8, protein: 1.8, carb: 22.3, fat: 0.1 },
  { name: "Aipo cru", kcal: 19.1, protein: 0.8, carb: 4.3, fat: 0.1 },
  { name: "Alho cru", kcal: 113.1, protein: 7.0, carb: 23.9, fat: 0.2 },
  { name: "Cará cru", kcal: 95.6, protein: 2.3, carb: 23.0, fat: 0.1 },
  { name: "Jiló cru", kcal: 27.4, protein: 1.4, carb: 6.2, fat: 0.2 },
  { name: "Nabo cru", kcal: 18.2, protein: 1.2, carb: 4.1, fat: 0.1 },
  { name: "Agrião cru", kcal: 16.6, protein: 2.7, carb: 2.3, fat: 0.2 },
  { name: "Caruru cru", kcal: 34.0, protein: 3.2, carb: 6.0, fat: 0.6 },
  { name: "Chuchu cru", kcal: 17.0, protein: 0.7, carb: 4.1, fat: 0.1 },
  { name: "Inhame cru", kcal: 96.7, protein: 2.1, carb: 23.2, fat: 0.2 },
  { name: "Maxixe cru", kcal: 13.7, protein: 1.4, carb: 2.7, fat: 0.1 },
  { name: "Pepino cru", kcal: 9.5, protein: 0.9, carb: 2.0, fat: 0.0 },
  { name: "Quiabo cru", kcal: 29.9, protein: 1.9, carb: 6.4, fat: 0.3 },
  { name: "Salsa crua", kcal: 33.4, protein: 3.3, carb: 5.7, fat: 0.6 },
  { name: "Vagem crua", kcal: 24.9, protein: 1.8, carb: 5.3, fat: 0.2 },
  { name: "Acelga crua", kcal: 20.9, protein: 1.4, carb: 4.6, fat: 0.1 },
  { name: "Cará cozido", kcal: 77.6, protein: 1.5, carb: 18.9, fat: 0.1 },
  { name: "Cebola crua", kcal: 39.4, protein: 1.7, carb: 8.9, fat: 0.1 },
  { name: "Rúcula crua", kcal: 13.1, protein: 1.8, carb: 2.2, fat: 0.1 },
  { name: "Taioba crua", kcal: 34.2, protein: 2.9, carb: 5.4, fat: 0.9 },
  { name: "Tomate purê", kcal: 27.9, protein: 1.4, carb: 6.9, fat: 0.0 },
  { name: "Almeirão cru", kcal: 18.0, protein: 1.8, carb: 3.3, fat: 0.2 },
  { name: "Brócolis cru", kcal: 25.5, protein: 3.6, carb: 4.0, fat: 0.3 },
  { name: "Rabanete cru", kcal: 13.7, protein: 1.4, carb: 2.7, fat: 0.1 },
  { name: "Alfavaca crua", kcal: 29.2, protein: 2.7, carb: 5.2, fat: 0.5 },
  { name: "Alho-poró cru", kcal: 31.5, protein: 1.4, carb: 6.9, fat: 0.1 },
  { name: "Chicória crua", kcal: 13.8, protein: 1.1, carb: 2.9, fat: 0.1 },
  { name: "Chuchu cozido", kcal: 18.5, protein: 0.4, carb: 4.8, fat: 0.0 },
  { name: "Jurubeba crua", kcal: 125.8, protein: 4.4, carb: 23.1, fat: 3.9 },
  { name: "Mandioca crua", kcal: 151.4, protein: 1.1, carb: 36.2, fat: 0.3 },
  { name: "Polvilho doce", kcal: 351.2, protein: 0.4, carb: 86.8, fat: 0.0 },
  { name: "Serralha crua", kcal: 30.4, protein: 2.7, carb: 4.9, fat: 0.7 },
  { name: "Tomate salada", kcal: 20.5, protein: 0.8, carb: 5.1, fat: 0.0 },
  { name: "Berinjela crua", kcal: 19.6, protein: 1.2, carb: 4.4, fat: 0.1 },
  { name: "Beterraba crua", kcal: 48.8, protein: 1.9, carb: 11.1, fat: 0.1 },
  { name: "Catalonha crua", kcal: 23.9, protein: 1.9, carb: 4.8, fat: 0.3 },
  { name: "Salame", kcal: 397.8, protein: 25.8, carb: 2.9, fat: 30.6 },
  { name: "Mortadela", kcal: 268.8, protein: 12.0, carb: 5.8, fat: 21.6 },
  { name: "Quibe cru", kcal: 109.5, protein: 12.4, carb: 10.8, fat: 1.7 },
  { name: "Apresuntado", kcal: 128.9, protein: 13.4, carb: 2.9, fat: 6.7 },
  { name: "Quibe frito", kcal: 253.8, protein: 14.9, carb: 12.3, fat: 15.8 },
  { name: "Quibe assado", kcal: 136.2, protein: 14.6, carb: 12.9, fat: 2.7 },
  { name: "Toucinho cru", kcal: 592.5, protein: 11.5, carb: 0.0, fat: 60.3 },
  { name: "Toucinho frito", kcal: 696.6, protein: 27.3, carb: 0.0, fat: 64.3 },
  { name: "Porco lombo cru", kcal: 175.6, protein: 22.6, carb: 0.0, fat: 8.8 },
  { name: "Porco pernil cru", kcal: 186.1, protein: 20.1, carb: 0.0, fat: 11.1 },
  { name: "Frango fígado cru", kcal: 106.5, protein: 17.6, carb: -0.0, fat: 3.5 },
  { name: "Frango coração cru", kcal: 221.5, protein: 12.6, carb: 0.0, fat: 18.6 },
  { name: "Peru congelado cru", kcal: 93.7, protein: 18.1, carb: 0.0, fat: 1.8 },
  { name: "Porco bisteca crua", kcal: 164.1, protein: 21.5, carb: 0.0, fat: 8.0 },
  { name: "Porco costela crua", kcal: 255.6, protein: 18.0, carb: 0.0, fat: 19.8 },
  { name: "Porco lombo assado", kcal: 210.2, protein: 35.7, carb: 0.0, fat: 6.4 },
  { name: "Lingüiça porco crua", kcal: 227.2, protein: 16.1, carb: 0.0, fat: 17.6 },
  { name: "Porco bisteca frita", kcal: 311.2, protein: 33.7, carb: 0.0, fat: 18.5 },
  { name: "Porco pernil assado", kcal: 262.3, protein: 32.1, carb: 0.0, fat: 13.9 },
  { name: "Lingüiça frango crua", kcal: 218.1, protein: 14.2, carb: 0.0, fat: 17.4 },
  { name: "Lingüiça porco frita", kcal: 279.5, protein: 20.5, carb: 0.0, fat: 21.3 },
  { name: "Porco costela assada", kcal: 402.2, protein: 30.2, carb: 0.0, fat: 30.3 },
  { name: "Croquete de carne cru", kcal: 245.8, protein: 12.0, carb: 13.9, fat: 15.6 },
  { name: "Hambúrguer bovino cru", kcal: 214.8, protein: 13.2, carb: 4.2, fat: 16.2 },
  { name: "Lingüiça frango frita", kcal: 245.5, protein: 18.3, carb: 0.0, fat: 18.5 },
  { name: "Peru congelado assado", kcal: 163.1, protein: 26.2, carb: 0.0, fat: 5.7 },
  { name: "Carne bovina bucho cru", kcal: 137.3, protein: 20.5, carb: 0.0, fat: 5.5 },
  { name: "Carne bovina cupim cru", kcal: 221.4, protein: 19.5, carb: 0.0, fat: 15.3 },
  { name: "Carne bovina seca crua", kcal: 312.7, protein: 19.7, carb: 0.0, fat: 25.4 },
  { name: "Frango filé à milanesa", kcal: 220.9, protein: 28.5, carb: 7.5, fat: 7.8 },
  { name: "Pão de soja", kcal: 308.7, protein: 11.3, carb: 56.5, fat: 3.6 },
  { name: "Milho fubá cru", kcal: 353.5, protein: 7.2, carb: 78.9, fat: 1.9 },
  { name: "Milho amido cru", kcal: 361.4, protein: 0.6, carb: 87.1, fat: 0.0 },
  { name: "Milho verde cru", kcal: 138.2, protein: 6.6, carb: 28.6, fat: 0.6 },
  { name: "Pão aveia forma", kcal: 343.1, protein: 12.3, carb: 59.6, fat: 5.7 },
  { name: "Pão milho forma", kcal: 292.0, protein: 8.3, carb: 56.4, fat: 3.1 },
  { name: "Arroz tipo 1 cru", kcal: 357.8, protein: 7.2, carb: 78.8, fat: 0.3 },
  { name: "Arroz tipo 2 cru", kcal: 358.1, protein: 7.2, carb: 78.9, fat: 0.3 },
  { name: "Bolo pronto coco", kcal: 333.4, protein: 5.7, carb: 52.3, fat: 11.3 },
  { name: "Farinha de rosca", kcal: 370.6, protein: 11.4, carb: 75.8, fat: 1.5 },
  { name: "Farinha de trigo", kcal: 360.5, protein: 9.8, carb: 75.1, fat: 1.4 },
  { name: "Pão glúten forma", kcal: 253.0, protein: 12.0, carb: 44.1, fat: 2.7 },
  { name: "Pão trigo sovado", kcal: 311.0, protein: 8.4, carb: 61.5, fat: 2.8 },
  { name: "Aveia flocos crua", kcal: 393.8, protein: 13.9, carb: 66.6, fat: 8.5 },
  { name: "Bolo mistura para", kcal: 418.6, protein: 6.2, carb: 84.7, fat: 6.1 },
  { name: "Bolo pronto aipim", kcal: 323.9, protein: 4.4, carb: 47.9, fat: 12.7 },
  { name: "Bolo pronto milho", kcal: 311.4, protein: 4.8, carb: 45.1, fat: 12.4 },
  { name: "Creme de arroz pó", kcal: 386.0, protein: 7.0, carb: 83.9, fat: 1.2 },
  { name: "Guandu cru", kcal: 344.1, protein: 19.0, carb: 64.0, fat: 2.1 },
  { name: "Tremoço cru", kcal: 381.3, protein: 33.6, carb: 43.8, fat: 10.3 },
  { name: "Soja farinha", kcal: 404.0, protein: 36.0, carb: 38.4, fat: 14.6 },
  { name: "Lentilha crua", kcal: 339.1, protein: 23.2, carb: 62.0, fat: 0.8 },
  { name: "Feijão jalo cru", kcal: 327.9, protein: 20.1, carb: 61.5, fat: 0.9 },
  { name: "Feijão roxo cru", kcal: 331.4, protein: 22.2, carb: 60.0, fat: 1.2 },
  { name: "Paçoca amendoim", kcal: 486.9, protein: 16.0, carb: 52.4, fat: 26.1 },
  { name: "Ervilha em vagem", kcal: 88.1, protein: 7.5, carb: 14.2, fat: 0.5 },
  { name: "Feijão preto cru", kcal: 323.6, protein: 21.3, carb: 58.8, fat: 1.2 },
  { name: "Grão-de-bico cru", kcal: 354.7, protein: 21.2, carb: 57.9, fat: 5.4 },
  { name: "Amendoim grão cru", kcal: 544.1, protein: 27.2, carb: 20.3, fat: 43.9 },
  { name: "Feijão rajado cru", kcal: 325.8, protein: 17.3, carb: 62.9, fat: 1.2 },
  { name: "Feijão carioca cru", kcal: 329.0, protein: 20.0, carb: 61.2, fat: 1.3 },
  { name: "Feijão jalo cozido", kcal: 92.7, protein: 6.1, carb: 16.5, fat: 0.5 },
  { name: "Queijo prato", kcal: 359.9, protein: 22.7, carb: 1.9, fat: 29.1 },
  { name: "Queijo ricota", kcal: 139.7, protein: 12.6, carb: 3.8, fat: 8.1 },
  { name: "Creme de Leite", kcal: 221.5, protein: 1.5, carb: 4.5, fat: 22.5 },
  { name: "Leite de cabra", kcal: 66.4, protein: 3.1, carb: 5.2, fat: 3.8 },
  { name: "Iogurte natural", kcal: 51.5, protein: 4.1, carb: 1.9, fat: 3.0 },
  { name: "Queijo mozarela", kcal: 329.9, protein: 22.6, carb: 3.0, fat: 25.2 },
  { name: "Queijo parmesão", kcal: 453.0, protein: 35.6, carb: 1.7, fat: 33.5 },
  { name: "Leite condensado", kcal: 312.6, protein: 7.7, carb: 57.0, fat: 6.7 },
  { name: "Leite fermentado", kcal: 69.6, protein: 1.9, carb: 15.7, fat: 0.1 },
  { name: "Queijo pasteurizado", kcal: 303.1, protein: 9.4, carb: 5.7, fat: 27.4 },
  { name: "Bebida láctea pêssego", kcal: 55.2, protein: 2.1, carb: 7.6, fat: 1.9 },
  { name: "Iogurte sabor morango", kcal: 69.6, protein: 2.7, carb: 9.7, fat: 2.3 },
  { name: "Iogurte sabor pêssego", kcal: 67.8, protein: 2.5, carb: 9.4, fat: 2.3 },
  { name: "Queijo minas meia cura", kcal: 320.7, protein: 21.2, carb: 3.6, fat: 24.6 },
  { name: "Corimba cru", kcal: 128.2, protein: 17.4, carb: -0.0, fat: 6.0 },
  { name: "Pintado cru", kcal: 91.1, protein: 18.6, carb: 0.0, fat: 1.3 },
  { name: "Manjuba frita", kcal: 349.3, protein: 30.1, carb: 0.0, fat: 24.5 },
  { name: "Porquinho cru", kcal: 93.0, protein: 20.5, carb: 0.0, fat: 0.6 },
  { name: "Pintado assado", kcal: 191.6, protein: 36.5, carb: 0.0, fat: 4.0 },
  { name: "Sardinha frita", kcal: 257.0, protein: 33.4, carb: 0.0, fat: 12.7 },
  { name: "Atum fresco cru", kcal: 117.5, protein: 25.7, carb: 0.0, fat: 0.9 },
  { name: "Pescadinha crua", kcal: 76.4, protein: 15.5, carb: 0.0, fat: 1.1 },
  { name: "Sardinha assada", kcal: 164.4, protein: 32.2, carb: 0.0, fat: 3.0 },
  { name: "Cação posta crua", kcal: 83.3, protein: 17.9, carb: 0.0, fat: 0.8 },
  { name: "Corimbatá assado", kcal: 261.5, protein: 19.9, carb: 0.0, fat: 19.6 },
  { name: "Corimbatá cozido", kcal: 238.7, protein: 20.1, carb: 0.0, fat: 16.9 },
  { name: "Omelete de queijo", kcal: 268.0, protein: 15.6, carb: 0.4, fat: 22.0 },
  { name: "Ovo de codorna inteiro cru", kcal: 176.9, protein: 13.7, carb: 0.8, fat: 12.7 },
  { name: "Ovo de galinha inteiro cru", kcal: 143.1, protein: 13.0, carb: 1.6, fat: 8.9 },
  { name: "Ovo de galinha inteiro frito", kcal: 240.2, protein: 15.6, carb: 1.2, fat: 18.6 },
  { name: "Ovo de galinha gema cozida/10minutos", kcal: 352.7, protein: 15.9, carb: 1.6, fat: 30.8 },
  { name: "Coco cru", kcal: 406.5, protein: 3.7, carb: 10.4, fat: 42.0 },
  { name: "Noz crua", kcal: 620.1, protein: 14.0, carb: 18.4, fat: 59.4 },
  { name: "Pinhão cozido", kcal: 174.4, protein: 3.0, carb: 43.9, fat: 0.7 },
  { name: "Pupunha cozida", kcal: 218.5, protein: 2.5, carb: 29.6, fat: 12.8 },
  { name: "Linhaça semente", kcal: 495.1, protein: 14.1, carb: 43.3, fat: 32.3 },
  { name: "Gergelim semente", kcal: 583.5, protein: 21.2, carb: 21.6, fat: 50.4 },
  { name: "Amêndoa torrada salgada", kcal: 580.7, protein: 18.6, carb: 29.5, fat: 47.3 },
  { name: "Castanha-do-Brasil crua", kcal: 643.0, protein: 14.5, carb: 15.1, fat: 63.5 },
  { name: "Manteiga com sal", kcal: 726.0, protein: 0.4, carb: 0.1, fat: 82.4 },
  { name: "Manteiga sem sal", kcal: 757.5, protein: 0.4, carb: 0.0, fat: 86.0 },
  { name: "Margarina com óleo hidrogenado com sal (65% de lipídeos)", kcal: 596.1, protein: 0.0, carb: 0.0, fat: 67.4 },
  { name: "Margarina com óleo hidrogenado sem sal (80% de lipídeos)", kcal: 722.5, protein: 0.0, carb: 0.0, fat: 81.7 },
  { name: "Margarina com óleo interesterificado com sal (65%de lipídeos)", kcal: 594.5, protein: 0.0, carb: 0.0, fat: 67.2 },
  { name: "Melado", kcal: 296.5, protein: 0.0, carb: 76.6, fat: 0.0 },
  { name: "Quindim", kcal: 411.3, protein: 4.7, carb: 46.3, fat: 24.4 },
  { name: "Rapadura", kcal: 352.0, protein: 1.0, carb: 90.8, fat: 0.1 },
  { name: "Marmelada", kcal: 257.2, protein: 0.4, carb: 70.8, fat: 0.1 },
  { name: "Maria mole", kcal: 301.2, protein: 3.8, carb: 73.6, fat: 0.2 },
  { name: "Cocada branca", kcal: 448.8, protein: 1.1, carb: 81.4, fat: 13.6 },
  { name: "Mel de abelha", kcal: 309.2, protein: 0.0, carb: 84.0, fat: 0.0 },
  { name: "Açúcar cristal", kcal: 386.8, protein: 0.3, carb: 99.6, fat: 0.0 },
  { name: "Coco água de", kcal: 21.5, protein: 0.0, carb: 5.3, fat: 0.0 },
  { name: "Cana caldo de", kcal: 65.3, protein: 0.0, carb: 18.2, fat: 0.0 },
  { name: "Café infusão 10%", kcal: 9.1, protein: 0.7, carb: 1.5, fat: 0.1 },
  { name: "Shoyu", kcal: 60.9, protein: 3.3, carb: 11.6, fat: 0.3 },
  { name: "Capuccino pó", kcal: 417.4, protein: 11.3, carb: 73.6, fat: 8.6 },
  { name: "Café pó torrado", kcal: 418.6, protein: 14.7, carb: 65.8, fat: 11.9 },
  { name: "Leite de coco", kcal: 166.2, protein: 1.0, carb: 2.2, fat: 18.4 },
  { name: "Azeitona preta conserva", kcal: 194.2, protein: 1.2, carb: 5.5, fat: 20.3 },
  { name: "Azeitona verde conserva", kcal: 136.9, protein: 0.9, carb: 4.1, fat: 14.2 },
  { name: "Tabule", kcal: 57.5, protein: 2.0, carb: 10.6, fat: 1.2 },
  { name: "Tacacá", kcal: 46.9, protein: 7.0, carb: 3.4, fat: 0.4 },
  { name: "Vatapá", kcal: 254.9, protein: 6.0, carb: 9.7, fat: 23.2 },
  { name: "Acarajé", kcal: 289.2, protein: 8.3, carb: 19.1, fat: 19.9 },
  { name: "Quibebe", kcal: 86.3, protein: 8.6, carb: 6.6, fat: 2.7 },
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
  { name: "Rosca direta (barra)", muscle: "Bíceps", local: "Academia", enQuery: "barbell curl" },
  { name: "Rosca alternada (halteres)", muscle: "Bíceps", local: "Academia", enQuery: "alternate dumbbell curl" },
  { name: "Rosca martelo", muscle: "Bíceps", local: "Academia", enQuery: "hammer curl" },
  { name: "Rosca scott", muscle: "Bíceps", local: "Academia", enQuery: "preacher curl" },
  { name: "Tríceps testa", muscle: "Tríceps", local: "Academia", enQuery: "lying triceps extension" },
  { name: "Tríceps corda (pulley)", muscle: "Tríceps", local: "Academia", enQuery: "triceps pushdown" },
  { name: "Tríceps francês", muscle: "Tríceps", local: "Academia", enQuery: "overhead triceps extension" },
  { name: "Mergulho no banco (dips)", muscle: "Tríceps", local: "Ambos", enQuery: "bench dip" },
  { name: "Dips entre duas cadeiras", muscle: "Tríceps", local: "Casa", enQuery: "chair dip" },
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
  { name: "Mergulho assistido (graviton)", muscle: "Tríceps", local: "Academia", enQuery: "assisted dip machine" },
  { name: "Tríceps na polia alta (corda unilateral)", muscle: "Tríceps", local: "Academia", enQuery: "single arm triceps pushdown" },
  { name: "Rosca na polia baixa", muscle: "Bíceps", local: "Academia", enQuery: "cable curl" },
  { name: "Abdominal na polia (cable crunch)", muscle: "Core", local: "Academia", enQuery: "cable crunch" },
  { name: "Rotativo de tronco (máquina)", muscle: "Core", local: "Academia", enQuery: "torso rotation machine" },
  { name: "Cadeira romana (elevação de joelhos)", muscle: "Core", local: "Academia", enQuery: "captains chair leg raise" },
  { name: "Supino reto com halteres", muscle: "Peito", local: "Academia", enQuery: "dumbbell bench press" },
  { name: "Crucifixo inclinado (halteres)", muscle: "Peito", local: "Academia", enQuery: "incline dumbbell fly" },
  { name: "Flexão com pés elevados", muscle: "Peito", local: "Casa", enQuery: "decline push up feet elevated" },
  { name: "Pullover com halter", muscle: "Peito", local: "Academia", enQuery: "dumbbell pullover" },
  { name: "Pulldown pegada supinada", muscle: "Costas", local: "Academia", enQuery: "underhand lat pulldown" },
  { name: "Remada baixa unilateral (cabo)", muscle: "Costas", local: "Academia", enQuery: "single arm seated cable row" },
  { name: "Barra fixa pegada supinada (chin-up)", muscle: "Costas", local: "Ambos", enQuery: "chin up" },
  { name: "Encolhimento com halteres", muscle: "Costas", local: "Academia", enQuery: "dumbbell shrug" },
  { name: "Remada invertida (TRX ou barra baixa)", muscle: "Costas", local: "Ambos", enQuery: "inverted row" },
  { name: "Desenvolvimento com halteres sentado", muscle: "Ombro", local: "Academia", enQuery: "seated dumbbell shoulder press" },
  { name: "Elevação posterior (halteres)", muscle: "Ombro", local: "Academia", enQuery: "rear delt fly dumbbell" },
  { name: "Elevação lateral no cabo", muscle: "Ombro", local: "Academia", enQuery: "cable lateral raise" },
  { name: "Encolhimento de ombros (barra)", muscle: "Ombro", local: "Academia", enQuery: "barbell shrug" },
  { name: "Rosca concentrada", muscle: "Bíceps", local: "Ambos", enQuery: "concentration curl" },
  { name: "Rosca 21", muscle: "Bíceps", local: "Academia", enQuery: "21s bicep curl" },
  { name: "Rosca inversa (pegada pronada)", muscle: "Bíceps", local: "Academia", enQuery: "reverse curl" },
  { name: "Rosca no cabo (pegada dupla)", muscle: "Bíceps", local: "Academia", enQuery: "double bicep cable curl" },
  { name: "Tríceps coice (kickback)", muscle: "Tríceps", local: "Academia", enQuery: "triceps kickback" },
  { name: "Supino fechado (pegada fechada)", muscle: "Tríceps", local: "Academia", enQuery: "close grip bench press" },
  { name: "Extensão de tríceps unilateral (halter)", muscle: "Tríceps", local: "Ambos", enQuery: "single arm overhead triceps extension" },
  { name: "Agachamento frontal", muscle: "Perna", local: "Academia", enQuery: "front squat" },
  { name: "Passada com halteres (walking lunge)", muscle: "Perna", local: "Ambos", enQuery: "walking lunge dumbbell" },
  { name: "Step-up (subida no banco)", muscle: "Perna", local: "Ambos", enQuery: "step up exercise" },
  { name: "Elevação pélvica com barra (hip thrust)", muscle: "Perna", local: "Academia", enQuery: "barbell hip thrust" },
  { name: "Agachamento goblet (com halter)", muscle: "Perna", local: "Ambos", enQuery: "goblet squat" },
  { name: "Cadeira extensora unilateral", muscle: "Perna", local: "Academia", enQuery: "single leg extension" },
  { name: "Prancha com elevação de perna", muscle: "Core", local: "Ambos", enQuery: "plank leg raise" },
  { name: "Ab wheel rollout (roda abdominal)", muscle: "Core", local: "Ambos", enQuery: "ab wheel rollout" },
  { name: "Dead bug", muscle: "Core", local: "Ambos", enQuery: "dead bug exercise" },
  { name: "Hollow hold", muscle: "Core", local: "Ambos", enQuery: "hollow body hold" },
  { name: "Prancha com toque no ombro", muscle: "Core", local: "Ambos", enQuery: "plank shoulder tap" },
  { name: "Levantamento terra romeno", muscle: "Perna", local: "Academia", enQuery: "romanian deadlift" },
  { name: "Terra sumô", muscle: "Perna", local: "Academia", enQuery: "sumo deadlift" },
  { name: "Cadeira flexora unilateral", muscle: "Perna", local: "Academia", enQuery: "single leg lying leg curl" },
  { name: "Elevação de panturrilha no smith", muscle: "Perna", local: "Academia", enQuery: "smith machine calf raise" },
  { name: "Agachamento pistol (unilateral)", muscle: "Perna", local: "Ambos", enQuery: "pistol squat" },
  { name: "Puxada triângulo", muscle: "Costas", local: "Academia", enQuery: "close grip pulldown" },
  { name: "Remada máquina sentada", muscle: "Costas", local: "Academia", enQuery: "seated machine row" },
  { name: "Abdominal máquina", muscle: "Core", local: "Academia", enQuery: "ab crunch machine" },
  { name: "Prancha com peso", muscle: "Core", local: "Academia", enQuery: "weighted plank" },
  { name: "Rosca Zottman", muscle: "Bíceps", local: "Academia", enQuery: "zottman curl" },
  { name: "Tríceps banco (uma perna elevada)", muscle: "Tríceps", local: "Casa", enQuery: "single leg bench dip" },
  { name: "Elevação frontal com barra", muscle: "Ombro", local: "Academia", enQuery: "barbell front raise" },
  { name: "Crucifixo máquina (peck deck)", muscle: "Peito", local: "Academia", enQuery: "pec deck machine fly" },
  { name: "Remada alta com halteres", muscle: "Ombro", local: "Academia", enQuery: "dumbbell upright row" },
  { name: "Box squat (agachamento na caixa)", muscle: "Perna", local: "Academia", enQuery: "box squat" },
  { name: "Supino reto (pegada média)", muscle: "Peito", local: "Academia", enQuery: "barbell bench press medium grip" },
  { name: "Supino inclinado com barra", muscle: "Peito", local: "Academia", enQuery: "barbell incline bench press" },
  { name: "Supino declinado com barra", muscle: "Peito", local: "Academia", enQuery: "decline barbell bench press" },
  { name: "Svend press (compressão de anilha)", muscle: "Peito", local: "Academia", enQuery: "svend press" },
  { name: "Crucifixo cruzado no cabo (iron cross)", muscle: "Peito", local: "Academia", enQuery: "cable iron cross" },
  { name: "Levantamento terra com barra", muscle: "Costas", local: "Academia", enQuery: "barbell deadlift" },
  { name: "Puxada aberta (pegada larga)", muscle: "Costas", local: "Academia", enQuery: "wide grip lat pulldown" },
  { name: "Remada curvada com barra", muscle: "Costas", local: "Academia", enQuery: "bent over barbell row" },
  { name: "Remada unilateral com halter", muscle: "Costas", local: "Academia", enQuery: "one arm dumbbell row" },
  { name: "Remada sentada no cabo", muscle: "Costas", local: "Academia", enQuery: "seated cable row" },
  { name: "Puxada por trás da nuca (pegada aberta)", muscle: "Costas", local: "Academia", enQuery: "pulldown behind the neck" },
  { name: "Rack pull (levantamento parcial)", muscle: "Costas", local: "Academia", enQuery: "rack pull" },
  { name: "Agachamento com barra (costas)", muscle: "Perna", local: "Academia", enQuery: "barbell back squat" },
  { name: "Agachamento completo com barra", muscle: "Perna", local: "Academia", enQuery: "barbell full squat" },
  { name: "Leg press vertical", muscle: "Perna", local: "Academia", enQuery: "vertical leg press" },
  { name: "Panturrilha em pé (aparelho)", muscle: "Perna", local: "Academia", enQuery: "standing calf raise machine" },
  { name: "Mesa flexora sentada", muscle: "Perna", local: "Academia", enQuery: "seated leg curl" },
  { name: "Ponte de glúteo (glute bridge)", muscle: "Perna", local: "Ambos", enQuery: "glute bridge" },
  { name: "Elevação de quadril no chão", muscle: "Perna", local: "Casa", enQuery: "hip bridge floor" },
  { name: "Ponte de glúteo unilateral", muscle: "Perna", local: "Ambos", enQuery: "single leg glute bridge" },
  { name: "Panturrilha inclinada (donkey calf raise)", muscle: "Perna", local: "Academia", enQuery: "donkey calf raise" },
  { name: "Wall ball (arremesso na parede)", muscle: "Perna", local: "Academia", enQuery: "wall ball exercise" },
  { name: "Desenvolvimento Arnold com halteres", muscle: "Ombro", local: "Academia", enQuery: "arnold press dumbbell" },
  { name: "Desenvolvimento com barra", muscle: "Ombro", local: "Academia", enQuery: "barbell overhead press" },
  { name: "Desenvolvimento em pé com halteres", muscle: "Ombro", local: "Academia", enQuery: "standing dumbbell shoulder press" },
  { name: "Elevação posterior apoiado no banco", muscle: "Ombro", local: "Academia", enQuery: "chest supported rear delt raise" },
  { name: "Voador posterior no cabo", muscle: "Ombro", local: "Academia", enQuery: "cable rear delt fly" },
  { name: "Elevação posterior sentado", muscle: "Ombro", local: "Academia", enQuery: "seated rear delt raise" },
  { name: "Rosca direta com barra reta", muscle: "Bíceps", local: "Academia", enQuery: "straight barbell curl" },
  { name: "Rosca com barra EZ (pegada fechada)", muscle: "Bíceps", local: "Academia", enQuery: "close grip ez bar curl" },
  { name: "Rosca martelo cruzada", muscle: "Bíceps", local: "Ambos", enQuery: "cross body hammer curl" },
  { name: "Rosca spider (banco inclinado)", muscle: "Bíceps", local: "Academia", enQuery: "spider curl" },
  { name: "Rosca inversa com halteres", muscle: "Bíceps", local: "Ambos", enQuery: "standing dumbbell reverse curl" },
  { name: "Supino fechado com barra", muscle: "Tríceps", local: "Academia", enQuery: "close grip barbell bench press" },
  { name: "Tríceps francês na corda (acima da cabeça)", muscle: "Tríceps", local: "Academia", enQuery: "cable rope overhead triceps extension" },
  { name: "Tríceps francês unilateral com halter", muscle: "Tríceps", local: "Ambos", enQuery: "dumbbell one arm triceps extension" },
  { name: "Mergulho no banco (tríceps)", muscle: "Tríceps", local: "Ambos", enQuery: "bench dips" },
  { name: "Tríceps pulley (barra reta)", muscle: "Tríceps", local: "Academia", enQuery: "triceps pushdown straight bar" },
  { name: "Rolo abdominal (ab roller)", muscle: "Core", local: "Ambos", enQuery: "ab roller wheel" },
  { name: "Abdominal na polia alta (cable crunch)", muscle: "Core", local: "Academia", enQuery: "cable crunch" },
  { name: "Elevação de pernas na barra fixa", muscle: "Core", local: "Academia", enQuery: "hanging leg raise" },
  { name: "Russian twist com peso", muscle: "Core", local: "Ambos", enQuery: "weighted russian twist" },
  { name: "Prancha lateral (side bridge)", muscle: "Core", local: "Casa", enQuery: "side plank bridge" },
  { name: "Abdominal supra com peso", muscle: "Core", local: "Academia", enQuery: "weighted sit up" },
  { name: "V-ups (abdominal em V)", muscle: "Core", local: "Ambos", enQuery: "v ups exercise" },
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
      { name: "Tríceps corda (pulley)", muscle: "Tríceps" },
      { name: "Tríceps testa", muscle: "Tríceps" },
    ],
  },
  {
    id: "planB", name: "Treino B — Costas e Bíceps", muscle: "Costas",
    exercises: [
      { name: "Puxada frontal (pulley)", muscle: "Costas" },
      { name: "Remada curvada", muscle: "Costas" },
      { name: "Remada unilateral (serrote)", muscle: "Costas" },
      { name: "Rosca direta (barra)", muscle: "Bíceps" },
      { name: "Rosca martelo", muscle: "Bíceps" },
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
    { label: "Treino A — Corpo todo (empurrar)", muscles: ["Peito", "Perna", "Ombro", "Tríceps"] },
    { label: "Treino B — Corpo todo (puxar)", muscles: ["Costas", "Perna", "Bíceps", "Core"] },
  ],
  3: [
    { label: "Treino A — Push (Peito, Ombro, Tríceps)", muscles: ["Peito", "Ombro", "Tríceps"] },
    { label: "Treino B — Pull (Costas, Bíceps)", muscles: ["Costas", "Bíceps"] },
    { label: "Treino C — Legs (Perna)", muscles: ["Perna", "Core"] },
  ],
  4: [
    { label: "Treino A — Peito e Tríceps", muscles: ["Peito", "Tríceps"] },
    { label: "Treino B — Costas e Bíceps", muscles: ["Costas", "Bíceps"] },
    { label: "Treino C — Perna", muscles: ["Perna"] },
    { label: "Treino D — Ombro e Core", muscles: ["Ombro", "Core"] },
  ],
  5: [
    { label: "Treino A — Peito", muscles: ["Peito"] },
    { label: "Treino B — Costas", muscles: ["Costas"] },
    { label: "Treino C — Perna", muscles: ["Perna"] },
    { label: "Treino D — Ombro e Tríceps", muscles: ["Ombro", "Tríceps"] },
    { label: "Treino E — Bíceps e Core", muscles: ["Bíceps", "Core"] },
  ],
  6: [
    { label: "Treino A — Push (Peito, Ombro, Tríceps)", muscles: ["Peito", "Ombro", "Tríceps"] },
    { label: "Treino B — Pull (Costas, Bíceps)", muscles: ["Costas", "Bíceps"] },
    { label: "Treino C — Legs (Perna)", muscles: ["Perna"] },
    { label: "Treino D — Push (Peito, Ombro, Tríceps)", muscles: ["Peito", "Ombro", "Tríceps"] },
    { label: "Treino E — Pull (Costas, Bíceps)", muscles: ["Costas", "Bíceps"] },
    { label: "Treino F — Legs e Core", muscles: ["Perna", "Core"] },
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

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function exercisesPerMuscleForLevel(nivel, numMuscles) {
  const base = { "Iniciante": 4, "Intermediário": 6, "Avançado": 8 }[nivel] || 6;
  return Math.max(nivel === "Iniciante" ? 1 : 2, Math.floor(base / numMuscles));
}

function generateWorkoutSplit(form) {
  const dias = Math.min(6, Math.max(2, Number(form.dias) || 3));
  const templates = SPLIT_TEMPLATES[dias];
  const local = form.local || "Ambos";
  const objetivo = form.objetivo || "Manutenção";
  const nivel = form.nivel || "Intermediário";

  const pool = local === "Ambos" ? EXERCISE_DB : EXERCISE_DB.filter((e) => e.local === local || e.local === "Ambos");

  return templates.map((tpl, idx) => {
    let exercises = [];
    tpl.muscles.forEach((m) => {
      const candidates = pool.filter((e) => e.muscle === m);
      const perMuscle = exercisesPerMuscleForLevel(nivel, tpl.muscles.length);
      // Embaralha as opções pra dar variedade a cada geração — sem isso, sempre
      // vinham os mesmos exercícios (os primeiros da base), toda vez.
      shuffleArray(candidates).slice(0, perMuscle).forEach((e, i) => {
        const isCompound = i === 0; // primeiro sorteado do grupo = exercício principal
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
        const e = shuffleArray(extra)[idx % extra.length];
        exercises.push({ name: e.name, muscle: e.muscle, sets: 3, reps: 15 });
      }
    }
    const maxExercises = nivel === "Avançado" ? 8 : nivel === "Iniciante" ? 5 : 6;
    exercises = exercises.slice(0, maxExercises);
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
