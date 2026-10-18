import { combinados } from "../data/clinic";

export default function Combinados() {
  return (
    <section id="combinados" className="screen overflow-hidden bg-ferrugem text-papel">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-papel/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-[240px] w-[240px] rounded-full border border-papel/20"
        aria-hidden="true"
      />
      <div className="wrap relative">
        <p className="kicker reveal mb-4 text-sol">07 · Combinados</p>
        <h2 className="h-sec reveal max-w-2xl">
          Um espaço de escuta pede <span className="italic text-sol">cuidado</span>
        </h2>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-papel/20 sm:grid-cols-2 lg:grid-cols-4">
          {combinados.map((c, i) => (
            <li
              key={c.t}
              className="reveal bg-ferrugem p-7"
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="font-mono text-xs text-sol">0{i + 1}</span>
              <h3 className="mt-4 text-2xl font-medium">{c.t}</h3>
              <p className="mt-2 leading-relaxed text-papel/80">{c.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
