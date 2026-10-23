import { faq } from "../data/clinic";

export default function Faq() {
  return (
    <section id="faq" className="screen bg-papel">
      <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="kicker reveal mb-4 text-ferrugem">09 · Dúvidas</p>
          <h2 className="h-sec reveal">
            Antes de <span className="italic text-ferrugem">entrar</span>
          </h2>
        </div>
        <div className="divide-y divide-tinta/15 border-y border-tinta/15">
          {faq.map((f) => (
            <details key={f.q} className="reveal group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-3.5 font-display text-lg font-medium leading-snug sm:text-xl">
                {f.q}
                <span className="plus shrink-0 text-2xl font-light text-ferrugem transition-transform">+</span>
              </summary>
              <p className="max-w-2xl pb-4 leading-relaxed text-tinta/75">{f.a}</p>
              {"link" in f && f.link && (
                <a
                  href={f.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink mb-5 !py-3"
                >
                  {f.link.label}
                </a>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
