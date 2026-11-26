// Peças usadas pelo webhook: assinatura do Mercado Pago, consultas, e-mail e controle de duplicados.
import crypto from "node:crypto";
import { produtos } from "./_produtos.js";

const env = (k) => (process.env[k] || "").trim();
export const dryRun = () => env("DRY_RUN") === "1";

/* ---------- texto ---------- */
export const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENT[c]);

export const brl = (v) =>
  typeof v === "number" ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "";

/* ---------- assinatura do webhook ---------- */
// https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
export function assinaturaValida(req, dataId) {
  const secret = env("MP_WEBHOOK_SECRET");
  const header = String(req.headers["x-signature"] || "");
  // Aviso antigo da conta (IPN) vem sem assinatura. Tudo o que importa é reconsultado na API do
  // Mercado Pago com o token, então um aviso falso não consegue inventar um pagamento.
  if (!header) return Boolean(req.query && req.query.topic) || (!secret && dryRun());
  if (!secret) return dryRun(); // sem segredo só vale em teste local
  const reqId = String(req.headers["x-request-id"] || "");
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    }),
  );
  if (!parts.ts || !parts.v1) return false;
  let manifest = "";
  if (dataId) manifest += `id:${String(dataId).toLowerCase()};`;
  if (reqId) manifest += `request-id:${reqId};`;
  manifest += `ts:${parts.ts};`;
  const esperado = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  const a = Buffer.from(esperado);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- token do vendedor ---------- */
// A Polyana autoriza a conta dela com um clique (api/conectar.js). O token (válido por 180 dias) fica no Redis
// e é renovado sozinho. Quem preferir pode fixar MP_ACCESS_TOKEN na Vercel, que vale mais que o autorizado.
export async function tokenVendedor() {
  const fixo = env("MP_ACCESS_TOKEN");
  if (fixo) return fixo;
  const t = await ler("mp:oauth");
  if (!t) return "";
  if (t.expira_em - Date.now() > 7 * DIAS * 1000) return t.access_token;

  const r = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env("MP_CLIENT_ID"),
      client_secret: env("MP_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: t.refresh_token,
    }),
  });
  if (!r.ok) {
    if (t.expira_em > Date.now()) return t.access_token; // ainda vale; tenta renovar de novo depois
    throw new Error(`Renovação do token do Mercado Pago falhou (${r.status}): a Polyana precisa autorizar de novo`);
  }
  const n = await r.json();
  const novo = {
    access_token: n.access_token,
    refresh_token: n.refresh_token || t.refresh_token,
    expira_em: Date.now() + (n.expires_in || 180 * DIAS) * 1000,
    user_id: t.user_id,
  };
  await salvar("mp:oauth", novo, 400 * DIAS);
  return novo.access_token;
}

/** Resposta de redirecionamento (compatível com a Vercel e com o teste local). */
export function redirecionar(res, url) {
  res.setHeader("Location", url);
  res.status(302);
  res.end();
}

export function html(res, status, corpo) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(status);
  res.end(corpo);
}

/* ---------- Mercado Pago ---------- */
export async function mp(caminho) {
  const token = await tokenVendedor();
  if (!token) {
    // Só no teste local (npm run dev): "ok-<referência>" vira um pagamento aprovado de mentira.
    const falso = dryRun() && caminho.match(/^\/v1\/payments\/ok-(.+)$/);
    if (falso) {
      const ref = falso[1];
      const produto = produtos.find((p) => p.chave === ref.split(".")[0]);
      return { id: `ok-${ref}`, status: "approved", external_reference: ref, transaction_amount: produto ? produto.preco : 0 };
    }
    throw new Error("Mercado Pago não conectado (autorize a conta ou configure MP_ACCESS_TOKEN)");
  }
  const r = await fetch(`https://api.mercadopago.com${caminho}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`Mercado Pago ${caminho} respondeu ${r.status}`);
  return r.json();
}

/** Acha o produto pelo ID do plano, pela referência externa ou pelo título. */
export function identificarProduto({ planId, referencia, textos, produtoChave }) {
  const ref = norm(referencia);
  const texto = norm((textos || []).filter(Boolean).join(" | "));
  const direto = produtoChave && produtos.find((p) => p.chave === produtoChave);
  if (direto) return direto;
  return (
    produtos.find(
      (p) =>
        (planId && p.planId && p.planId === String(planId)) ||
        (ref && ref === p.chave) ||
        p.match.some((m) => texto.includes(norm(m))),
    ) || null
  );
}

/* ---------- controle de duplicados (Upstash Redis) ---------- */
const memoria = new Set(); // só para teste local (DRY_RUN)

async function redis(comando) {
  const r = await fetch(env("UPSTASH_REDIS_REST_URL"), {
    method: "POST",
    headers: { Authorization: `Bearer ${env("UPSTASH_REDIS_REST_TOKEN")}`, "Content-Type": "application/json" },
    body: JSON.stringify(comando),
  });
  if (!r.ok) throw new Error(`Redis respondeu ${r.status}`);
  return (await r.json()).result;
}

const temRedis = () => Boolean(env("UPSTASH_REDIS_REST_URL") && env("UPSTASH_REDIS_REST_TOKEN"));

/** Retorna true se esta é a PRIMEIRA vez que a chave aparece. */
export async function primeiraVez(chave) {
  if (!temRedis()) {
    if (!dryRun()) return true; // modo simples: sem Redis, a idempotência fica por conta do envio
    if (memoria.has(chave)) return false;
    memoria.add(chave);
    return true;
  }
  const ok = await redis(["SET", `paralaxe:${chave}`, "1", "NX", "EX", String(60 * 60 * 24 * 400)]);
  return ok === "OK";
}

/** Libera a chave se o envio falhar, para o Mercado Pago poder tentar de novo. */
export async function liberar(chave) {
  if (!temRedis()) return void (memoria.delete(chave), guardado.delete(chave));
  await redis(["DEL", `paralaxe:${chave}`]).catch(() => {});
}

/* ---------- inscrições guardadas (Redis) ---------- */
const guardado = new Map(); // só para teste local (DRY_RUN)
const DIAS = 60 * 60 * 24;

export async function salvar(chave, valor, segundos) {
  if (!temRedis()) {
    if (!dryRun()) throw new Error("Redis (UPSTASH_REDIS_REST_URL/TOKEN) não configurado");
    guardado.set(chave, JSON.stringify(valor));
    return;
  }
  await redis(["SET", `paralaxe:${chave}`, JSON.stringify(valor), "EX", String(segundos)]);
}

export async function ler(chave) {
  let bruto;
  if (!temRedis()) {
    if (!dryRun()) return null; // modo simples: não há inscrições guardadas
    bruto = guardado.get(chave);
  } else {
    bruto = await redis(["GET", `paralaxe:${chave}`]);
  }
  try {
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

/** Guarda a inscrição por ID e pelo e-mail (para achar de novo quem volta a pagar). */
export async function guardarInscricao(id, dados) {
  await salvar(`insc:${id}`, dados, 120 * DIAS);
  await salvar(`email:${norm(dados.email)}`, { id }, 400 * DIAS);
}

export const lerInscricao = (id) => ler(`insc:${id}`);

export async function inscricaoPorEmail(email) {
  const ref = email ? await ler(`email:${norm(email)}`) : null;
  return ref?.id ? lerInscricao(ref.id) : null;
}

/** Limite simples por IP: devolve false quando passou do máximo na janela. */
export async function dentroDoLimite(chave, maximo, janelaSeg) {
  if (!temRedis()) return true;
  const n = await redis(["INCR", `paralaxe:rl:${chave}`]);
  if (n === 1) await redis(["EXPIRE", `paralaxe:rl:${chave}`, String(janelaSeg)]);
  return n <= maximo;
}

/* ---------- criar pagamento no Mercado Pago ---------- */
export async function mpPost(caminho, corpo) {
  const token = await tokenVendedor();
  if (!token) {
    if (dryRun()) return { init_point: `${corpo.back_urls?.success || ""}?teste=1`, id: "dry" };
    throw new Error("MP_ACCESS_TOKEN não configurado");
  }
  const r = await fetch(`https://api.mercadopago.com${caminho}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  if (!r.ok) throw new Error(`Mercado Pago ${caminho} respondeu ${r.status}: ${await r.text()}`);
  return r.json();
}

export const siteUrl = (req) => env("SITE_URL").replace(/\/$/, "") || `https://${req.headers.host}`;

/* ---------- e-mail (Resend) ---------- */
export async function enviarEmail({ para, assunto, html, responderPara, idempotencia }) {
  if (dryRun()) {
    console.log(`[DRY_RUN e-mail] para=${para} | assunto=${assunto}`);
    (globalThis.__emailsDryRun ||= []).push({ para, assunto, html });
    return { dryRun: true, para, assunto, html };
  }
  const key = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM");
  if (!key || !from) throw new Error("RESEND_API_KEY / EMAIL_FROM não configurados");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(idempotencia ? { "Idempotency-Key": idempotencia } : {}),
    },
    body: JSON.stringify({ from, to: [para], subject: assunto, html, reply_to: responderPara || undefined }),
  });
  if (!r.ok) throw new Error(`Resend respondeu ${r.status}: ${await r.text()}`);
  return r.json();
}

export const emailPolyana = () => env("POLYANA_EMAIL");
