import { spaces, modalidades, comoFunciona } from "../data/clinic";

type Space = typeof spaces.estudos;

function Card({
  s,
  tone,
  steps,
  children,
  delay,
}: {
  s: Space;
  tone: "sol" | "ceu";
  steps: { t: string; d: string }[];
  children?: React.ReactNode;
  delay: string;
}) {
  const bg = tone === "sol" ? "bg-sol" : "bg-ceu";
  return (
    <article
      id={s.id}
      className={`reveal flex flex-col rounded-[2rem] ${bg} p-7 text-tinta sm:p-10`}
      style={{ "--d": delay } as React.CSSProperties}
    >
      <p className="kicker text-tinta/60">{s.kicker}</p>
      <h3 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.02] tracking-[-0.02em]">
        {s.name}
      </h3>
      <p className="mt-2 font-display text-xl italic text-tinta/70">{s.subtitle}</p>
      <p className="mt-6 text-[1.05rem] leading-relaxed text-tinta/85">{s.text}</p>

      <dl className="mt-8 divide-y divide-tinta/15 border-y border-tinta/15">
        {s.facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[7rem_1fr]">
            <dt className="kicker pt-0.5 text-tinta/55">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      {children}

      <ol className="mt-8 space-y-4">
        {steps.map((st, i) => (
          <li key={st.t} className="flex gap-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-tinta/40 font-mono text-xs">
              {i + 1}
            </span>
            <p className="leading-snug">
              <strong className="font-semibold">{st.t}.</strong>{" "}
              <span className="text-tinta/75">{st.d}</span>
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-wrap gap-3 pt-10">
        <a href={s.form} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
          {s.cta}
        </a>
        <a
          href={s.group}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-line text-tinta hover:!bg-tinta/10"
        >
          Grupo no WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function Espacos() {
  return (
    <section id="espacos" className="bg-papel2 py-24 sm:py-32">
      <div className="wrap">
        <p className="kicker reveal mb-6 text-ferrugem">02 · Os dois espaços</p>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <h2 className="reveal text-[clamp(2.3rem,5vw,4.2rem)] font-light leading-[1.02] tracking-[-0.02em]">
            Um para <span className="italic text-ferrugem">estudar</span>.
            <br />
            Outro para <span className="italic text-ferrugem">escutar</span>.
          </h2>
          <p className="reveal max-w-md text-lg leading-relaxed text-tinta/75" style={{ "--d": "120ms" } as React.CSSProperties}>
            Você pode participar de um, do outro ou dos dois. Os grupos se complementam: a teoria
            dá palavras para a clínica, e a clínica devolve perguntas para a teoria.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card s={spaces.estudos} tone="sol" steps={comoFunciona.estudos} delay="0ms" />
          <Card s={spaces.escuta} tone="ceu" steps={comoFunciona.escuta} delay="140ms">
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {modalidades.map((m) => (
                <div key={m.name} className="rounded-2xl bg-papel/70 p-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-2xl font-medium">{m.name}</h4>
                    <span className="font-mono text-sm">{m.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-tinta/75">{m.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
