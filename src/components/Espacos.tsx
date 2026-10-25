import { links, propostas, spaces } from "../data/clinic";

type Space = typeof spaces.estudos;

function Card({ s, tone, delay }: { s: Space; tone: "sol" | "ceu"; delay: string }) {
  const bg = tone === "sol" ? "bg-sol" : "bg-ceu";
  return (
    <article
      id={s.id}
      className={`reveal flex flex-col rounded-[2rem] ${bg} p-6 text-tinta lg:p-4`}
      style={{ "--d": delay } as React.CSSProperties}
    >
      <p className="kicker text-tinta/60">{s.kicker}</p>
      <h3 className="mt-1.5 text-[clamp(1.6rem,min(2.6vw,4.2vh),2.4rem)] font-medium leading-[1.04] tracking-[-0.02em]">
        {s.name}
      </h3>
      <p className="mt-1 font-display text-lg italic text-tinta/70 lg:text-base">{s.subtitle}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-tinta/85 lg:mt-2 lg:text-[0.84rem] lg:leading-[1.35]">{s.text}</p>

      <dl className="mt-4 lg:mt-3 divide-y divide-tinta/15 border-y border-tinta/15">
        {s.facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[5rem_1fr] gap-3 py-2 sm:grid-cols-[6rem_1fr] lg:py-1 lg:text-[0.92rem]">
            <dt className="kicker pt-0.5 text-tinta/55">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap gap-3 pt-5 lg:pt-3">
        <a href={s.form} target="_blank" rel="noopener noreferrer" className="btn btn-ink !py-2.5">
          {s.cta}
        </a>
        <a
          href={s.group}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-line !py-2.5 text-tinta hover:!bg-tinta/10"
        >
          Grupo no WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function Espacos() {
  return (
    <section id="espacos" className="screen bg-papel2">
      <div className="wrap">
        <p className="kicker reveal mb-3 text-ferrugem">02 · Os dois espaços</p>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <h2 className="h-sec reveal lg:!text-[clamp(2rem,min(3.4vw,5.2vh),3rem)]">
            Um para <span className="italic text-ferrugem">estudar</span>. Outro para{" "}
            <span className="italic text-ferrugem">escutar</span>.
          </h2>
          <p className="reveal max-w-md leading-relaxed text-tinta/75" style={{ "--d": "120ms" } as React.CSSProperties}>
            Você pode participar de um, do outro ou dos dois. A teoria dá palavras para a clínica,
            e a clínica devolve perguntas para a teoria.
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:mt-3 lg:grid-cols-2 lg:gap-4">
          <Card s={spaces.estudos} tone="sol" delay="0ms" />
          <Card s={spaces.escuta} tone="ceu" delay="140ms" />
        </div>

        <div className="reveal mt-6 lg:mt-3">
          <p className="kicker mb-2 text-ferrugem">Também no Paralaxe</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {propostas.map((p) => (
              <article
                key={p.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[1.2rem] border border-tinta/15 px-5 py-3"
              >
                <div>
                  <h3 className="text-lg font-medium leading-tight">{p.name}</h3>
                  <p className="text-[0.88rem] leading-snug text-tinta/75">{p.text}</p>
                </div>
                <a
                  href={links.whatsappPolyana}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ferrugem underline-offset-4 hover:underline"
                >
                  Saber mais
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
