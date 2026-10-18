import { useState } from "react";
import { spaces, passos } from "../data/clinic";

type Key = "estudos" | "escuta";

export default function Inscricao() {
  const [k, setK] = useState<Key>("escuta");
  const s = spaces[k];
  const tone = k === "estudos" ? "bg-sol" : "bg-ceu";

  return (
    <section id="inscricao" className="screen bg-noite text-papel">
      <div className="wrap">
        <p className="kicker reveal mb-4 text-sol">08 · Inscrição</p>
        <h2 className="h-sec reveal max-w-3xl">
          Escolha o seu lugar <span className="italic text-sol">e entre.</span>
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
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

          <div role="tabpanel" className={`rounded-[2rem] ${tone} p-6 text-tinta sm:p-8`}>
            <p className="kicker text-tinta/60">{s.subtitle}</p>
            <h3 className="mt-1 text-2xl font-medium sm:text-3xl">Como se inscrever</h3>

            <ol className="mt-5 space-y-3.5">
              {passos[k].map((p, i) => (
                <li key={p} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tinta font-mono text-sm text-papel">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 leading-snug">{p}</p>
                </li>
              ))}
            </ol>

            <p className="mt-5 rounded-2xl bg-tinta/10 p-3.5 text-sm leading-relaxed">
              {k === "escuta"
                ? "Valores: ouvinte R$ 50, analista R$ 90. Sem reembolso em caso de desistência."
                : "Os encontros do grupo de estudos são abertos e gratuitos."}{" "}
              O formulário abre em uma nova aba e pode pedir que você entre com a sua conta Google.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={s.form} target="_blank" rel="noopener noreferrer" className="btn btn-ink !py-3">
                Abrir formulário
              </a>
              <a
                href={s.group}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line !py-3 text-tinta hover:!bg-tinta/10"
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
