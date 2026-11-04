// Recebe os avisos do Mercado Pago (pagamento aprovado, assinatura criada ou cancelada)
// e manda o e-mail certo para a pessoa e para a Polyana.
import {
  assinaturaValida,
  identificarProduto,
  primeiraVez,
  liberar,
  enviarEmail,
  emailPolyana,
  mp,
  norm,
} from "./_lib.js";
import { emailAluno, emailPolyanaNovo, emailPolyanaFim, emailPolyanaDesconhecido } from "./_emails.js";

const nomeCompleto = (p) => [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim();

async function avisarPolyana(msg) {
  const para = emailPolyana();
  if (!para) return console.warn("POLYANA_EMAIL não configurado: aviso à Polyana ignorado");
  try {
    await enviarEmail({ para, ...msg });
  } catch (e) {
    console.error("Falha ao avisar a Polyana:", e.message); // não derruba o envio ao aluno
  }
}

/** Libera o acesso: e-mail para a pessoa + cópia para a Polyana, uma única vez. */
async function liberarAcesso(d) {
  const produto = identificarProduto(d);

  if (!produto || !d.email) {
    const chave = `desconhecido:${d.idUnico}`;
    if (!(await primeiraVez(chave))) return { duplicado: true };
    await avisarPolyana(emailPolyanaDesconhecido(d));
    return { naoIdentificado: true };
  }

  // Assinatura: um e-mail de boas-vindas por pessoa e serviço (as cobranças seguintes não repetem).
  const chave = produto.tipo === "assinatura" ? `ok:${produto.chave}:${norm(d.email)}` : `ok:${d.idUnico}`;
  if (!(await primeiraVez(chave))) return { duplicado: true };

  try {
    const msg = emailAluno({ produto, nome: d.nome, valor: d.valor, email: d.email });
    await enviarEmail({ para: d.email, assunto: msg.assunto, html: msg.html, responderPara: emailPolyana() });
  } catch (e) {
    await liberar(chave); // o Mercado Pago tenta de novo
    throw e;
  }
  await avisarPolyana(emailPolyanaNovo({ produto, ...d }));
  return { enviado: produto.chave };
}

async function tratar(tipo, id) {
  if (tipo === "payment") {
    const pay = await mp(`/v1/payments/${id}`);
    if (pay.status !== "approved") return { ignorado: `pagamento ${pay.status}` };
    return liberarAcesso({
      idUnico: `pay:${pay.id}`,
      email: pay.payer?.email,
      nome: nomeCompleto(pay.payer),
      valor: pay.transaction_amount,
      referencia: pay.external_reference,
      planId: pay.metadata?.preapproval_plan_id,
      textos: [pay.description, ...(pay.additional_info?.items || []).map((i) => i.title)],
    });
  }

  if (tipo === "subscription_preapproval" || tipo === "preapproval") {
    const sub = await mp(`/preapproval/${id}`);
    const d = {
      idUnico: `sub:${sub.id}`,
      email: sub.payer_email,
      nome: "",
      valor: sub.auto_recurring?.transaction_amount,
      referencia: sub.external_reference,
      planId: sub.preapproval_plan_id,
      textos: [sub.reason],
    };
    if (sub.status === "authorized") return liberarAcesso(d);
    if (sub.status === "cancelled" || sub.status === "paused") {
      if (!(await primeiraVez(`fim:${sub.id}:${sub.status}`))) return { duplicado: true };
      await avisarPolyana(emailPolyanaFim({ produto: identificarProduto(d), nome: d.nome, email: d.email, status: sub.status }));
      return { aviso: sub.status };
    }
    return { ignorado: `assinatura ${sub.status}` };
  }

  return { ignorado: `tipo ${tipo}` };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "use POST" });
  }

  let corpo = req.body;
  if (typeof corpo === "string") {
    try {
      corpo = JSON.parse(corpo);
    } catch {
      corpo = {};
    }
  }
  const q = req.query || {};
  const tipo = corpo?.type || q.type || q.topic;
  const id = corpo?.data?.id ?? q["data.id"] ?? q.id;

  if (!assinaturaValida(req, q["data.id"] ?? corpo?.data?.id)) {
    return res.status(401).json({ erro: "assinatura inválida" });
  }
  if (!tipo || !id) return res.status(200).json({ ignorado: "sem tipo ou id" });

  try {
    const r = await tratar(tipo, id);
    console.log("webhook", tipo, id, JSON.stringify(r));
    return res.status(200).json(r);
  } catch (e) {
    // A "Simular notificação" do painel usa um ID que não existe: não é erro de verdade.
    if (/respondeu 404/.test(e.message)) return res.status(200).json({ ignorado: "não encontrado" });
    console.error("webhook erro", tipo, id, e.message);
    return res.status(500).json({ erro: "falha ao processar" }); // o Mercado Pago tenta de novo
  }
}
