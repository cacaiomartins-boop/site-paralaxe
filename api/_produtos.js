// Catálogo do lado do servidor: o que cada pagamento libera.
// O produto é reconhecido pelo TÍTULO do link/assinatura criado no Mercado Pago
// (veja "match") ou pelo ID do plano de assinatura (planId), se a Polyana passar.
// A ordem importa: o primeiro produto que bater vence (bolsista antes do integral).
//
// Os links de grupo e Drive são os mesmos de src/data/clinic.ts.

const MEET_ESTUDOS = ""; // link fixo do Google Meet das terças (a Polyana passa)
const MEET_ESCUTA = ""; // link fixo do Google Meet das quartas (a Polyana passa)
const GRUPO_ESTUDOS = "https://chat.whatsapp.com/FeNOIxgSVKJ00fuQJpqXa5";
const GRUPO_ESCUTA = "https://chat.whatsapp.com/BDs5VECjtDGDaCIjBmh1nJ";
const DRIVE = "https://drive.google.com/drive/folders/1IRHrd9MvIllvKwC418wjmRgv2hKftv0Y";

const so = (itens) => itens.filter((l) => l.url);

export const produtos = [
  {
    chave: "estudos-bolsista",
    nome: "Psicanálise em Paralaxe (bolsista)",
    tipo: "assinatura",
    match: ["paralaxe estudos bolsista"],
    planId: "",
    horario: "Terças-feiras, 20h30, on-line",
    links: so([
      { label: "Entrar no grupo de WhatsApp", url: GRUPO_ESTUDOS },
      { label: "Link do encontro (Google Meet)", url: MEET_ESTUDOS },
      { label: "Pasta de textos (Google Drive)", url: DRIVE },
    ]),
  },
  {
    chave: "estudos",
    nome: "Psicanálise em Paralaxe",
    tipo: "assinatura",
    match: ["paralaxe estudos"],
    planId: "",
    horario: "Terças-feiras, 20h30, on-line",
    links: so([
      { label: "Entrar no grupo de WhatsApp", url: GRUPO_ESTUDOS },
      { label: "Link do encontro (Google Meet)", url: MEET_ESTUDOS },
      { label: "Pasta de textos (Google Drive)", url: DRIVE },
    ]),
  },
  {
    chave: "escuta-ouvinte",
    nome: "Escuta Clínica (ouvinte)",
    tipo: "avulso",
    match: ["paralaxe escuta ouvinte"],
    planId: "",
    horario: "Quartas-feiras, 20h às 21h30, on-line",
    links: so([
      { label: "Entrar no grupo de WhatsApp", url: GRUPO_ESCUTA },
      { label: "Link do encontro (Google Meet)", url: MEET_ESCUTA },
    ]),
  },
  {
    chave: "escuta-analista",
    nome: "Escuta Clínica (analista)",
    tipo: "avulso",
    match: ["paralaxe escuta analista"],
    planId: "",
    horario: "Quartas-feiras, 20h às 21h30, on-line",
    links: so([
      { label: "Entrar no grupo de WhatsApp", url: GRUPO_ESCUTA },
      { label: "Link do encontro (Google Meet)", url: MEET_ESCUTA },
    ]),
  },
  {
    chave: "minicurso",
    nome: "Mini curso",
    tipo: "avulso",
    match: ["paralaxe mini curso", "paralaxe minicurso"],
    planId: "",
    horario: "Datas combinadas com a Polyana",
    links: so([]),
  },
  {
    chave: "leitura",
    nome: "Grupo de leitura",
    tipo: "avulso",
    match: ["paralaxe leitura"],
    planId: "",
    horario: "Datas combinadas com a Polyana",
    links: so([]),
  },
];
