import { embreve, links } from "../data/clinic";

export default function EmBreve() {
  return (
    <section
      id="embreve"
      className="relative overflow-hidden border-b border-papel/10 bg-noite py-24 text-papel sm:py-32"
    >
      {/* Sol e anéis, em eco com o topo do site */}
      <div
        className="pointer-events-none absolute -right-[14vmin] top-1/2 h-[56vmin] w-[56vmin] -translate-y-1/2"
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-full opacity-90"
          style={{
            background:
              "radial-gradient(circle at 38% 34%, #f7c545 0%, #f0b429 28%, #c9531f 62%, #7e2713 100%)",
            boxShadow: "0 0 120px 20px rgba(201,83,31,0.3)",
          }}
        />
        {[1.14, 1.3].map((s) => (
          <div
            key={s}
            className="absolute inset-0 rounded-full border border-papel/15"
            style={{ transform: `scale(${s})` }}
          />
        ))}
      </div>

      <div className="wrap relative">
        <p className="kicker reveal mb-5 text-sol">{embreve.kicker}</p>
        <h2 className="reveal max-w-3xl text-[clamp(3rem,9vw,7rem)] font-light leading-[0.95] tracking-[-0.03em]">
          {embreve.title}
          <br />
          <span className="italic text-sol">{embreve.highlight}</span>
        </h2>
        <p
          className="reveal mt-7 max-w-lg text-lg leading-relaxed text-papel/80"
          style={{ "--d": "100ms" } as React.CSSProperties}
        >
          {embreve.text}
        </p>
        <div className="reveal mt-8 flex flex-wrap gap-3" style={{ "--d": "180ms" } as React.CSSProperties}>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sol">
            Acompanhar no Instagram
          </a>
          <a href="#inscricao" className="btn btn-line text-papel">
            Entrar nos grupos
          </a>
        </div>
      </div>
    </section>
  );
}
