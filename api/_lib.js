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
  if (!secret) return dryRun(); // sem segredo só vale em teste local
  const header = String(req.headers["x-signature"] || "");
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

/* ---------- Mercado Pago ---------- */
export async function mp(caminho) {
  const token = env("MP_ACCESS_TOKEN");
  if (!token) throw new Error("MP_ACCESS_TOKEN não configurado");
  const r = await fetch(`https://api.mercadopago.com${caminho}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`Mercado Pago ${caminho} respondeu ${r.status}`);
  return r.json();
}

/** Acha o produto pelo ID do plano, pela referência externa ou pelo título. */
export function identificarProduto({ planId, referencia, textos }) {
  const ref = norm(referencia);
  const texto = norm((textos || []).filter(Boolean).join(" | "));
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
    if (!dryRun()) throw new Error("Redis (UPSTASH_REDIS_REST_URL/TOKEN) não configurado");
    if (memoria.has(chave)) return false;
    memoria.add(chave);
    return true;
  }
  const ok = await redis(["SET", `paralaxe:${chave}`, "1", "NX", "EX", String(60 * 60 * 24 * 400)]);
  return ok === "OK";
}

/** Libera a chave se o envio falhar, para o Mercado Pago poder tentar de novo. */
export async function liberar(chave) {
  if (!temRedis()) return void memoria.delete(chave);
  await redis(["DEL", `paralaxe:${chave}`]).catch(() => {});
}

/* ---------- e-mail (Resend) ---------- */
export async function enviarEmail({ para, assunto, html, responderPara }) {
  if (dryRun()) {
    console.log(`[DRY_RUN e-mail] para=${para} | assunto=${assunto}`);
    return { dryRun: true, para, assunto, html };
  }
  const key = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM");
  if (!key || !from) throw new Error("RESEND_API_KEY / EMAIL_FROM não configurados");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [para], subject: assunto, html, reply_to: responderPara || undefined }),
  });
  if (!r.ok) throw new Error(`Resend respondeu ${r.status}: ${await r.text()}`);
  return r.json();
}

export const emailPolyana = () => env("POLYANA_EMAIL");
