// Link que o Caio manda UMA vez para a Polyana: ela entra na conta do Mercado Pago dela e clica em "Autorizar".
// Só funciona com a chave secreta (CONECTAR_CHAVE), para ninguém conectar outra conta no lugar da dela.
import crypto from "node:crypto";
import { salvar, siteUrl, redirecionar, html, esc } from "./_lib.js";

const env = (k) => (process.env[k] || "").trim();

export default async function handler(req, res) {
  const q = req.query || {};
  const chave = env("CONECTAR_CHAVE");
  const valida =
    chave && typeof q.chave === "string" && q.chave.length === chave.length && crypto.timingSafeEqual(Buffer.from(q.chave), Buffer.from(chave));
  if (!valida) return html(res, 403, "<p>Link inválido.</p>");
  if (!env("MP_CLIENT_ID") || !env("MP_CLIENT_SECRET")) {
    return html(res, 500, "<p>Falta configurar MP_CLIENT_ID e MP_CLIENT_SECRET na Vercel.</p>");
  }

  try {
    const state = crypto.randomBytes(16).toString("hex");
    await salvar(`mp:state:${state}`, { ok: 1 }, 600); // vale por 10 minutos
    const url =
      "https://auth.mercadopago.com/authorization" +
      `?client_id=${encodeURIComponent(env("MP_CLIENT_ID"))}` +
      "&response_type=code&platform_id=mp" +
      `&state=${state}` +
      `&redirect_uri=${encodeURIComponent(`${siteUrl(req)}/api/conectar-retorno`)}`;
    return redirecionar(res, url);
  } catch (e) {
    console.error("conectar erro", e.message);
    return html(res, 500, `<p>Não foi possível iniciar a autorização: ${esc(e.message)}</p>`);
  }
}
