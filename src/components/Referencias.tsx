import { referencias, links, site } from "../data/clinic";

export default function Referencias() {
  return (
    <section id="referencias" className="screen bg-papel">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="kicker reveal mb-4 text-ferrugem">06 · Referências</p>
          <h2 className="h-sec reveal">
            O que estamos <span className="italic text-ferrugem">lendo</span>
          </h2>
          <p className="reveal mt-4 max-w-lg leading-relaxed text-tinta/75" style={{ "--d": "100ms" } as React.CSSProperties}>
            Cada etapa dos encontros parte de uma referência como eixo. Os textos ficam reunidos em
            uma pasta compartilhada com os participantes.
          </p>

          <ul className="mt-6 divide-y divide-tinta/15 border-y border-tinta/15">
            {referencias.map((r, i) => (
              <li
                key={r.titulo}
                className="reveal grid grid-cols-[3rem_1fr] gap-4 py-3.5"
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <span className="font-mono text-sm text-ferrugem">{r.ano}</span>
                <div>
                  <h3 className="font-display text-lg font-medium leading-snug sm:text-xl">{r.titulo}</h3>
                  <p className="text-sm text-tinta/70">
                    {r.autor} <span className="text-tinta/40">·</span>{" "}
                    <span className="kicker text-tinta/45">{r.uso}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={links.drive}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink reveal mt-6 !py-3"
          >
            Abrir a pasta de referências
          </a>
        </div>

        <aside id="quem" className="reveal rounded-[2rem] bg-papel2 p-5 sm:p-6">
          <img
            src="/img/polyana.webp"
            alt={`${site.organizer}, organizadora do Paralaxe`}
            width={1200}
            height={1200}
            loading="lazy"
            className="aspect-[16/9] w-full rounded-[1.4rem] object-cover object-[50%_28%]"
          />
          <p className="kicker mt-5 text-ferrugem">Organização</p>
          <h3 className="mt-1 text-2xl font-medium leading-tight">{site.organizer}</h3>
          <p className="mt-2 text-[0.96rem] leading-relaxed text-tinta/80">
            Polyana organiza o Paralaxe, que reúne o grupo de estudos teóricos e a supervisão
            psicanalítica em grupo. Pelo Instagram, ela comenta os encontros e responde as dúvidas
            de quem quer participar.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
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
