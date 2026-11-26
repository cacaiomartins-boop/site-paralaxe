// Recebe o formulário de inscrição do site, guarda os dados e devolve o link de pagamento
// do Mercado Pago já ligado a essa pessoa (external_reference).
import crypto from "node:crypto";
import { produtos } from "./_produtos.js";
import { guardarInscricao, mpPost, siteUrl, dentroDoLimite, esc } from "./_lib.js";

const FORMACOES = ["estudante", "psicologo", "psicanalista", "outra-area", "outro"];
const ORIGENS = ["instagram", "indicacao", "outro", ""];

class ErroDeValidacao extends Error {}

function normalizarWhatsapp(bruto) {
  let d = String(bruto || "").replace(/\D/g, "");
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) return d;
  if (d.length === 10 || d.length === 11) return `55${d}`;
  throw new ErroDeValidacao("Confira o WhatsApp: informe o DDD e o número.");
}

export function validar(corpo) {
  const produto = produtos.find((p) => p.chave === corpo.servico && p.preco);
  if (!produto) throw new ErroDeValidacao("Escolha o serviço.");

  const nome = String(corpo.nome || "").trim().replace(/\s+/g, " ");
  if (nome.length < 3 || nome.length > 120) throw new ErroDeValidacao("Informe o seu nome completo.");

  const email = String(corpo.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    throw new ErroDeValidacao("Confira o e-mail: é nele que o convite chega.");
  }

  const formacao = String(corpo.formacao || "");
  if (!FORMACOES.includes(formacao)) throw new ErroDeValidacao("Conte um pouco sobre a sua formação.");

  const origem = String(corpo.origem || "");
  if (!ORIGENS.includes(origem)) throw new ErroDeValidacao("Escolha uma opção em “Como conheceu o Paralaxe?”.");

  if (corpo.aceite !== true) throw new ErroDeValidacao("É preciso concordar com as diretrizes para continuar.");

  return { produto, nome, email, whatsapp: normalizarWhatsapp(corpo.whatsapp), formacao, origem };
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
  corpo = corpo || {};

  // Campo escondido: só robô preenche. Responde como se tivesse dado certo.
  if (corpo.site) return res.status(200).json({ url: "/" });

  const ip = String(req.headers["x-forwarded-for"] || "sem-ip").split(",")[0].trim();
  try {
    if (!(await dentroDoLimite(`insc:${ip}`, 12, 3600))) {
      return res.status(429).json({ erro: "Muitas tentativas. Tente de novo em alguns minutos." });
    }

    const d = validar(corpo);
    const id = crypto.randomBytes(16).toString("hex");

    await guardarInscricao(id, {
      id,
      servico: d.produto.chave,
      nome: d.nome,
      email: d.email,
      whatsapp: d.whatsapp,
      formacao: d.formacao,
      origem: d.origem,
      criadoEm: new Date().toISOString(),
    });

    const site = siteUrl(req);
    const pref = await mpPost("/checkout/preferences", {
      items: [
        {
          id: d.produto.chave,
          title: d.produto.titulo,
          quantity: 1,
          currency_id: "BRL",
          unit_price: d.produto.preco, // sempre o preço do servidor, nunca o do navegador
        },
      ],
      payer: { name: d.nome, email: d.email },
      external_reference: id,
      back_urls: { success: `${site}/obrigado.html`, pending: `${site}/obrigado.html`, failure: `${site}/` },
      auto_return: "approved",
      notification_url: `${site}/api/mp-webhook`,
      statement_descriptor: "PARALAXE",
    });

    if (!pref.init_point) throw new Error("Mercado Pago não devolveu o link de pagamento");
    return res.status(200).json({ url: pref.init_point });
  } catch (e) {
    if (e instanceof ErroDeValidacao) return res.status(400).json({ erro: e.message });
    console.error("inscricao erro", esc(e.message));
    return res.status(500).json({ erro: "Não foi possível iniciar o pagamento agora. Tente de novo em instantes." });
  }
}
