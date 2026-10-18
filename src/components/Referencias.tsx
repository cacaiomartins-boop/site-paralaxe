import { referencias, links, site } from "../data/clinic";

export default function Referencias() {
  return (
    <section id="referencias" className="bg-papel py-24 sm:py-32">
      <div className="wrap grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="kicker reveal mb-6 text-ferrugem">05 · Referências</p>
          <h2 className="reveal text-[clamp(2.2rem,4.6vw,3.6rem)] font-light leading-[1.04] tracking-[-0.02em]">
            O que estamos <span className="italic text-ferrugem">lendo</span>
          </h2>
          <p className="reveal mt-5 max-w-lg text-lg leading-relaxed text-tinta/75" style={{ "--d": "100ms" } as React.CSSProperties}>
            Cada etapa dos encontros parte de uma referência como eixo. Os textos ficam reunidos em
            uma pasta compartilhada com os participantes.
          </p>

          <ul className="mt-10 divide-y divide-tinta/15 border-y border-tinta/15">
            {referencias.map((r, i) => (
              <li
                key={r.titulo}
                className="reveal grid grid-cols-[3rem_1fr] gap-4 py-6"
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <span className="font-mono text-sm text-ferrugem">{r.ano}</span>
                <div>
                  <h3 className="font-display text-xl font-medium leading-snug sm:text-2xl">{r.titulo}</h3>
                  <p className="mt-1 text-tinta/70">{r.autor}</p>
                  <p className="kicker mt-2 text-tinta/45">{r.uso}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={links.drive}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink reveal mt-8"
          >
            Abrir a pasta de referências
          </a>
        </div>

        <aside id="quem" className="reveal self-start rounded-[2rem] bg-papel2 p-8 sm:p-10">
          <img
            src="/img/polyana.webp"
            alt={`${site.organizer}, organizadora do Paralaxe`}
            width={1200}
            height={1200}
            loading="lazy"
            className="aspect-square w-full rounded-[1.4rem] object-cover object-[50%_30%]"
          />
          <p className="kicker mt-8 text-ferrugem">Organização</p>
          <h3 className="mt-2 text-3xl font-medium leading-tight">{site.organizer}</h3>
          <p className="mt-4 leading-relaxed text-tinta/80">
            Polyana organiza o Paralaxe, que reúne o grupo de estudos teóricos e a supervisão
            psicanalítica em grupo. Pelo Instagram, ela comenta os encontros e responde as dúvidas
            de quem quer participar.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={links.instagramPolyana}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ink !py-2.5 text-sm"
            >
              @polyanalitica
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line !py-2.5 text-sm"
            >
              @paralaxeslab
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
