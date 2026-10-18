import { comoFunciona, modalidades, spaces } from "../data/clinic";

function Col({
  title,
  dot,
  steps,
}: {
  title: string;
  dot: string;
  steps: { t: string; d: string }[];
}) {
  return (
    <div className="reveal">
      <div className="flex items-center gap-3 border-b border-tinta/15 pb-3">
        <span className={`h-3.5 w-3.5 rounded-full ${dot}`} />
        <h3 className="font-display text-2xl font-medium">{title}</h3>
      </div>
      <ol className="mt-4 space-y-4">
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
    </div>
  );
}

export default function ComoFunciona() {
  return (
    <section id="como" className="screen bg-papel">
      <div className="wrap">
        <p className="kicker reveal mb-4 text-ferrugem">03 · Como funciona</p>
        <h2 className="h-sec reveal max-w-3xl">
          O que acontece em <span className="italic text-ferrugem">cada encontro</span>
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Col title={spaces.estudos.name} dot="bg-sol" steps={comoFunciona.estudos} />
          <Col title={spaces.escuta.name} dot="bg-ceu" steps={comoFunciona.escuta} />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-[auto_1fr_1fr] sm:items-stretch">
          <p className="kicker reveal self-center text-tinta/55 sm:max-w-[7rem]">
            Na supervisão, duas modalidades
          </p>
          {modalidades.map((m) => (
            <div key={m.name} className="reveal rounded-2xl bg-ceu/60 p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-display text-xl font-medium">{m.name}</h4>
                <span className="font-mono text-sm">{m.price}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-tinta/80">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
