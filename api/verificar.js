// Chamado pela página /obrigado.html: confere no Mercado Pago, com o token da Polyana, se o pagamento foi
// aprovado de verdade. Só então devolve os links do serviço (grupo, Meet, Drive).
import { produtos } from "./_produtos.js";
import { mp } from "./_lib.js";

const REF = /^([a-z-]+)\.(teste\.)?[a-f0-9]{24}$/;
const ID = /^[A-Za-z0-9._-]{3,60}$/;

function responder(res, status, corpo) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(corpo);
}

export default async function handler(req, res) {
  const q = req.query || {};
  const ref = String(q.ref || "");
  const idPagamento = String(q.payment_id || "");
  const m = ref.match(REF);
  if (!m || !ID.test(idPagamento)) return responder(res, 400, { ok: false, estado: "invalido" });

  const produto = produtos.find((p) => p.chave === m[1] && p.preco);
  if (!produto) return responder(res, 400, { ok: false, estado: "invalido" });

  try {
    const pay = await mp(`/v1/payments/${encodeURIComponent(idPagamento)}`);

    // O pagamento precisa ser o da referência que o nosso servidor criou (impede usar o de outra pessoa).
    if (String(pay.external_reference || "") !== ref) return responder(res, 200, { ok: false, estado: "invalido" });

    if (pay.status === "approved") {
      const minimo = m[2] ? 1 : produto.preco; // pagamento de teste vale R$ 1
      if (Number(pay.transaction_amount) < minimo) return responder(res, 200, { ok: false, estado: "invalido" });
      return responder(res, 200, {
        ok: true,
        nome: produto.nome,
        horario: produto.horario,
        links: produto.links.map((l) => ({ label: l.label, url: l.url })),
      });
    }
    if (pay.status === "pending" || pay.status === "in_process" || pay.status === "authorized") {
      return responder(res, 200, { ok: false, estado: "pendente" });
    }
    return responder(res, 200, { ok: false, estado: "recusado" });
  } catch (e) {
    if (/respondeu 404/.test(e.message)) return responder(res, 200, { ok: false, estado: "pendente" });
    console.error("verificar erro", e.message);
    return responder(res, 500, { ok: false, estado: "erro" });
  }
}
