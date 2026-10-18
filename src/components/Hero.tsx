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
      <div ref={pointerRef} className="relative flex min-h-[100svh] flex-col">
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

        {/* Espaço do cabeçalho */}
        <div className="h-16 shrink-0" />

        {/* Faixa própria da palavra: ela ocupa só o espaço livre acima do título */}
        <div className="pointer-events-none relative z-0 flex min-h-[7.5rem] flex-1 select-none items-center justify-center">
          <div
            data-speed="-0.2"
            className="relative pb-5 will-change-transform"
            aria-hidden="true"
          >
            <span
              className="outline-word-sol absolute inset-0 block whitespace-nowrap font-display text-[min(25vw,26vh)] font-light italic leading-[0.95] tracking-[-0.04em] transition-transform duration-300 ease-out lg:text-[min(17vw,28vh)]"
              style={{ transform: `translate(${dx}px, ${dy}px)` }}
            >
              paralaxe
            </span>
            <span
              className="outline-word relative block whitespace-nowrap font-display text-[min(25vw,26vh)] font-light italic leading-[0.95] tracking-[-0.04em] transition-transform duration-300 ease-out lg:text-[min(17vw,28vh)]"
              style={{ transform: `translate(${-dx}px, ${-dy}px)` }}
            >
              paralaxe
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="wrap relative z-10 pb-8 sm:pb-12">
          <h1 className="max-w-4xl text-[clamp(2.7rem,min(7.4vw,10.5vh),6.6rem)] font-light leading-[0.94] tracking-[-0.03em]">
            Da teoria
            <br />
            <span className="italic text-sol">à escuta.</span>
          </h1>
          <p className="kicker mt-4 text-papel/80 sm:text-sol">Estudos · Supervisão · Psicanálise</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-papel/80 sm:text-lg">
            Estudos teóricos e supervisão clínica em grupo para quem estuda
            psicanálise e quer atravessar o texto até a clínica.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#inscricao" className="btn btn-sol">
              Quero participar
            </a>
            <a href="#espacos" className="btn btn-line text-papel">
              Conhecer os dois espaços
            </a>
          </div>

          <dl className="mt-8 hidden max-w-3xl grid-cols-3 gap-5 border-t border-papel/15 pt-5 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-papel/60 sm:grid [@media(max-height:740px)]:hidden">
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
          className="absolute bottom-6 right-5 z-10 hidden font-mono text-[0.7rem] uppercase tracking-[0.3em] text-papel/50 transition hover:text-sol sm:right-8 lg:block"
        >
          @paralaxeslab
        </a>
      </div>
    </section>
  );
}
