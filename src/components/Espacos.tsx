import { spaces } from "../data/clinic";

type Space = typeof spaces.estudos;

function Card({ s, tone, delay }: { s: Space; tone: "sol" | "ceu"; delay: string }) {
  const bg = tone === "sol" ? "bg-sol" : "bg-ceu";
  return (
    <article
      id={s.id}
      className={`reveal flex flex-col rounded-[2rem] ${bg} p-6 text-tinta`}
      style={{ "--d": delay } as React.CSSProperties}
    >
      <p className="kicker text-tinta/60">{s.kicker}</p>
      <h3 className="mt-2 text-[clamp(1.8rem,min(2.8vw,4.6vh),2.6rem)] font-medium leading-[1.04] tracking-[-0.02em]">
        {s.name}
      </h3>
      <p className="mt-1 font-display text-lg italic text-tinta/70">{s.subtitle}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-tinta/85">{s.text}</p>

      <dl className="mt-4 divide-y divide-tinta/15 border-y border-tinta/15">
        {s.facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[5rem_1fr] gap-3 py-2 sm:grid-cols-[6rem_1fr]">
            <dt className="kicker pt-0.5 text-tinta/55">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <a href={s.form} target="_blank" rel="noopener noreferrer" className="btn btn-ink !py-3">
          {s.cta}
        </a>
        <a
          href={s.group}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-line !py-3 text-tinta hover:!bg-tinta/10"
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
        <p className="kicker reveal mb-4 text-ferrugem">02 · Os dois espaços</p>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <h2 className="h-sec reveal">
            Um para <span className="italic text-ferrugem">estudar</span>. Outro para{" "}
            <span className="italic text-ferrugem">escutar</span>.
          </h2>
          <p className="reveal max-w-md leading-relaxed text-tinta/75" style={{ "--d": "120ms" } as React.CSSProperties}>
            Você pode participar de um, do outro ou dos dois. A teoria dá palavras para a clínica,
            e a clínica devolve perguntas para a teoria.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card s={spaces.estudos} tone="sol" delay="0ms" />
          <Card s={spaces.escuta} tone="ceu" delay="140ms" />
        </div>
      </div>
    </section>
  );
}
