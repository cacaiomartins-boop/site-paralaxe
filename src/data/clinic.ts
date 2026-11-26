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
  // Contato direto da Polyana (bolsas e dúvidas).
  whatsappPolyana:
    "https://wa.me/5531984976108?text=Oi%2C%20Polyana!%20Tenho%20interesse%20em%20participar%20como%20bolsista%20do%20Psican%C3%A1lise%20em%20Paralaxe.",
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
    text: "A partir da leitura de autores da psicanálise, construímos um debate em torno da clínica e das questões que atravessam o nosso contexto. Cada encontro parte de uma breve exposição e deixa lacunas em aberto, como forma de questionar a teoria, as nossas perspectivas sobre a psicanálise e estimular a construção de um saber.",
    facts: [
      { label: "Quando", value: "Terças, 20h30 · on-line, pelo Google Meet" },
      { label: "Valor", value: "R$ 80 por mês · alguns encontros gratuitos" },
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
      { label: "Quando", value: "Quartas, 20h às 21h30 · on-line, pelo Google Meet" },
      { label: "Valor", value: "Ouvinte R$ 50 · Analista R$ 90" },
    ],
    cta: "Quero entrar na supervisão",
    form: links.formEscuta,
    group: links.grupoEscuta,
  },
};

// Links de pagamento do Mercado Pago. Cole o link entre as aspas: enquanto estiver vazio,
// o botão não aparece e o site segue com o formulário de inscrição de antes.
// O TÍTULO de cada link no Mercado Pago precisa seguir o padrão de api/_produtos.js
// (ex.: "Paralaxe Estudos Mensalidade"), é assim que o sistema sabe o que a pessoa comprou.
export const pagamentos = {
  estudos: { label: "Mensalidade · R$ 80", link: "https://mpago.la/1NyS79u" },
  ouvinte: { label: "Ouvinte · R$ 50", link: "https://mpago.la/31x3Htx" },
  analista: { label: "Analista · R$ 90", link: "https://mpago.la/1qM2SkF" },
  minicurso: { label: "Inscrever-se", link: "" },
  leitura: { label: "Inscrever-se", link: "" },
};

export type PagamentoKey = keyof typeof pagamentos;

// Como o site cuida da inscrição (veja PAGAMENTOS-LEIA-ME.md):
//  "manual"   = formulário do Google + links de pagamento; a Polyana manda o convite na mão.
//  "verificado" = sem formulário: o botão cria o pagamento pelo site, e a página de volta CONFERE no Mercado Pago que
//               foi aprovado antes de mostrar o convite. Só precisa que a Polyana autorize a conta com um clique
//               (api/conectar.js). O grupo público some do site. Guia: PAGAMENTOS-VERIFICADO.md.
//  "direto"   = sem formulário: botão de pagar + botão do grupo de WhatsApp. Não confere o pagamento; a Polyana
//               pode ligar "Aprovar novos participantes" no grupo e liberar só quem aparece no Mercado Pago.
//  "email"    = só os links de pagamento; quem paga recebe o convite por e-mail sozinho (api/mp-webhook.js).
//               Troque para este quando o webhook estiver no ar (token do Mercado Pago + Resend na Vercel).
//  "completo" = formulário próprio do site (api/inscricao.js) + pagamento + e-mail. Precisa também do Upstash.
// Nos modos "email" e "completo" o grupo público de WhatsApp some do site: o convite só vai por e-mail.
export const modoInscricao = "direto" as "manual" | "direto" | "verificado" | "email" | "completo";
// true = o botão de pagar passa por api/pagar.js e a página /obrigado.html confere o pagamento e mostra os links.
export const modoVerificado = modoInscricao === "verificado";
export const automacaoAtiva = modoInscricao === "completo";
// true = só o botão de pagar e o botão do grupo, sem formulário e sem conferir o pagamento (a Polyana confere no Mercado Pago).
export const modoDireto = modoInscricao === "direto";
// true = a pessoa paga pelo link do Mercado Pago e recebe o convite por e-mail sozinha (só api/mp-webhook.js).
export const emailAutomatico = modoInscricao === "email" || modoInscricao === "completo";

// Mostra o link "Termos e privacidade" no rodapé. Só vira true depois que a Polyana revisar public/privacidade.html.
export const termosProntos = false;

/** Vira true assim que o primeiro link de pagamento for colado. */
export const pagamentoAtivo = Object.values(pagamentos).some((p) => p.link);

// Serviços que aparecem no formulário de inscrição do site (preços de verdade ficam em api/_produtos.js).
export const servicosInscricao = [
  { key: "estudos", nome: "Psicanálise em Paralaxe", detalhe: "Grupo de estudos · mensalidade", preco: 80 },
  { key: "escuta-ouvinte", nome: "Escuta Clínica · ouvinte", detalhe: "Supervisão em grupo", preco: 50 },
  { key: "escuta-analista", nome: "Escuta Clínica · analista", detalhe: "Supervisão em grupo, com relato de caso", preco: 90 },
] as const;

export type ServicoKey = (typeof servicosInscricao)[number]["key"];

/** Serviço sugerido quando a pessoa clica em um dos dois espaços. */
export const servicoDoEspaco: Record<"estudos" | "escuta", ServicoKey> = {
  estudos: "estudos",
  escuta: "escuta-ouvinte",
};

// Diretrizes mostradas no formulário (as mesmas do formulário antigo do Google).
export const diretrizes = [
  "É proibida a gravação de áudio e de vídeo, bem como a reprodução do conteúdo e o compartilhamento com pessoas não participantes, exceto sob autorização da organizadora.",
  "Ao se inscrever, você autoriza o uso de imagem (via prints da sala virtual) para fins de divulgação.",
  "Em caso de desistência depois de efetuada a inscrição, não haverá reembolso do valor da contribuição.",
];

// Quais botões de pagamento cada espaço mostra.
export const pagamentosDoEspaco: Record<"estudos" | "escuta", PagamentoKey[]> = {
  estudos: ["estudos"],
  escuta: ["ouvinte", "analista"],
};

const SERVICO_DO_BOTAO: Partial<Record<PagamentoKey, ServicoKey>> = {
  estudos: "estudos",
  ouvinte: "escuta-ouvinte",
  analista: "escuta-analista",
};

/** Botões de pagamento. No modo "verificado" passam pelo servidor do site; nos outros usam o link colado. */
export function botoesDePagamento(espaco: "estudos" | "escuta") {
  return pagamentosDoEspaco[espaco]
    .filter((k) => modoVerificado || pagamentos[k].link)
    .map((k) => ({
      key: k,
      label: pagamentos[k].label,
      href: modoVerificado ? `/api/pagar?servico=${SERVICO_DO_BOTAO[k]}` : pagamentos[k].link,
    }));
}

// Propostas extras, mostradas abaixo dos dois espaços. Datas e valores: combinar com a Polyana.
export const propostas: { name: string; text: string; pagamento: PagamentoKey }[] = [
  {
    pagamento: "minicurso",
    name: "Mini cursos",
    text: "Percursos curtos, de 5 encontros, sobre um tema ou autor da psicanálise.",
  },
  {
    pagamento: "leitura",
    name: "Grupo de leitura",
    text: "Leitura compartilhada de textos que fazem interseção com a psicanálise, com a política ou com a filosofia.",
  },
];

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
    d: "O link do encontro chega pelo grupo de WhatsApp, depois do pagamento.",
  },
  {
    t: "Sem reembolso",
    d: "Em caso de desistência, não há devolução do valor pago.",
  },
];

// Aviso final do site. Para tirar da página, é só remover <EmBreve /> do App.tsx.
export const embreve = {
  kicker: "Por vir",
  title: "Em breve,",
  highlight: "presencial.",
  text: "O Paralaxe também vai ganhar encontros presenciais. Ainda não há data nem local definidos: acompanhe o Instagram ou entre em um dos grupos de WhatsApp para saber em primeira mão.",
};

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

// Passos da inscrição com pagamento pelo site, enquanto o e-mail automático NÃO está ativo.
export const passosPagamentoManual = {
  estudos: [
    "Preencha o formulário de inscrição, com o e-mail que você confere.",
    "No fim do formulário, pague a mensalidade pelo Mercado Pago (Pix, cartão ou boleto).",
    "Entre no grupo de WhatsApp do Psicanálise em Paralaxe e receba o link do encontro.",
  ],
  escuta: [
    "Preencha o formulário de inscrição e escolha a modalidade, ouvinte ou analista.",
    "No fim do formulário, pague a sua modalidade pelo Mercado Pago (Pix, cartão ou boleto).",
    "Entre no grupo de WhatsApp da Escuta Clínica e receba o link do encontro.",
  ],
};

// Passos da inscrição no modo "verificado": paga e o convite aparece na tela depois de aprovado.
export const passosVerificado = {
  estudos: [
    "Clique em Mensalidade e pague pelo Mercado Pago (Pix, cartão ou boleto).",
    "Assim que o pagamento for aprovado, você volta ao site e o convite do grupo aparece na tela.",
    "Entre no grupo, guarde a página e participe do próximo encontro.",
  ],
  escuta: [
    "Escolha a modalidade, ouvinte ou analista, e pague pelo Mercado Pago (Pix, cartão ou boleto).",
    "Assim que o pagamento for aprovado, você volta ao site e o convite do grupo aparece na tela.",
    "Entre no grupo, guarde a página e participe do próximo encontro.",
  ],
};

// Passos da inscrição no modo "direto": paga em outra aba, volta ao site e o botão do grupo aparece.
export const passosDireto = {
  estudos: [
    "Clique em Mensalidade e pague pelo Mercado Pago (Pix, cartão ou boleto): ele abre em outra aba.",
    "Quando terminar, volte para esta página: o botão de entrar no grupo aparece.",
    "Entre no grupo. O acesso só é liberado após a confirmação do pagamento: a Polyana confere e aprova a sua entrada.",
  ],
  escuta: [
    "Escolha a modalidade, ouvinte ou analista, e pague pelo Mercado Pago (Pix, cartão ou boleto): ele abre em outra aba.",
    "Quando terminar, volte para esta página: o botão de entrar no grupo aparece.",
    "Entre no grupo. O acesso só é liberado após a confirmação do pagamento: a Polyana confere e aprova a sua entrada.",
  ],
};

// Passos da inscrição no modo "email": paga pelo link e recebe o convite no e-mail do pagamento.
export const passosEmail = {
  estudos: [
    "Clique em Mensalidade e pague pelo Mercado Pago (Pix, cartão ou boleto). Informe um e-mail que você confere: é nele que chega o convite.",
    "Em poucos minutos você recebe nesse e-mail o convite do grupo de WhatsApp e o link do encontro.",
    "Entre no grupo e participe do próximo encontro.",
  ],
  escuta: [
    "Escolha a modalidade, ouvinte ou analista, e pague pelo Mercado Pago (Pix, cartão ou boleto). Informe um e-mail que você confere: é nele que chega o convite.",
    "Em poucos minutos você recebe nesse e-mail o convite do grupo de WhatsApp e o link do encontro.",
    "Entre no grupo e participe do próximo encontro.",
  ],
};

// Passos da inscrição quando o formulário próprio, o pagamento e o e-mail automático estão ativos.
export const passosPagamento = {
  estudos: [
    "Preencha a inscrição com os seus dados e um e-mail que você confere: é nele que chega o convite.",
    "Pague pelo Mercado Pago (Pix, cartão ou boleto).",
    "Você recebe nesse e-mail o comprovante, o convite do grupo de WhatsApp e o link do encontro.",
  ],
  escuta: [
    "Preencha a inscrição, escolha a modalidade (ouvinte ou analista) e use um e-mail que você confere: é nele que chega o convite.",
    "Pague pelo Mercado Pago (Pix, cartão ou boleto).",
    "Você recebe nesse e-mail o comprovante, o convite do grupo de WhatsApp e o link do encontro.",
  ],
};

// Aviso curto sobre o e-mail do pagamento (mostrado perto dos botões de pagar).
export const avisoEmail = "Use um e-mail que você confere: o convite chega nele.";

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
    q: "Quanto custa o grupo de estudos?",
    a: "A contribuição mensal do Psicanálise em Paralaxe é de R$ 80. De vez em quando, promovemos encontros abertos e gratuitos, anunciados no Instagram e na agenda.",
  },
  {
    q: "Existe bolsa para quem não pode pagar o valor integral?",
    a: "Sim. Quem não puder contribuir com o valor integral, mas tem vontade de participar dos encontros, pode entrar como bolsista: combinamos uma contribuição parcial, a definir, e a pessoa ajuda a fazer a ideia circular, compartilhando o conteúdo do Instagram @paralaxeslab nas redes sociais. Para pedir a bolsa, é só falar com a Polyana pelo WhatsApp: (31) 98497-6108.",
    link: { label: "Pedir bolsa pelo WhatsApp", href: links.whatsappPolyana },
  },
  {
    q: "Qual a diferença entre ouvinte e analista?",
    a: "O ouvinte participa da escuta e da conversa sobre o caso apresentado. O analista, além disso, pode trazer um relato de caso clínico para o grupo discutir.",
  },
  {
    q: "Como recebo o link dos encontros?",
    a: "Depois do pagamento, pelo grupo de WhatsApp: a Polyana posta o link no grupo. Os encontros acontecem on-line, pelo Google Meet.",
  },
  {
    q: "Os encontros ficam gravados?",
    a: "Não. As gravações e o compartilhamento dos encontros não são permitidos.",
  },
  ...(modoVerificado
    ? [
        {
          q: "O que acontece depois que eu pago?",
          a: "Quando o Mercado Pago aprova o pagamento, você volta automaticamente ao site, e uma página mostra o convite do grupo de WhatsApp e os links do encontro. Guarde essa página nos favoritos. Se fechar sem querer ou o pagamento demorar (como no boleto), chame a Polyana pelo Instagram @paralaxeslab com o comprovante.",
        },
      ]
    : []),
  ...(pagamentoAtivo && emailAutomatico
    ? [
        {
          q: "Para qual e-mail vai o convite?",
          a: "Para o e-mail que você informar no pagamento pelo Mercado Pago. Por isso, use um e-mail que você confere sempre. Se o e-mail não chegar em alguns minutos, olhe o spam e a aba Promoções; se ainda assim não aparecer, chame a Polyana pelo Instagram @paralaxeslab.",
        },
      ]
    : []),
  {
    q: "Posso desistir depois de me inscrever?",
    a: "Pode, mas não há reembolso do valor pago em caso de desistência.",
  },
];
