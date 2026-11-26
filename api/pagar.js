// Botão "Pagar" do site: cria o pagamento no Mercado Pago (preço sempre do servidor) e leva a pessoa até lá.
// Depois de pagar, o Mercado Pago devolve a pessoa para /obrigado.html, que confirma o pagamento (api/verificar.js).
import crypto from "node:crypto";
import { produtos } from "./_produtos.js";
import { mpPost, siteUrl, redirecionar, html, dentroDoLimite } from "./_lib.js";

const env = (k) => (process.env[k] || "").trim();

export default async function handler(req, res) {
  const q = req.query || {};
  const produto = produtos.find((p) => p.chave === q.servico && p.preco);
  if (!produto) return html(res, 400, "<p>Serviço inválido. Volte ao site e escolha de novo.</p>");

  // Pagamento de teste de R$ 1 (só com a chave secreta): referência marcada com "teste".
  const chave = env("CONECTAR_CHAVE");
  const teste = Boolean(q.teste) && Boolean(chave) && q.chave === chave;
  const preco = teste ? 1 : produto.preco;

  try {
    const ip = String(req.headers["x-forwarded-for"] || "sem-ip").split(",")[0].trim();
    if (!(await dentroDoLimite(`pagar:${ip}`, 30, 3600))) {
      return html(res, 429, "<p>Muitas tentativas. Tente de novo em alguns minutos.</p>");
    }

    const ref = `${produto.chave}.${teste ? "teste." : ""}${crypto.randomBytes(12).toString("hex")}`;
    const site = siteUrl(req);
    const pref = await mpPost("/checkout/preferences", {
      items: [{ id: produto.chave, title: produto.titulo, quantity: 1, currency_id: "BRL", unit_price: preco }],
      external_reference: ref,
      back_urls: { success: `${site}/obrigado.html`, pending: `${site}/obrigado.html`, failure: `${site}/#inscricao` },
      auto_return: "approved",
      statement_descriptor: "PARALAXE",
    });
    if (!pref.init_point) throw new Error("Mercado Pago não devolveu o link de pagamento");
    return redirecionar(res, pref.init_point);
  } catch (e) {
    console.error("pagar erro", e.message);
    return html(res, 500, "<p>Não foi possível abrir o pagamento agora. Tente de novo em instantes.</p>");
  }
}
