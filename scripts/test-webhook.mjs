// Teste local do webhook, sem internet e sem enviar e-mails de verdade.
// Rodar: node scripts/test-webhook.mjs
import crypto from "node:crypto";

process.env.DRY_RUN = "1";
process.env.MP_WEBHOOK_SECRET = "segredo-de-teste";
process.env.MP_ACCESS_TOKEN = "token-de-teste";
process.env.POLYANA_EMAIL = "polyana@exemplo.com";

const { default: handler } = await import("../api/mp-webhook.js");

// Respostas falsas do Mercado Pago
const pagamentos = {
  1001: { id: 1001, status: "approved", transaction_amount: 80, description: "Paralaxe Estudos Mensalidade", payer: { email: "ana@exemplo.com", first_name: "Ana", last_name: "Souza" } },
  1002: { id: 1002, status: "pending", transaction_amount: 80, description: "Paralaxe Estudos Mensalidade", payer: { email: "b@exemplo.com" } },
  1003: { id: 1003, status: "approved", transaction_amount: 40, description: "Paralaxe Estudos Bolsista", payer: { email: "bia@exemplo.com", first_name: "Bia" } },
  1004: { id: 1004, status: "approved", transaction_amount: 10, description: "Outra coisa qualquer", payer: { email: "c@exemplo.com" } },
  1005: { id: 1005, status: "approved", transaction_amount: 50, description: "Paralaxe Escuta Ouvinte", payer: { email: "dan@exemplo.com", first_name: "<script>alert(1)</script>" } },
  1007: { id: 1007, status: "approved", transaction_amount: 80, description: "Grupo de Estudos: Psicanálise em Paralaxe", payer: { email: "eva@exemplo.com", first_name: "Eva" } },
  1008: { id: 1008, status: "approved", transaction_amount: 50, description: "Grupo de Supervisão: Escuta Clínica - mod. ouvinte", payer: { email: "fia@exemplo.com", first_name: "Fia" } },
  1009: { id: 1009, status: "approved", transaction_amount: 90, description: "Grupo de supervisão Escuta Clínica - Mod. Analista", payer: { email: "gui@exemplo.com", first_name: "Gui" } },
  1010: { id: 1010, status: "approved", transaction_amount: 80, description: "Grupo de Estudos: Psicanálise em Paralaxe", payer: { email: "eva@exemplo.com", first_name: "Eva" } },
  1006: { id: 1006, status: "approved", transaction_amount: 50, description: "Paralaxe Escuta Ouvinte", payer: { email: "dan@exemplo.com", first_name: "Dan" } },
};
const assinaturas = {
  "sub-1": { id: "sub-1", status: "cancelled", payer_email: "ana@exemplo.com", reason: "Paralaxe Estudos Mensalidade" },
};

globalThis.fetch = async (url) => {
  const u = String(url);
  let corpo = null;
  const mpPay = u.match(/\/v1\/payments\/(\d+)/);
  const mpSub = u.match(/\/preapproval\/([\w-]+)/);
  if (mpPay) corpo = pagamentos[mpPay[1]];
  if (mpSub) corpo = assinaturas[mpSub[1]];
  return corpo ? { ok: true, status: 200, json: async () => corpo } : { ok: false, status: 404, json: async () => ({}), text: async () => "" };
};

const enviados = [];
const log = console.log;
console.log = (...a) => {
  const s = a.join(" ");
  if (s.startsWith("[DRY_RUN e-mail]")) enviados.push(s.replace("[DRY_RUN e-mail] ", ""));
};

function assinar(dataId, reqId = "req-" + Math.random()) {
  const ts = String(Date.now());
  const v1 = crypto.createHmac("sha256", process.env.MP_WEBHOOK_SECRET).update(`id:${dataId};request-id:${reqId};ts:${ts};`).digest("hex");
  return { "x-signature": `ts=${ts},v1=${v1}`, "x-request-id": reqId };
}

async function chamar({ tipo = "payment", id, headers }) {
  const req = { method: "POST", headers: headers ?? assinar(id), query: { "data.id": String(id), type: tipo }, body: { type: tipo, data: { id: String(id) } } };
  let status = 0;
  let json = null;
  const res = { setHeader() {}, status(s) { status = s; return this; }, json(j) { json = j; return this; } };
  enviados.length = 0;
  await handler(req, res);
  return { status, json, enviados: [...enviados] };
}

let falhas = 0;
const confere = (nome, ok, extra = "") => {
  if (!ok) falhas++;
  log(`${ok ? "OK   " : "FALHA"}  ${nome}${ok ? "" : "  -> " + extra}`);
};

let r = await chamar({ id: 1001, headers: { "x-signature": "ts=1,v1=errado", "x-request-id": "x" } });
confere("assinatura inválida é recusada (401)", r.status === 401 && r.enviados.length === 0);

r = await chamar({ id: 1001 });
confere("pagamento aprovado: e-mail para a pessoa e para a Polyana", r.status === 200 && r.enviados.length === 2 && r.enviados[0].startsWith("para=ana@exemplo.com") && r.enviados[1].startsWith("para=polyana@exemplo.com"), JSON.stringify(r));

r = await chamar({ id: 1001 });
confere("o mesmo aviso de novo não manda e-mail em duplicidade", r.status === 200 && r.json.duplicado && r.enviados.length === 0, JSON.stringify(r));

r = await chamar({ id: 1002 });
confere("pagamento pendente é ignorado", r.status === 200 && r.enviados.length === 0 && /pending/.test(r.json.ignorado), JSON.stringify(r));

r = await chamar({ id: 1003 });
confere("título 'Estudos Bolsista' cai no produto bolsista", r.json.enviado === "estudos-bolsista", JSON.stringify(r));

r = await chamar({ id: 1004 });
confere("título desconhecido avisa só a Polyana", r.json.naoIdentificado && r.enviados.length === 1 && r.enviados[0].startsWith("para=polyana@exemplo.com"), JSON.stringify(r));

r = await chamar({ id: 1005 });
confere("avulso (ouvinte) 1ª compra envia", r.json.enviado === "escuta-ouvinte" && r.enviados.length === 2, JSON.stringify(r));
r = await chamar({ id: 1006 });
confere("avulso (ouvinte) 2ª compra, outro pagamento, também envia", r.json.enviado === "escuta-ouvinte" && r.enviados.length === 2, JSON.stringify(r));

r = await chamar({ id: 1007 });
confere("título real do link de R$ 80 cai em estudos", r.json.enviado === "estudos" && r.enviados.length === 2, JSON.stringify(r));
r = await chamar({ id: 1008 });
confere("título real do link de R$ 50 cai em escuta-ouvinte", r.json.enviado === "escuta-ouvinte", JSON.stringify(r));
r = await chamar({ id: 1009 });
confere("título real do link de R$ 90 cai em escuta-analista", r.json.enviado === "escuta-analista", JSON.stringify(r));
r = await chamar({ id: 1010 });
confere("mensalidade do mês seguinte (outro pagamento) manda e-mail de novo", r.json.enviado === "estudos" && r.enviados.length === 2, JSON.stringify(r));

r = await chamar({ tipo: "subscription_preapproval", id: "sub-1" });
confere("assinatura cancelada avisa a Polyana", r.json.aviso === "cancelled" && r.enviados.length === 1 && /cancelada/.test(r.enviados[0]), JSON.stringify(r));

r = await chamar({ id: 99999 });
confere("ID que não existe (simulação do painel) responde 200", r.status === 200 && /não encontrado/.test(r.json.ignorado), JSON.stringify(r));

// HTML: o nome digitado pela pessoa não pode virar código no e-mail
const { emailAluno, emailPolyanaNovo } = await import("../api/_emails.js");
const { produtos } = await import("../api/_produtos.js");
const html = emailAluno({ produto: produtos[1], nome: "<script>alert(1)</script>", valor: 80 }).html + emailPolyanaNovo({ produto: produtos[1], nome: "<b>x</b>", email: "a@b.c", valor: 80 }).html;
confere("nomes digitados são escapados no HTML", !html.includes("<script>") && !html.includes("<b>x</b>"));

log(falhas ? `\n${falhas} teste(s) falharam` : "\nTodos os testes passaram");
process.exit(falhas ? 1 : 0);
