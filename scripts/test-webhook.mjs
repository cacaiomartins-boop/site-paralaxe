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

const preferencias = [];
let ultimaAuth;
const chamadasOauth = [];
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  ultimaAuth = opts?.headers?.Authorization;
  if (u.includes("/oauth/token")) {
    const b = JSON.parse(opts.body);
    chamadasOauth.push(b);
    const novo = b.grant_type === "refresh_token";
    return { ok: true, status: 200, json: async () => ({ access_token: novo ? "TOKEN-NOVO" : "TOKEN-OAUTH", refresh_token: "REFRESH-1", expires_in: 15552000, user_id: 123 }) };
  }
  if (u.includes("/checkout/preferences")) {
    preferencias.push(JSON.parse(opts.body));
    return { ok: true, status: 200, json: async () => ({ init_point: "https://mp.exemplo/pagar/abc" }) };
  }
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

// ---------- formulário de inscrição ----------
const { default: inscricao, validar } = await import("../api/inscricao.js");

async function inscrever(corpo, host = "paralaxe.exemplo") {
  const req = { method: "POST", headers: { host, "x-forwarded-for": "1.2.3.4" }, body: corpo };
  let status = 0;
  let json = null;
  const res = { setHeader() {}, status(s) { status = s; return this; }, json(j) { json = j; return this; } };
  await inscricao(req, res);
  return { status, json };
}

const valido = { servico: "estudos", nome: "Maria Souza", email: "maria@exemplo.com", whatsapp: "(31) 98497-6108", formacao: "psicologo", origem: "instagram", aceite: true };
const erro = (c) => { try { validar(c); return null; } catch (e) { return e.message; } };

confere("rejeita nome curto", !!erro({ ...valido, nome: "A" }));
confere("rejeita e-mail inválido", !!erro({ ...valido, email: "maria@" }));
confere("rejeita WhatsApp inválido", !!erro({ ...valido, whatsapp: "123" }));
confere("rejeita sem aceitar as diretrizes", !!erro({ ...valido, aceite: false }));
confere("rejeita serviço que não existe", !!erro({ ...valido, servico: "grátis" }));
confere("WhatsApp vira 55 + DDD + número", validar(valido).whatsapp === "5531984976108");

let ri = await inscrever({ ...valido, preco: 1 });
const pref = preferencias.at(-1);
confere("inscrição válida devolve o link de pagamento", ri.status === 200 && ri.json.url === "https://mp.exemplo/pagar/abc", JSON.stringify(ri));
confere("preço vem do servidor (ignora preço enviado pelo navegador)", pref.items[0].unit_price === 80 && pref.items[0].title.includes("Psicanálise em Paralaxe"));
confere("pagamento leva o código da inscrição e o aviso ao webhook", /^[a-f0-9]{32}$/.test(pref.external_reference) && pref.notification_url === "https://paralaxe.exemplo/api/mp-webhook" && pref.payer.email === "maria@exemplo.com");

ri = await inscrever({ ...valido, site: "robo" });
confere("campo escondido (robô) não cria pagamento", ri.status === 200 && preferencias.length === 1);

ri = await inscrever({ ...valido, nome: "" });
confere("dado inválido responde 400 e não cria pagamento", ri.status === 400 && preferencias.length === 1, JSON.stringify(ri));

// pagamento aprovado desse formulário: o e-mail vai para o digitado, com WhatsApp no aviso da Polyana
pagamentos[3001] = { id: 3001, status: "approved", transaction_amount: 80, description: "qualquer coisa", external_reference: pref.external_reference, payer: { email: "outro@conta-mp.com", first_name: "Conta" } };
globalThis.__emailsDryRun = [];
r = await chamar({ id: 3001 });
const emails = globalThis.__emailsDryRun;
const aluno = emails.find((e) => e.para === "maria@exemplo.com");
const pol = emails.find((e) => e.para === "polyana@exemplo.com");
confere("pagou pelo formulário: e-mail vai para o digitado (não para o da conta do pagador)", r.json.enviado === "estudos" && !!aluno && !emails.some((e) => e.para === "outro@conta-mp.com"), JSON.stringify(r));
confere("aviso da Polyana traz nome, WhatsApp e botão de conversa", !!pol && pol.html.includes("Maria Souza") && pol.html.includes("5531984976108") && pol.html.includes("wa.me/5531984976108"));

// quem volta a pagar pelo link antigo: acha a inscrição pelo e-mail
pagamentos[3002] = { id: 3002, status: "approved", transaction_amount: 80, description: "Grupo de Estudos: Psicanálise em Paralaxe", payer: { email: "maria@exemplo.com" } };
globalThis.__emailsDryRun = [];
r = await chamar({ id: 3002 });
confere("pagamento por link antigo acha o WhatsApp pelo e-mail", r.json.enviado === "estudos" && globalThis.__emailsDryRun.some((e) => e.para === "polyana@exemplo.com" && e.html.includes("5531984976108")), JSON.stringify(r));

// ---------- aviso antigo da conta (IPN): sem assinatura, com ?topic=payment&id=... ----------
pagamentos[4001] = { id: 4001, status: "approved", transaction_amount: 50, description: "Grupo de Supervisão: Escuta Clínica - mod. ouvinte", payer: { email: "ipn@exemplo.com", first_name: "Ipê" } };
async function chamarIpn({ query, headers = {} }) {
  const req = { method: "POST", headers, query, body: {} };
  let status = 0;
  let json = null;
  const res = { setHeader() {}, status(s) { status = s; return this; }, json(j) { json = j; return this; } };
  enviados.length = 0;
  await handler(req, res);
  return { status, json, enviados: [...enviados] };
}
r = await chamarIpn({ query: { topic: "payment", id: "4001" } });
confere("aviso IPN (sem assinatura, com topic) é aceito e manda o convite", r.status === 200 && r.json.enviado === "escuta-ouvinte" && r.enviados.length === 2, JSON.stringify(r));
r = await chamarIpn({ query: { id: "4001" } });
confere("aviso sem assinatura e sem topic é recusado", r.status === 401 && r.enviados.length === 0, JSON.stringify(r));
r = await chamarIpn({ query: { topic: "merchant_order", id: "77" } });
confere("IPN de pedido (merchant_order) é ignorado", r.status === 200 && /merchant_order/.test(r.json.ignorado), JSON.stringify(r));

// ---------- modo "verificado": pagar -> voltar -> conferir ----------
process.env.CONECTAR_CHAVE = "chave-secreta-de-teste";
process.env.MP_CLIENT_ID = "cliente-1";
process.env.MP_CLIENT_SECRET = "segredo-1";
process.env.SITE_URL = "https://paralaxe.exemplo";

const { default: pagar } = await import("../api/pagar.js");
const { default: verificar } = await import("../api/verificar.js");
const { default: conectar } = await import("../api/conectar.js");
const { default: conectarRetorno } = await import("../api/conectar-retorno.js");
const { salvar } = await import("../api/_lib.js");

async function get(mod, query) {
  const req = { method: "GET", headers: { host: "paralaxe.exemplo", "x-forwarded-for": "9.9.9.9" }, query };
  const out = { status: 0, headers: {}, body: null, json: null };
  const res = {
    setHeader(k, v) { out.headers[k] = v; },
    status(s) { out.status = s; return this; },
    json(j) { out.json = j; return this; },
    end(b) { out.body = b; return this; },
  };
  await mod(req, res);
  return out;
}

let g = await get(pagar, { servico: "estudos" });
let pv = preferencias.at(-1);
confere("pagar: manda a pessoa para o Mercado Pago (302)", g.status === 302 && g.headers.Location === "https://mp.exemplo/pagar/abc", JSON.stringify(g));
confere("pagar: preço do servidor, volta para a página de obrigado e referência do serviço", pv.items[0].unit_price === 80 && pv.auto_return === "approved" && pv.back_urls.success === "https://paralaxe.exemplo/obrigado.html" && /^estudos\.[a-f0-9]{24}$/.test(pv.external_reference), JSON.stringify(pv));
const refEstudos = pv.external_reference;

g = await get(pagar, { servico: "de-graca" });
confere("pagar: serviço inexistente é recusado (400)", g.status === 400);
g = await get(pagar, { servico: "estudos", teste: "1", chave: "errada" });
confere("pagar: pedido de teste sem a chave secreta continua R$ 80", preferencias.at(-1).items[0].unit_price === 80);
g = await get(pagar, { servico: "estudos", teste: "1", chave: "chave-secreta-de-teste" });
const refTeste = preferencias.at(-1).external_reference;
confere("pagar: teste com a chave secreta cobra R$ 1", preferencias.at(-1).items[0].unit_price === 1 && /^estudos\.teste\.[a-f0-9]{24}$/.test(refTeste));

pagamentos[5001] = { id: 5001, status: "approved", transaction_amount: 80, external_reference: refEstudos };
pagamentos[5002] = { id: 5002, status: "approved", transaction_amount: 80, external_reference: "estudos.aaaaaaaaaaaaaaaaaaaaaaaa" };
pagamentos[5003] = { id: 5003, status: "approved", transaction_amount: 10, external_reference: refEstudos };
pagamentos[5004] = { id: 5004, status: "pending", transaction_amount: 80, external_reference: refEstudos };
pagamentos[5005] = { id: 5005, status: "rejected", transaction_amount: 80, external_reference: refEstudos };
pagamentos[5006] = { id: 5006, status: "approved", transaction_amount: 1, external_reference: refTeste };

g = await get(verificar, { payment_id: "5001", ref: refEstudos });
confere("verificar: pagamento aprovado devolve os links do serviço", g.json.ok === true && g.json.links.some((l) => l.url.includes("chat.whatsapp.com")) && g.headers["Cache-Control"] === "no-store", JSON.stringify(g));
g = await get(verificar, { payment_id: "5002", ref: refEstudos });
confere("verificar: pagamento de outra referência não libera nada", g.json.ok === false && g.json.estado === "invalido", JSON.stringify(g));
g = await get(verificar, { payment_id: "5003", ref: refEstudos });
confere("verificar: valor menor que o preço não libera", g.json.ok === false, JSON.stringify(g));
g = await get(verificar, { payment_id: "5004", ref: refEstudos });
confere("verificar: pagamento pendente (Pix/boleto) responde pendente", g.json.ok === false && g.json.estado === "pendente", JSON.stringify(g));
g = await get(verificar, { payment_id: "5005", ref: refEstudos });
confere("verificar: pagamento recusado não libera", g.json.ok === false && g.json.estado === "recusado", JSON.stringify(g));
g = await get(verificar, { payment_id: "5006", ref: refTeste });
confere("verificar: pagamento de teste de R$ 1 libera", g.json.ok === true, JSON.stringify(g));
g = await get(verificar, { payment_id: "../x", ref: "lixo" });
confere("verificar: dados malformados respondem 400", g.status === 400, JSON.stringify(g));
g = await get(verificar, { payment_id: "999999", ref: refEstudos });
confere("verificar: pagamento que ainda não existe responde pendente", g.json.estado === "pendente", JSON.stringify(g));

// ---------- autorização em um clique ----------
g = await get(conectar, { chave: "errada" });
confere("conectar: sem a chave secreta é recusado (403)", g.status === 403);
g = await get(conectar, { chave: "chave-secreta-de-teste" });
const url = new URL(g.headers.Location);
const state = url.searchParams.get("state");
confere("conectar: leva ao Mercado Pago pedindo autorização", g.status === 302 && url.host === "auth.mercadopago.com" && url.searchParams.get("client_id") === "cliente-1" && url.searchParams.get("redirect_uri") === "https://paralaxe.exemplo/api/conectar-retorno" && /^[a-f0-9]{32}$/.test(state));

g = await get(conectarRetorno, { code: "abc", state: "0".repeat(32) });
confere("retorno: state desconhecido é recusado", g.status === 400 && chamadasOauth.length === 0);
g = await get(conectarRetorno, { code: "codigo-1", state });
confere("retorno: código válido vira token guardado", g.status === 200 && chamadasOauth.length === 1 && chamadasOauth[0].grant_type === "authorization_code" && chamadasOauth[0].code === "codigo-1", JSON.stringify(g));
g = await get(conectarRetorno, { code: "codigo-2", state });
confere("retorno: o mesmo state não vale duas vezes", g.status === 400 && chamadasOauth.length === 1);

// sem MP_ACCESS_TOKEN fixo, o token autorizado é usado
const tokenFixo = process.env.MP_ACCESS_TOKEN;
delete process.env.MP_ACCESS_TOKEN;
g = await get(verificar, { payment_id: "5001", ref: refEstudos });
confere("token autorizado é usado nas consultas", g.json.ok === true && ultimaAuth === "Bearer TOKEN-OAUTH", ultimaAuth);

await salvar("mp:oauth", { access_token: "TOKEN-VELHO", refresh_token: "REFRESH-1", expira_em: Date.now() + 2 * 24 * 3600 * 1000, user_id: 123 }, 3600);
g = await get(verificar, { payment_id: "5001", ref: refEstudos });
confere("token perto de vencer é renovado sozinho", g.json.ok === true && ultimaAuth === "Bearer TOKEN-NOVO" && chamadasOauth.at(-1).grant_type === "refresh_token", ultimaAuth);
process.env.MP_ACCESS_TOKEN = tokenFixo;

// HTML: o nome digitado pela pessoa não pode virar código no e-mail
const { emailAluno, emailPolyanaNovo } = await import("../api/_emails.js");
const { produtos } = await import("../api/_produtos.js");
const html = emailAluno({ produto: produtos[1], nome: "<script>alert(1)</script>", valor: 80 }).html + emailPolyanaNovo({ produto: produtos[1], nome: "<b>x</b>", email: "a@b.c", valor: 80 }).html;
confere("nomes digitados são escapados no HTML", !html.includes("<script>") && !html.includes("<b>x</b>"));

log(falhas ? `\n${falhas} teste(s) falharam` : "\nTodos os testes passaram");
process.exit(falhas ? 1 : 0);
