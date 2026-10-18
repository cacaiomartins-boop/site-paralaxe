import { useScrollParallax, usePointer } from "../hooks";
import { links } from "../data/clinic";

export default function Hero() {
  const parallax = useScrollParallax<HTMLElement>();
  const { ref: pointerRef, p } = usePointer<HTMLDivElement>();

  // Duas cópias da palavra se afastam quando o ponteiro se move: o "duplo" da paralaxe.
  const dx = p.x * 14;
  const dy = p.y * 8;

  return (
    <section
      id="topo"
      ref={parallax}
      className="relative isolate overflow-hidden bg-noite text-papel"
    >
      <div ref={pointerRef} className="relative min-h-[100svh]">
        {/* Camada 1: sol ao fundo (move devagar) */}
        <div
          data-speed="0.12"
          className="pointer-events-none absolute -right-[18vmin] top-[6vh] h-[78vmin] w-[78vmin] will-change-transform"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at 38% 34%, #f7c545 0%, #f0b429 28%, #c9531f 62%, #7e2713 100%)",
              transform: `translate(${-p.x * 10}px, ${-p.y * 10}px)`,
              transition: "transform 0.4s ease-out",
              boxShadow: "0 0 160px 30px rgba(201,83,31,0.35)",
            }}
          />
          {[1.12, 1.26, 1.42].map((s, i) => (
            <div
              key={s}
              className="absolute inset-0 rounded-full border border-papel/15"
              style={{
                transform: `scale(${s}) translate(${p.x * (6 + i * 5)}px, ${p.y * (6 + i * 5)}px)`,
                transition: "transform 0.5s ease-out",
              }}
            />
          ))}
        </div>

        {/* Camada 2: arcos de portal barroco (meio) */}
        <svg
          data-speed="0.22"
          viewBox="0 0 400 520"
          className="pointer-events-none absolute -left-[6vw] bottom-[-8vh] h-[78vh] w-auto text-papel/20 will-change-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M20 520V230C20 120 100 40 200 40s180 80 180 190v290" />
          <path d="M60 520V240C60 145 120 80 200 80s140 65 140 160v280" />
          <path d="M100 520V250c0-70 45-120 100-120s100 50 100 120v270" />
          <path d="M140 520V260c0-45 25-80 60-80s60 35 60 80v260" />
          <path d="M200 40v-24M20 230h360" />
        </svg>

        {/* Camada 3: palavra gigante em dois olhares */}
        <div
          data-speed="0.32"
          className="pointer-events-none absolute inset-x-0 top-[11vh] select-none will-change-transform"
          aria-hidden="true"
        >
          <div className="relative mx-auto w-full max-w-[1500px] overflow-visible text-center">
            <span
              className="outline-word-sol absolute inset-0 block font-display text-[19vw] font-light italic leading-none tracking-[-0.04em] transition-transform duration-300 ease-out"
              style={{ transform: `translate(${dx}px, ${dy}px)` }}
            >
              paralaxe
            </span>
            <span
              className="outline-word relative block font-display text-[19vw] font-light italic leading-none tracking-[-0.04em] transition-transform duration-300 ease-out"
              style={{ transform: `translate(${-dx}px, ${-dy}px)` }}
            >
              paralaxe
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-32 sm:pb-20">
          <p className="kicker mb-6 text-sol">Estudos · Supervisão · Psicanálise</p>
          <h1 className="max-w-4xl text-[clamp(3.2rem,9.5vw,8.2rem)] font-light leading-[0.92] tracking-[-0.03em]">
            Da teoria
            <br />
            <span className="italic text-sol">à escuta.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-papel/80 sm:text-xl">
            Estudos teóricos e supervisão clínica em grupo para quem estuda
            psicanálise e quer atravessar o texto até a clínica.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#inscricao" className="btn btn-sol">
              Quero participar
            </a>
            <a href="#espacos" className="btn btn-line text-papel">
              Conhecer os dois espaços
            </a>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-1 gap-5 border-t border-papel/15 pt-6 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-papel/60 sm:grid-cols-3">
            <div>
              <dt className="text-papel/40">Formato</dt>
              <dd className="mt-1 text-papel">On-line, Google Meet</dd>
            </div>
            <div>
              <dt className="text-papel/40">Estudos</dt>
              <dd className="mt-1 text-papel">Terças, 20h30</dd>
            </div>
            <div>
              <dt className="text-papel/40">Supervisão</dt>
              <dd className="mt-1 text-papel">Quartas, 20h</dd>
            </div>
          </dl>
        </div>

        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-5 z-10 hidden font-mono text-[0.7rem] uppercase tracking-[0.3em] text-papel/50 transition hover:text-sol sm:right-8 md:block"
        >
          @paralaxeslab
        </a>
      </div>
    </section>
  );
}
