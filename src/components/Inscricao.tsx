import { useState } from "react";
import { spaces, passos } from "../data/clinic";

type Key = "estudos" | "escuta";

export default function Inscricao() {
  const [k, setK] = useState<Key>("escuta");
  const s = spaces[k];
  const tone = k === "estudos" ? "bg-sol" : "bg-ceu";

  return (
    <section id="inscricao" className="bg-noite py-24 text-papel sm:py-32">
      <div className="wrap">
        <p className="kicker reveal mb-6 text-sol">07 · Inscrição</p>
        <h2 className="reveal max-w-3xl text-[clamp(2.4rem,5.4vw,4.6rem)] font-light leading-[1.02] tracking-[-0.02em]">
          Escolha o seu lugar <span className="italic text-sol">e entre.</span>
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div role="tablist" aria-label="Escolha o espaço" className="flex gap-2 lg:flex-col lg:gap-3">
            {(["estudos", "escuta"] as Key[]).map((key) => {
              const active = k === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setK(key)}
                  className={`flex-1 rounded-2xl border px-5 py-4 text-left transition lg:w-72 ${
                    active
                      ? "border-transparent bg-papel text-tinta"
                      : "border-papel/25 text-papel/80 hover:border-papel/60"
                  }`}
                >
                  <span className="kicker block opacity-60">{spaces[key].kicker}</span>
                  <span className="mt-1 block font-display text-xl leading-tight sm:text-2xl">
                    {spaces[key].name}
                  </span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" className={`rounded-[2rem] ${tone} p-7 text-tinta sm:p-10`}>
            <p className="kicker text-tinta/60">{s.subtitle}</p>
            <h3 className="mt-2 text-3xl font-medium sm:text-4xl">Como se inscrever</h3>

            <ol className="mt-8 space-y-5">
              {passos[k].map((p, i) => (
                <li key={p} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tinta font-mono text-sm text-papel">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-lg leading-snug">{p}</p>
                </li>
              ))}
            </ol>

            <p className="mt-8 rounded-2xl bg-tinta/10 p-4 text-sm leading-relaxed">
              {k === "escuta"
                ? "Valores: ouvinte R$ 50, analista R$ 90. Sem reembolso em caso de desistência."
                : "Os encontros do grupo de estudos são abertos e gratuitos."}{" "}
              O formulário abre em uma nova aba e pode pedir que você entre com a sua conta Google.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={s.form} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                Abrir formulário
              </a>
              <a
                href={s.group}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line text-tinta hover:!bg-tinta/10"
              >
                Entrar no grupo de WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
