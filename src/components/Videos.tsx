import { useState } from "react";
import { videos, links } from "../data/clinic";

function Reel({ id, title, by }: { id: string; title: string; by: string }) {
  const [on, setOn] = useState(false);

  return (
    <figure className="reveal mx-auto w-full max-w-[340px]">
      <div
        className={`relative overflow-hidden rounded-[1.6rem] bg-tinta ring-1 ring-papel/10 ${
          on ? "aspect-[9/18]" : "aspect-[9/16]"
        }`}
      >
        {on ? (
          <iframe
            title={title}
            src={`https://www.instagram.com/reel/${id}/embed`}
            className="absolute inset-0 h-full w-full bg-white"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            onClick={() => setOn(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, rgba(240,180,41,.95) 0 14%, rgba(201,83,31,.9) 34%, #2a1a14 78%)",
            }}
            aria-label={`Assistir: ${title}`}
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-papel text-tinta transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-display text-xl leading-snug text-papel">{title}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-papel/55">
        <span>{by}</span>
        <a
          href={`https://www.instagram.com/reel/${id}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sol"
        >
          Abrir no Instagram
        </a>
      </figcaption>
    </figure>
  );
}

export default function Videos() {
  return (
    <section id="videos" className="bg-tinta py-24 text-papel sm:py-32">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-14">
          <div className="max-w-md">
            <p className="kicker reveal mb-6 text-sol">04 · Em vídeo</p>
            <h2 className="reveal text-[clamp(2.3rem,5vw,3.8rem)] font-light leading-[1.02] tracking-[-0.02em]">
              Um jeito de <span className="italic text-sol">conhecer</span> o grupo
            </h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-papel/75" style={{ "--d": "100ms" } as React.CSSProperties}>
              A Polyana comenta, em vídeos curtos, o que está em jogo em cada encontro de estudos.
              É uma boa forma de sentir o tom das conversas antes de entrar.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" style={{ "--d": "180ms" } as React.CSSProperties}>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sol">
                @paralaxeslab
              </a>
              <a href={links.instagramPolyana} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                @polyanalitica
              </a>
            </div>
          </div>

          {videos.map((v) => (
            <Reel key={v.id} {...v} />
          ))}
        </div>

        {links.youtubeApresentacao && (
          <div className="reveal mt-16 aspect-video overflow-hidden rounded-[1.6rem]">
            <iframe
              title="Vídeo de apresentação do Paralaxe"
              src={`https://www.youtube-nocookie.com/embed/${links.youtubeApresentacao}`}
              className="h-full w-full"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
