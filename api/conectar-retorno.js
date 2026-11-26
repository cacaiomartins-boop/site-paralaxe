// Para onde o Mercado Pago volta depois que a Polyana clica em "Autorizar".
// Troca o código por um token e guarda no Redis. A Polyana nunca vê o token.
import { ler, liberar, salvar, siteUrl, html, esc } from "./_lib.js";

const env = (k) => (process.env[k] || "").trim();

const pagina = (titulo, texto) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(titulo)} | Paralaxe</title></head>
<body style="font-family:system-ui,sans-serif;background:#17110e;color:#f4ece0;min-height:100vh;display:grid;place-items:center;margin:0;padding:24px;text-align:center">
<main style="max-width:30rem"><h1 style="font-weight:400;font-size:2rem;margin:0 0 12px">${esc(titulo)}</h1><p style="line-height:1.6;color:rgba(244,236,224,.85)">${esc(texto)}</p></main></body></html>`;

export default async function handler(req, res) {
  const q = req.query || {};
  try {
    if (q.error) return html(res, 400, pagina("Autorização cancelada", "Sem problemas. Se quiser conectar depois, abra o link de novo."));

    const state = String(q.state || "");
    const code = String(q.code || "");
    if (!/^[a-f0-9]{32}$/.test(state) || !code || !(await ler(`mp:state:${state}`))) {
      return html(res, 400, pagina("Link expirado", "Abra o link de autorização de novo e tente outra vez."));
    }
    await liberar(`mp:state:${state}`); // cada autorização só vale uma vez

    const r = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env("MP_CLIENT_ID"),
        client_secret: env("MP_CLIENT_SECRET"),
        code,
        grant_type: "authorization_code",
        redirect_uri: `${siteUrl(req)}/api/conectar-retorno`,
      }),
    });
    if (!r.ok) throw new Error(`Mercado Pago respondeu ${r.status}`);
    const t = await r.json();
    if (!t.access_token) throw new Error("Resposta sem access_token");

    await salvar(
      "mp:oauth",
      {
        access_token: t.access_token,
        refresh_token: t.refresh_token,
        expira_em: Date.now() + (t.expires_in || 180 * 24 * 3600) * 1000,
        user_id: t.user_id,
      },
      400 * 24 * 3600,
    );
    return html(res, 200, pagina("Conta conectada!", "Pronto: o site já consegue confirmar os pagamentos. Você pode fechar esta página."));
  } catch (e) {
    console.error("conectar-retorno erro", e.message);
    return html(res, 500, pagina("Não deu certo", "Algo falhou na autorização. Avise o Caio."));
  }
}
