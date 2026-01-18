import { Lesson, QuizQuestion, FutureModule } from './types';
import { RAW_LESSONS } from './data/lessonContent';

export const PLATFORM_NAME = "VGEO ACADEMY";
export const LOGO_URL = "https://i.imgur.com/uSty9Y8.png"; // User provided logo

export const MODULE_TITLE = "MÓDULO 1 — FUNDAMENTOS E PARADIGMAS DA GEOPOLÍTICA";
export const MODULE_OBJECTIVE = "Formar a base conceitual, histórica e metodológica para compreender o xadrez global.";

// Process raw markdown into pages
const processContent = (rawText: string): string[] => {
  if (!rawText) return ["Conteúdo confidencial não encontrado."];
  // Split by the specific delimiter defined in lessonContent.ts
  return rawText.split('<!-- PAGE_BREAK -->').map(page => page.trim());
};

export const LESSONS: Lesson[] = [
  { 
    id: 1, 
    title: "O que é Geopolítica?", 
    description: "Definições, escopo e relevância global no cenário contemporâneo.", 
    duration: "15 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[1])
  },
  { 
    id: 2, 
    title: "História da Geopolítica", 
    description: "Da Antiguidade aos Estados Modernos: a evolução do pensamento.", 
    duration: "20 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[2])
  },
  { 
    id: 3, 
    title: "Friedrich Ratzel", 
    description: "O conceito de espaço vital (Lebensraum) e o estado como organismo.", 
    duration: "18 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[3])
  },
  { 
    id: 4, 
    title: "Halford Mackinder", 
    description: "A Teoria do Heartland: Quem domina o coração da terra, comanda o mundo.", 
    duration: "25 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[4])
  },
  { 
    id: 5, 
    title: "Alfred Mahan", 
    description: "O poder naval global e a importância estratégica dos oceanos.", 
    duration: "22 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[5])
  },
  { 
    id: 6, 
    title: "Karl Haushofer", 
    description: "Lebensraum e as controvérsias do século XX.", 
    duration: "20 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[6])
  },
  { 
    id: 7, 
    title: "Geoestratégia vs Geoeconomia", 
    description: "Diferenças essenciais entre os conceitos e suas aplicações.", 
    duration: "15 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[7])
  },
  { 
    id: 8, 
    title: "Idade Média e Impérios", 
    description: "A Geopolítica na Idade Média e a expansão dos Impérios Coloniais.", 
    duration: "25 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[8])
  },
  { 
    id: 9, 
    title: "Geopolítica Cultural", 
    description: "Soft power e a construção do poder simbólico nas relações internacionais.", 
    duration: "18 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[9])
  },
  { 
    id: 10, 
    title: "Geopolítica Crítica", 
    description: "O pensamento decolonial e a crítica às visões eurocêntricas.", 
    duration: "20 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[10])
  },
  { 
    id: 11, 
    title: "Glossário Essencial", 
    description: "Termos fundamentais para não se perder nas análises.", 
    duration: "10 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[11])
  },
  { 
    id: 12, 
    title: "Lendo Mapas Geopolíticos", 
    description: "Como interpretar cartografia estratégica e evitar erros comuns.", 
    duration: "30 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[12])
  },
  { 
    id: 13, 
    title: "Escalas de Análise", 
    description: "Do local ao sistêmico: entendendo as camadas de poder.", 
    duration: "15 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[13])
  },
  { 
    id: 14, 
    title: "Fontes Confiáveis", 
    description: "Onde buscar dados: índices, relatórios e think tanks de prestígio.", 
    duration: "12 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[14])
  },
  { 
    id: 15, 
    title: "Metodologia de Análise", 
    description: "Introdução ao pensamento estratégico: como conectar os pontos.", 
    duration: "25 min", 
    type: 'text',
    pages: processContent(RAW_LESSONS[15])
  },
];

export const FUTURE_MODULES: FutureModule[] = [
  {
    id: 2,
    title: "MÓDULO 2 — A ORDEM MUNDIAL E OS SISTEMAS DE PODER",
    description: "Apresentar os principais arranjos históricos e contemporâneos do sistema internacional.",
    lessons: [
      "16. Ordens globais da história: Império Romano, Britânico, Norte-Americano",
      "17. Sistema internacional moderno: anarquia, soberania, equilíbrio de poder",
      "18. Colonialismo e neocolonialismo: continuidade e ruptura",
      "19. A Guerra Fria e o sistema bipolar",
      "20. Globalização e o surgimento da governança global",
      "21. Multilateralismo e instituições internacionais (ONU, OMC, FMI)",
      "22. Hegemonia americana: ascensão, manutenção e declínio?",
      "23. Sistemas internacionais: unipolaridade, multipolaridade e bipolaridade",
      "24. A crise da ordem liberal e o surgimento de novos pólos",
      "25. Conflito ideológico global: democracia versus autocracia"
    ]
  },
  {
    id: 3,
    title: "MÓDULO 3 — GEOPOLÍTICA REGIONAL E GRANDES POTÊNCIAS",
    description: "Compreender as dinâmicas regionais e os interesses das potências globais em diferentes áreas do mundo.",
    lessons: [
      "26. Europa: integração, OTAN, crise migratória e o leste europeu",
      "27. Rússia: Eurasianismo, Doutrina Primakov e o conflito Ucrânia-OTAN",
      "28. China: geopolítica interna, ambições regionais e Nova Rota da Seda",
      "29. Japão, Coreia do Sul e o dilema do Indo-Pacífico",
      "30. Oriente Médio: disputas religiosas, petróleo e hegemonias regionais",
      "31. África: presença chinesa, neocolonialismo e instabilidade persistente",
      "32. América Latina: integração, dependência e influência externa",
      "33. Ásia Central e o Coração da Eurásia",
      "34. Caribe e América Central: zona de influência disputada",
      "35. Magrebe e Sahel: vulnerabilidade e guerras invisíveis"
    ]
  },
  {
    id: 4,
    title: "MÓDULO 4 — GEOECONOMIA E PODER FINANCEIRO",
    description: "Analisar a dimensão econômica da geopolítica e o papel do dinheiro como ferramenta de poder.",
    lessons: [
      "36. Bretton Woods, dólar e hegemonia financeira americana",
      "37. Energia e Commodities: petróleo, gás, lítio e transição energética",
      "38. Rota da Seda e os investimentos chineses como estratégia global",
      "39. Sanções econômicas e bloqueios como armas diplomáticas",
      "40. Criptomoedas e soberania digital emergente",
      "41. BRICS e o desafio ao sistema financeiro ocidental",
      "42. Logística estratégica e os corredores comerciais globais",
      "43. Cadeias produtivas e estratégias de diversificação",
      "44. Política monetária internacional e manipulação cambial",
      "45. Conflitos comerciais e políticas protecionistas"
    ]
  },
  {
    id: 5,
    title: "MÓDULO 5 — TECNOPOLÍTICA E PODER DIGITAL",
    description: "Explorar como a tecnologia molda o poder global e os novos domínios de disputa.",
    lessons: [
      "46. Ciberespaço como novo teatro de guerra",
      "47. Vigilância em massa e controle digital",
      "48. Inteligência Artificial como arma de guerra e espionagem",
      "49. Guerra da Informação, bots e manipulação social",
      "50. Satélites, controle orbital e militarização do espaço",
      "51. Internet como ferramenta de poder estatal e privado",
      "52. Soberania digital e regulação de Big Techs",
      "53. Tecnologias de uso duplo: civil x militar",
      "54. Plataformas digitais como atores geopolíticos",
      "55. Corrida global por chips e semicondutores"
    ]
  },
  {
    id: 6,
    title: "MÓDULO 6 — ESTRATÉGIA MILITAR, DEFESA E CONFLITOS",
    description: "Examinar os conflitos armados, as doutrinas militares e o papel da guerra na política internacional.",
    lessons: [
      "56. Teorias clássicas da guerra: Clausewitz, Sun Tzu e outros",
      "57. Conflitos convencionais x guerras híbridas e cibernéticas",
      "58. Estratégias das grandes potências militares",
      "59. Complexos militar-industriais e orçamentos de defesa",
      "60. Terrorismo e insurgência transnacional",
      "61. Disuasão nuclear e o Tratado de Não Proliferação",
      "62. Operações de paz, intervenções e direito humanitário",
      "63. Doutrinas de defesa de EUA, China, Rússia, Irã",
      "64. Fronteiras militarizadas e securitização de fluxos migratórios",
      "65. Robótica militar, drones e o futuro do combate"
    ]
  },
  {
    id: 7,
    title: "MÓDULO 7 — GEOPOLÍTICA CLIMÁTICA, POPULACIONAL E DE RECURSOS",
    description: "Entender como clima, território, biomas, água e população se tornaram eixos centrais da geopolítica.",
    lessons: [
      "66. Mudanças climáticas e seus impactos estratégicos",
      "67. Guerras por água e crise hídrica global",
      "68. Fluxos migratórios e instabilidade populacional",
      "69. Amazônia, Cerrado e biomas em disputa global",
      "70. Segurança alimentar e geopolítica da agricultura",
      "71. Energia renovável e transição energética estratégica",
      "72. Crescimento populacional e controle demográfico",
      "73. O clima como catalisador de crises sociais e guerras",
      "74. Climaterrorismo e o medo como instrumento de controle",
      "75. O colonialismo verde e o crédito de carbono"
    ]
  },
  {
    id: 8,
    title: "MÓDULO 8 — ESTUDOS DE CASO E CENÁRIOS CONCRETOS",
    description: "Aplicar os conceitos a situações reais e construir a capacidade de análise crítica.",
    lessons: [
      "76. Caso Ucrânia: disputa OTAN x Rússia",
      "77. Caso Taiwan: soberania e contenção chinesa",
      "78. Caso Irã: dissuasão, sanções e projeção xiita",
      "79. Caso África: França, China e EUA em competição silenciosa",
      "80. Caso Venezuela: petróleo, autoritarismo e colapso social",
      "81. Diplomacia coercitiva como ferramenta estratégica",
      "82. Crises energéticas como gatilhos geopolíticos",
      "83. Construção de narrativas e fake news em conflitos reais",
      "84. Conflitos por recursos em zonas marítimas disputadas",
      "85. Crises hipotéticas e exercícios de modelagem geopolítica"
    ]
  },
  {
    id: 9,
    title: "MÓDULO 9 — ANÁLISE PROSPECTIVA E FUTUROS GLOBAIS",
    description: "Antecipar tendências, estruturar riscos e pensar o futuro do sistema internacional.",
    lessons: [
      "86. O que é prospectiva estratégica? Conceitos-chave",
      "87. Matriz SWOT, PESTEL e cenários exploratórios",
      "88. Futuros prováveis, possíveis e desejáveis",
      "89. O Sul Global como centro geoestratégico emergente",
      "90. Tecnologias disruptivas até 2050",
      "91. Modelos de previsão de risco político",
      "92. Criação de alertas estratégicos e resposta antecipada",
      "93. Storytelling e a construção de futuros estratégicos",
      "94. Cartografia de futuros e mapas mentais de risco",
      "95. Como governos e empresas usam cenários para decisões críticas"
    ]
  },
  {
    id: 10,
    title: "MÓDULO 10 — APLICAÇÕES ANALÍTICAS E METODOLOGIA",
    description: "Ensinar a ler, escrever e apresentar análises geopolíticas com rigor, clareza e poder persuasivo.",
    lessons: [
      "96. Como fazer uma análise geopolítica completa",
      "97. Estrutura de relatórios de risco e inteligência estratégica",
      "98. Técnicas de pesquisa qualitativa com dados secundários",
      "99. Indicadores internacionais: como interpretar e comparar",
      "100. Produção de análises escritas com base em evidências"
    ]
  },
  {
    id: 11,
    title: "MÓDULO 11 — GEOPOLÍTICA DO BRASIL E DA AMÉRICA DO SUL",
    description: "Explorar o papel do Brasil na ordem mundial e as tensões regionais no subcontinente.",
    lessons: [
      "101. Inserção internacional do Brasil: história e projeção global",
      "102. Amazônia, soberania e disputa internacional por recursos",
      "103. Integração regional: UNASUL, MERCOSUL e CELAC",
      "104. Recursos naturais e presença estrangeira no continente",
      "105. Bases militares externas e influência geopolítica na região"
    ]
  },
  {
    id: 12,
    title: "MÓDULO 12 — CULTURA, RELIGIÃO E PODER SIMBÓLICO",
    description: "Analisar o soft power, os mecanismos culturais e religiosos de influência global.",
    lessons: [
      "106. Soft power e diplomacia cultural como armas políticas",
      "107. Religião como instrumento de influência e conflito",
      "108. Hollywood, K-pop, novelas turcas: cultura e poder global",
      "109. Geopolítica das mídias e propaganda global",
      "110. Games, redes sociais e entretenimento como armas simbólicas"
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Quem é o autor da Teoria do Heartland?",
    options: ["Alfred Mahan", "Friedrich Ratzel", "Halford Mackinder", "Karl Haushofer"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Qual conceito é central no pensamento de Alfred Mahan?",
    options: ["Poder Terrestre", "Poder Naval", "Poder Aéreo", "Soft Power"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "O que define, em essência, o conceito de 'Espaço Vital' (Lebensraum) de Ratzel?",
    options: [
      "A necessidade de comércio livre.",
      "A relação entre o Estado e seu território como um organismo vivo.",
      "A superioridade cultural de uma nação.",
      "A diplomacia acima da guerra."
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Qual a diferença principal entre Geoestratégia e Geoeconomia?",
    options: [
      "Não há diferença.",
      "Geoestratégia foca no militar/geográfico, Geoeconomia no uso do poder econômico.",
      "Geoeconomia é apenas sobre dinheiro, Geoestratégia é sobre mapas.",
      "Geoestratégia é um conceito obsoleto."
    ],
    correctAnswer: 1
  }
];

export const RANKS = [
  { threshold: 0, title: "Observador Iniciante" },
  { threshold: 300, title: "Analista Júnior" },
  { threshold: 800, title: "Estrategista Pleno" },
  { threshold: 1500, title: "Grão-Mestre Geopolítico" },
];