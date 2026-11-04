// Modelos de e-mail (HTML simples, com estilos inline, que funcionam em qualquer leitor).
import { esc, brl } from "./_lib.js";

const TINTA = "#1C1511";
const PAPEL = "#F4ECE0";
const SOL = "#F0B429";
const FERRUGEM = "#A63A1F";

function moldura(titulo, corpo) {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:${PAPEL};padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:${TINTA};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;">
<tr><td style="background:${TINTA};padding:22px 28px;color:${PAPEL};font-size:13px;letter-spacing:5px;text-transform:uppercase;">Paralaxe <span style="color:${SOL};">&middot;</span></td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:26px;line-height:1.2;">${titulo}</h1>
${corpo}
</td></tr>
<tr><td style="padding:16px 28px 24px;font-size:12px;color:#7a6f66;">Paralaxe &middot; organiza&ccedil;&atilde;o Polyana Corr&ecirc;a &middot; @paralaxeslab</td></tr>
</table></td></tr></table></body></html>`;
}

const botao = (label, url) =>
  `<p style="margin:0 0 10px;"><a href="${esc(url)}" style="display:inline-block;background:${SOL};color:${TINTA};text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;font-size:15px;">${esc(label)}</a></p>`;

const linha = (k, v) =>
  `<tr><td style="padding:8px 0;border-top:1px solid #eadfce;color:#7a6f66;font-size:13px;width:110px;">${k}</td><td style="padding:8px 0;border-top:1px solid #eadfce;font-size:15px;">${v}</td></tr>`;

export function emailAluno({ produto, nome, valor, email }) {
  const primeiro = esc(String(nome || "").trim().split(" ")[0] || "");
  const links = produto.links.length
    ? produto.links.map((l) => botao(l.label, l.url)).join("")
    : `<p style="margin:0 0 12px;">A Polyana vai entrar em contato com as datas e o link do encontro.</p>`;
  const corpo = `
<p style="margin:0 0 14px;font-size:16px;line-height:1.5;">${primeiro ? `Ol&aacute;, ${primeiro}!` : "Ol&aacute;!"} Recebemos o seu pagamento${valor ? ` de <strong>${esc(brl(valor))}</strong>` : ""}. Bem-vinda(o) a <strong>${esc(produto.nome)}</strong>.</p>
<p style="margin:0 0 18px;font-size:15px;color:#4a4039;">${esc(produto.horario)}</p>
${links}
<p style="margin:20px 0 6px;font-size:14px;line-height:1.5;color:#4a4039;"><strong>Combinados:</strong> os encontros n&atilde;o podem ser gravados nem compartilhados, e os links s&atilde;o s&oacute; para quem est&aacute; inscrito. Em caso de desist&ecirc;ncia, n&atilde;o h&aacute; devolu&ccedil;&atilde;o do valor pago.</p>
<p style="margin:14px 0 0;font-size:14px;line-height:1.5;color:#4a4039;">D&uacute;vidas? &Eacute; s&oacute; responder este e-mail.</p>
${email ? `<p style="margin:14px 0 0;font-size:12px;color:#7a6f66;">Enviado para ${esc(email)}, o e-mail informado no pagamento.</p>` : ""}`;
  return {
    assunto: `Pagamento confirmado: ${produto.nome}`,
    html: moldura("Pagamento confirmado", corpo),
  };
}

export function emailPolyanaNovo({ produto, nome, email, valor }) {
  const corpo = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
${linha("Pessoa", esc(nome || "(sem nome)"))}
${linha("E-mail", esc(email))}
${linha("Servi&ccedil;o", `<strong>${esc(produto.nome)}</strong>`)}
${linha("Valor", esc(brl(valor)) || "-")}
</table>
<p style="margin:0;font-size:14px;line-height:1.5;color:#4a4039;">A pessoa j&aacute; recebeu por e-mail o convite do grupo e os links. Antes do pr&oacute;ximo encontro, confira se ela entrou no grupo e, se precisar, adicione.</p>`;
  return {
    assunto: `Novo pagamento: ${nome || email} · ${produto.nome}`,
    html: moldura("Novo pagamento", corpo),
  };
}

export function emailPolyanaFim({ produto, nome, email, status }) {
  const rotulo = status === "paused" ? "pausada" : "cancelada";
  const corpo = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
${linha("Pessoa", esc(nome || "(sem nome)"))}
${linha("E-mail", esc(email || "-"))}
${linha("Servi&ccedil;o", `<strong>${esc(produto ? produto.nome : "n&atilde;o identificado")}</strong>`)}
${linha("Situa&ccedil;&atilde;o", `Assinatura <strong style="color:${FERRUGEM};">${rotulo}</strong>`)}
</table>
<p style="margin:0;font-size:14px;line-height:1.5;color:#4a4039;">Se for o caso, remova a pessoa do grupo de WhatsApp e da pasta do Drive. O sistema n&atilde;o remove ningu&eacute;m sozinho.</p>`;
  return {
    assunto: `Assinatura ${rotulo}: ${nome || email || "?"} · ${produto ? produto.nome : "?"}`,
    html: moldura(`Assinatura ${rotulo}`, corpo),
  };
}

export function emailPolyanaDesconhecido({ nome, email, valor, textos }) {
  const corpo = `
<p style="margin:0 0 14px;font-size:15px;line-height:1.5;">Um pagamento foi aprovado, mas n&atilde;o consegui saber qual servi&ccedil;o ele &eacute;. <strong>Nada foi enviado &agrave; pessoa.</strong> Veja abaixo e envie os links na m&atilde;o.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
${linha("Pessoa", esc(nome || "(sem nome)"))}
${linha("E-mail", esc(email || "-"))}
${linha("Valor", esc(brl(valor)) || "-")}
${linha("T&iacute;tulo no MP", esc((textos || []).filter(Boolean).join(" | ") || "-"))}
</table>
<p style="margin:0;font-size:13px;line-height:1.5;color:#7a6f66;">Dica: o t&iacute;tulo do link no Mercado Pago precisa seguir o padr&atilde;o combinado (por exemplo, "Paralaxe Estudos").</p>`;
  return {
    assunto: `Pagamento sem serviço identificado: ${nome || email || "?"}`,
    html: moldura("Pagamento n&atilde;o identificado", corpo),
  };
}
