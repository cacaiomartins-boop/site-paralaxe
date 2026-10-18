// Todos os textos, links, datas e valores do site ficam aqui.
// Para atualizar a agenda, é só editar a lista "events" (data no formato AAAA-MM-DD).
// Encontros com data passada saem sozinhos de "Próximos encontros" e vão para "Já aconteceu".

export const site = {
  name: "Paralaxe",
  organizer: "Polyana Corrêa",
  tagline: "Da teoria à escuta.",
  year: 2026,
};

export const links = {
  instagram: "https://www.instagram.com/paralaxeslab/",
  threads: "https://www.threads.com/@paralaxeslab",
  instagramPolyana: "https://www.instagram.com/polyanalitica/",
  // Formulário do link da bio (inscrição no grupo de estudos). Pede login do Google.
  formEstudos:
    "https://docs.google.com/forms/d/e/1FAIpQLSeqf_wF_TYRgHpc3780J8_aKJ1yzAbi5zqVNU5tJcAch4_zfw/viewform",
  formEscuta:
    "https://docs.google.com/forms/d/e/1FAIpQLSdpKEDaPxpACFBGN9qLdtgrIBLLsiz8GvI0SGL1zMioWAhjTQ/viewform",
  grupoEstudos: "https://chat.whatsapp.com/FeNOIxgSVKJ00fuQJpqXa5",
  grupoEscuta: "https://chat.whatsapp.com/BDs5VECjtDGDaCIjBmh1nJ",
  drive:
    "https://drive.google.com/drive/folders/1IRHrd9MvIllvKwC418wjmRgv2hKftv0Y",
  // Opcional: link de um vídeo de apresentação do YouTube (só o código, ex.: "dQw4w9WgXcQ").
  // Deixe vazio para não mostrar.
  youtubeApresentacao: "",
};

export const spaces = {
  estudos: {
    id: "estudos",
    kicker: "Espaço 01",
    name: "Psicanálise em Paralaxe",
    subtitle: "Grupo de estudos teóricos",
    text: "Lemos autores da psicanálise e fazemos a teoria conversar com a clínica, a ciência e o nosso tempo. Cada encontro abre com uma exposição e deixa lacunas em aberto, para render pergunta.",
    facts: [
      { label: "Quando", value: "Terças-feiras, 20h30" },
      { label: "Onde", value: "On-line, pelo Google Meet" },
      { label: "Valor", value: "Encontros abertos e gratuitos" },
    ],
    cta: "Quero estudar com o grupo",
    form: links.formEstudos,
    group: links.grupoEstudos,
  },
  escuta: {
    id: "escuta",
    kicker: "Espaço 02",
    name: "Escuta Clínica",
    subtitle: "Supervisão psicanalítica em grupo",
    text: "Um espaço de supervisão e interlocução voltado à escuta de casos clínicos, à elaboração de impasses e à direção do tratamento. A cada encontro, um caso é trazido ao grupo e pensado entre pares.",
    facts: [
      { label: "Quando", value: "Quartas-feiras, 20h às 21h30" },
      { label: "Onde", value: "On-line, pelo Google Meet" },
      { label: "Valor", value: "Ouvinte R$ 50 · Analista R$ 90" },
    ],
    cta: "Quero entrar na supervisão",
    form: links.formEscuta,
    group: links.grupoEscuta,
  },
};

export const modalidades = [
  {
    name: "Ouvinte",
    price: "R$ 50",
    text: "Participa da escuta e da interlocução sobre o caso apresentado. É um bom lugar para quem ainda não tem muita experiência clínica e quer aprender vendo a clínica acontecer.",
  },
  {
    name: "Analista",
    price: "R$ 90",
    text: "Além de participar da escuta, pode apresentar um relato de caso clínico para ser discutido pelo grupo.",
  },
];

export const comoFunciona = {
  estudos: [
    {
      t: "Exposição inicial",
      d: "Um momento de apresentação do texto e das questões que ele abre, para provocar o debate.",
    },
    {
      t: "Debate entre os participantes",
      d: "Partimos do texto, mas não ficamos nele: trocamos leituras, percepções e a relação de cada um com a própria análise.",
    },
    {
      t: "Lacunas em aberto",
      d: "Não buscamos contornar todo o conteúdo pelo saber. O encontro abre perguntas, associações e outras possibilidades de leitura.",
    },
  ],
  escuta: [
    {
      t: "Um caso por encontro",
      d: "Um integrante apresenta um caso clínico ao grupo.",
    },
    {
      t: "Perguntas",
      d: "O grupo escuta, pergunta e interlocui a partir do que o caso faz ressoar.",
    },
    {
      t: "Encaminhamentos coletivos",
      d: "Constroem-se, em conjunto, caminhos possíveis para a direção do tratamento.",
    },
  ],
};

export type EventSpace = "estudos" | "escuta";

export interface AgendaEvent {
  date: string; // AAAA-MM-DD
  time: string;
  space: EventSpace;
  title: string;
  text?: string;
}

export const events: AgendaEvent[] = [
  {
    date: "2026-10-20",
    time: "20h30",
    space: "estudos",
    title: "A função do analista: entre Freud e Lacan",
    text: "Do âmbito técnico-científico à dimensão antropológica e ética da experiência analítica: o que se transforma na maneira de conceber a função do analista? Encontro on-line, com nova data.",
  },
  {
    date: "2026-10-21",
    time: "20h",
    space: "escuta",
    title: "Escuta Clínica: supervisão em grupo",
    text: "Encontro de outubro, das 20h às 21h30. Um caso clínico discutido pelo grupo.",
  },
  {
    date: "2026-10-07",
    time: "20h",
    space: "escuta",
    title: "Escuta Clínica: supervisão em grupo",
  },
  {
    date: "2026-10-06",
    time: "20h30",
    space: "estudos",
    title: "Lacan e a psicanálise: o que muda em relação ao método?",
    text: "Freud e Lacan em contraste, o método psicanalítico e o lugar da psicanálise diante dos ideais de cientificidade.",
  },
  {
    date: "2026-09-29",
    time: "20h30",
    space: "estudos",
    title: "Psicanálise, ideal científico e método",
    text: "A partir do capítulo 4 de “Quem tem medo da ciência? Ciências e poderes”, de Isabelle Stengers.",
  },
  {
    date: "2026-09-22",
    time: "20h30",
    space: "estudos",
    title: "A tensão entre psicanálise, ciência e pesquisa",
  },
  {
    date: "2026-09-01",
    time: "20h30",
    space: "estudos",
    title: "O inconsciente como hipótese",
    text: "A partir do artigo “Psicanálise: um projeto de autonomia?”, de Thamy Ayouch (2005).",
  },
];

export const referencias = [
  {
    autor: "Thamy Ayouch",
    ano: "2005",
    titulo: "Psicanálise: um projeto de autonomia?",
    uso: "Encontro de 01/09",
  },
  {
    autor: "Luciano Elia",
    ano: "2000",
    titulo: "Psicanálise: clínica e pesquisa",
    uso: "Capítulo de “Clínica e pesquisa em psicanálise”",
  },
  {
    autor: "Isabelle Stengers",
    ano: "1990",
    titulo: "Das decepções do poder: Freud e Lacan, a psicanálise…",
    uso: "Encontro de 29/09",
  },
];

export const videos = [
  {
    id: "DeAgb8mg9Ys",
    title: "Um comentário rápido sobre o encontro da semana",
    by: "Polyana, no Instagram",
  },
  {
    id: "DcriQ6AhYnx",
    title: "O que significa formular o inconsciente como hipótese?",
    by: "Polyana, no Instagram",
  },
];

export const combinados = [
  {
    t: "Sem gravação",
    d: "Os encontros não podem ser gravados nem compartilhados.",
  },
  {
    t: "Casos com cuidado",
    d: "Casos clínicos são tratados com sigilo e respeito a quem é atendido.",
  },
  {
    t: "Link só para inscritos",
    d: "O link do encontro chega por WhatsApp ou e-mail, depois da inscrição.",
  },
  {
    t: "Sem reembolso",
    d: "Em caso de desistência, não há devolução do valor pago.",
  },
];

export const passos = {
  estudos: [
    "Preencha o formulário de inscrição.",
    "Entre no grupo de WhatsApp do Psicanálise em Paralaxe.",
    "Receba o link do encontro e o material de leitura na pasta de referências.",
  ],
  escuta: [
    "Preencha o formulário e escolha a modalidade: ouvinte ou analista.",
    "Faça o pagamento por Pix e envie o comprovante, conforme as instruções do formulário.",
    "Entre no grupo de WhatsApp da Escuta Clínica e receba o link do encontro.",
  ],
};

export const faq = [
  {
    q: "Preciso ter experiência clínica?",
    a: "Não. Na supervisão, a modalidade ouvinte foi pensada para quem está começando e quer aprender escutando a discussão de casos. No grupo de estudos, basta ter interesse pela psicanálise.",
  },
  {
    q: "Para quem é o Paralaxe?",
    a: "Para quem estuda psicologia, psicanálise ou temas próximos e sente que só tem contato com a teoria. Também para quem já atende e procura interlocução entre pares.",
  },
  {
    q: "Qual a diferença entre ouvinte e analista?",
    a: "O ouvinte participa da escuta e da conversa sobre o caso apresentado. O analista, além disso, pode trazer um relato de caso clínico para o grupo discutir.",
  },
  {
    q: "Como recebo o link dos encontros?",
    a: "Depois da inscrição, pelo grupo de WhatsApp ou por e-mail. Os encontros acontecem on-line, pelo Google Meet.",
  },
  {
    q: "Os encontros ficam gravados?",
    a: "Não. As gravações e o compartilhamento dos encontros não são permitidos.",
  },
  {
    q: "Posso desistir depois de me inscrever?",
    a: "Pode, mas não há reembolso do valor pago em caso de desistência.",
  },
];
