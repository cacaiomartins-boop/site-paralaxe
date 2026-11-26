import { useEffect, useRef, useState } from "react";
import { automacaoAtiva, diretrizes, servicosInscricao, type ServicoKey } from "../data/clinic";
import { EVENTO_INSCRICAO } from "../inscricaoBus";

const FORMACOES = [
  { v: "estudante", t: "Estudante de psicologia" },
  { v: "psicologo", t: "Psicólogo(a)" },
  { v: "psicanalista", t: "Psicanalista" },
  { v: "outra-area", t: "Profissional de outra área" },
  { v: "outro", t: "Outro" },
];

const ORIGENS = [
  { v: "", t: "Prefiro não dizer" },
  { v: "instagram", t: "Instagram" },
  { v: "indicacao", t: "Indicação" },
  { v: "outro", t: "Outro" },
];

const campo =
  "mt-1.5 w-full rounded-xl border border-tinta/25 bg-white px-4 py-3 text-base text-tinta outline-none transition focus:border-ferrugem focus:ring-2 focus:ring-ferrugem/20";
const rotulo = "block text-sm font-semibold text-tinta";

export default function InscricaoModal() {
  const [aberto, setAberto] = useState(false);
  const [servico, setServico] = useState<ServicoKey>("estudos");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [formacao, setFormacao] = useState("");
  const [origem, setOrigem] = useState("");
  const [aceite, setAceite] = useState(false);
  const [robo, setRobo] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const primeiro = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!automacaoAtiva) return;
    const abrir = (ev: Event) => {
      setServico((ev as CustomEvent<ServicoKey>).detail);
      setErro("");
      setAberto(true);
    };
    window.addEventListener(EVENTO_INSCRICAO, abrir);
    return () => window.removeEventListener(EVENTO_INSCRICAO, abrir);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    const t = window.setTimeout(() => primeiro.current?.focus(), 50);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", esc);
      window.clearTimeout(t);
    };
  }, [aberto]);

  if (!automacaoAtiva || !aberto) return null;

  const atual = servicosInscricao.find((s) => s.key === servico)!;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (email.trim().toLowerCase() !== email2.trim().toLowerCase()) {
      setErro("Os dois e-mails não são iguais. Confira: é nesse e-mail que o convite chega.");
      return;
    }
    if (!formacao) {
      setErro("Conte um pouco sobre a sua formação.");
      return;
    }
    if (!aceite) {
      setErro("É preciso concordar com as diretrizes para continuar.");
      return;
    }
    setEnviando(true);
    try {
      const r = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servico, nome, email, whatsapp, formacao, origem, aceite, site: robo }),
      });
      const j = (await r.json().catch(() => ({}))) as { url?: string; erro?: string };
      if (!r.ok || !j.url) throw new Error(j.erro || "Não foi possível iniciar o pagamento agora. Tente de novo.");
      window.location.href = j.url;
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível iniciar o pagamento agora.");
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-noite/85 px-3 py-6 backdrop-blur-sm sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inscricao-titulo"
      onMouseDown={(e) => e.target === e.currentTarget && setAberto(false)}
    >
      <form onSubmit={enviar} className="mx-auto w-full max-w-xl rounded-[2rem] bg-papel p-6 text-tinta sm:p-8" noValidate>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker text-ferrugem">Inscrição</p>
            <h2 id="inscricao-titulo" className="mt-1 font-display text-3xl font-light leading-tight">
              Quero <span className="italic text-ferrugem">participar</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tinta/25 text-xl leading-none transition hover:bg-tinta/10"
          >
            ×
          </button>
        </div>

        <fieldset className="mt-6">
          <legend className={rotulo}>O que você quer fazer?</legend>
          <div className="mt-2 grid gap-2">
            {servicosInscricao.map((s) => (
              <label
                key={s.key}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                  servico === s.key ? "border-tinta bg-tinta text-papel" : "border-tinta/25 hover:border-tinta/60"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="servico"
                    value={s.key}
                    checked={servico === s.key}
                    onChange={() => setServico(s.key)}
                    className="h-4 w-4 accent-[#F0B429]"
                  />
                  <span>
                    <span className="block font-semibold leading-tight">{s.nome}</span>
                    <span className={`block text-sm ${servico === s.key ? "text-papel/70" : "text-tinta/60"}`}>{s.detalhe}</span>
                  </span>
                </span>
                <span className="whitespace-nowrap font-mono text-sm">R$ {s.preco}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label className={rotulo} htmlFor="insc-nome">
            Nome completo
          </label>
          <input
            id="insc-nome"
            ref={primeiro}
            className={campo}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            required
            minLength={3}
            maxLength={120}
          />
        </div>

        <div className="mt-5 rounded-2xl bg-tinta p-4 text-papel">
          <p className="flex items-start gap-3 text-sm font-semibold leading-snug">
            <span aria-hidden="true" className="text-lg leading-none text-sol">
              ✉
            </span>
            <span>
              Atenção ao e-mail! O convite do grupo e o link do encontro chegam <u>neste e-mail</u>, depois do pagamento. Use um
              que você confere.
            </span>
          </p>
          <label className="mt-3 block text-sm font-semibold" htmlFor="insc-email">
            E-mail
          </label>
          <input
            id="insc-email"
            type="email"
            className={`${campo} !border-papel/30`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            maxLength={200}
          />
          <label className="mt-3 block text-sm font-semibold" htmlFor="insc-email2">
            Confirme o e-mail
          </label>
          <input
            id="insc-email2"
            type="email"
            className={`${campo} !border-papel/30`}
            value={email2}
            onChange={(e) => setEmail2(e.target.value)}
            autoComplete="off"
            required
            maxLength={200}
          />
        </div>

        <div className="mt-5">
          <label className={rotulo} htmlFor="insc-zap">
            WhatsApp (com DDD)
          </label>
          <input
            id="insc-zap"
            type="tel"
            inputMode="tel"
            placeholder="(31) 90000-0000"
            className={campo}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            autoComplete="tel"
            required
            maxLength={25}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={rotulo} htmlFor="insc-formacao">
              Sua formação
            </label>
            <select id="insc-formacao" className={campo} value={formacao} onChange={(e) => setFormacao(e.target.value)} required>
              <option value="">Escolha…</option>
              {FORMACOES.map((f) => (
                <option key={f.v} value={f.v}>
                  {f.t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={rotulo} htmlFor="insc-origem">
              Como conheceu o Paralaxe? <span className="font-normal text-tinta/55">(opcional)</span>
            </label>
            <select id="insc-origem" className={campo} value={origem} onChange={(e) => setOrigem(e.target.value)}>
              {ORIGENS.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo escondido: só robô preenche */}
        <div className="sr-only" aria-hidden="true">
          <label>
            Não preencha
            <input tabIndex={-1} autoComplete="off" value={robo} onChange={(e) => setRobo(e.target.value)} />
          </label>
        </div>

        <div className="mt-6 rounded-2xl bg-papel2 p-4">
          <p className="kicker text-tinta/60">Diretrizes</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-tinta/85">
            {diretrizes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-semibold">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#A63A1F]" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
            <span>Li e estou de acordo com as diretrizes.</span>
          </label>
        </div>

        {erro && (
          <p role="alert" className="mt-4 rounded-xl bg-ferrugem/10 px-4 py-3 text-sm font-semibold text-ferrugem">
            {erro}
          </p>
        )}

        <button type="submit" disabled={enviando} className="btn btn-ink mt-6 w-full disabled:opacity-60">
          {enviando ? "Abrindo o pagamento…" : `Ir para o pagamento · R$ ${atual.preco}`}
        </button>
        <p className="mt-3 text-center text-xs text-tinta/60">
          Você será levada(o) ao Mercado Pago, para pagar com Pix, cartão ou boleto. Seus dados são usados só para a inscrição.
        </p>
      </form>
    </div>
  );
}
