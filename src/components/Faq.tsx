import { faq } from "../data/clinic";

export default function Faq() {
  return (
    <section id="faq" className="bg-papel py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="kicker reveal mb-6 text-ferrugem">08 · Dúvidas</p>
          <h2 className="reveal text-[clamp(2.2rem,4.6vw,3.6rem)] font-light leading-[1.04] tracking-[-0.02em]">
            Antes de <span className="italic text-ferrugem">entrar</span>
          </h2>
        </div>
        <div className="divide-y divide-tinta/15 border-y border-tinta/15">
          {faq.map((f) => (
            <details key={f.q} className="reveal group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 font-display text-xl font-medium leading-snug sm:text-2xl">
                {f.q}
                <span className="plus shrink-0 text-3xl font-light text-ferrugem transition-transform">+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-lg leading-relaxed text-tinta/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
