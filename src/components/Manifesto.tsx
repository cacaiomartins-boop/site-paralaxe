import { useState } from "react";

function Observer() {
  const [v, setV] = useState(0); // -1 (teoria) a 1 (clínica)

  const caption =
    v < -0.25
      ? "Da teoria, o conceito se vê de longe: inteiro, ordenado, à distância."
      : v > 0.25
        ? "Da clínica, a cena de perto: com tudo o que escapa ao conceito."
        : "No meio do caminho, a posição de quem escuta.";

  return (
    <div className="reveal rounded-[2rem] bg-tinta p-5 text-papel sm:p-8">
      <div className="relative h-[220px] overflow-hidden rounded-[1.4rem] bg-noite sm:h-[280px]">
        <svg viewBox="0 0 600 280" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* fundo: arcos (move pouco) */}
          <g style={{ transform: `translateX(${v * -10}px)` }} stroke="rgba(244,236,224,.22)" strokeWidth="1.4" fill="none">
            <path d="M40 280V150a60 60 0 0 1 120 0v130" />
            <path d="M200 280V120a60 60 0 0 1 120 0v160" />
            <path d="M360 280V150a60 60 0 0 1 120 0v130" />
            <path d="M500 280V130a60 60 0 0 1 100 0v150" />
          </g>
          {/* meio: colunas */}
          <g style={{ transform: `translateX(${v * -34}px)` }} fill="#7e2713">
            <rect x="120" y="120" width="10" height="160" opacity=".8" />
            <rect x="300" y="90" width="10" height="190" opacity=".8" />
            <rect x="470" y="130" width="10" height="150" opacity=".8" />
          </g>
          {/* frente: sol (move muito) */}
          <g style={{ transform: `translateX(${v * -86}px)` }}>
            <circle cx="300" cy="150" r="46" fill="#f0b429" />
            <circle cx="300" cy="150" r="62" fill="none" stroke="#f0b429" strokeOpacity=".4" />
          </g>
        </svg>
        <span className="kicker absolute left-4 top-4 text-papel/50">Observador</span>
      </div>

      <div className="mt-6">
        <label htmlFor="observer" className="sr-only">
          Mude de lugar: da teoria à clínica
        </label>
        <input
          id="observer"
          type="range"
          min={-100}
          max={100}
          value={v * 100}
          onChange={(e) => setV(Number(e.target.value) / 100)}
          className="observer text-papel"
        />
        <div className="mt-3 flex justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-papel/60">
          <span>Teoria</span>
          <span>Clínica</span>
        </div>
        <p className="mt-5 min-h-[3.2rem] font-display text-xl italic leading-snug text-sol sm:text-2xl" aria-live="polite">
          {caption}
        </p>
      </div>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section id="nome" className="relative bg-papel py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <p className="kicker reveal mb-6 text-ferrugem">01 · O nome</p>
          <div className="reveal font-mono text-sm leading-relaxed text-tinta/60" style={{ "--d": "80ms" } as React.CSSProperties}>
            <span className="text-tinta">pa·ra·la·xe</span> <i>s.f.</i>
            <br />
            deslocamento aparente de um objeto, causado pela mudança de posição de quem o observa.
          </div>
          <h2
            className="reveal mt-8 text-[clamp(2.3rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.02em]"
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Mudar de lugar muda o que <span className="italic text-ferrugem">se escuta.</span>
          </h2>
          <div
            className="reveal mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-tinta/80"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <p>
              Quem estuda psicanálise conhece o peso da teoria. Mas a clínica não se aprende só
              lendo: ela se aprende escutando, errando junto, perguntando ao colega, voltando ao
              texto com outra pergunta.
            </p>
            <p>
              O Paralaxe nasceu desse vai e vem. De um lado, o grupo de estudos, que coloca a
              teoria para conversar com a prática. Do outro, a supervisão em grupo, onde casos
              clínicos são pensados entre pares. Cada encontro é um convite para trocar de
              posição e ver a mesma coisa de outro ângulo.
            </p>
          </div>
        </div>

        <Observer />
      </div>
    </section>
  );
}
