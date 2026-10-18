import { useState } from "react";
import { videos, links } from "../data/clinic";

type Video = (typeof videos)[number];

/** O vídeo toca no próprio lugar do quadro. No celular, o quadro aberto ocupa a linha inteira. */
function Reel({ v }: { v: Video }) {
  const [on, setOn] = useState(false);

  return (
    <figure
      className={`reveal mx-auto w-full lg:mx-0 lg:w-auto ${
        on ? "order-first col-span-2 max-w-[340px] lg:order-none lg:col-span-1 lg:max-w-none" : ""
      }`}
    >
      {on ? (
        <iframe
          title={v.title}
          src={`https://www.instagram.com/reel/${v.id}/embed`}
          className="aspect-[9/18] w-full rounded-[1.2rem] bg-white sm:rounded-[1.6rem] lg:h-[min(86vh,700px)] lg:w-[min(43vh,350px)]"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setOn(true)}
          className="group relative flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.2rem] p-3 text-center ring-1 ring-papel/10 sm:rounded-[1.6rem] sm:p-5 lg:h-[min(76vh,620px)] lg:w-auto lg:gap-4"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(240,180,41,.95) 0 14%, rgba(201,83,31,.9) 34%, #2a1a14 78%)",
          }}
          aria-label={`Assistir: ${v.title}`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-papel text-tinta transition group-hover:scale-110 sm:h-14 sm:w-14">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 sm:ml-1 sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-display text-[0.8rem] leading-snug text-papel sm:text-lg">{v.title}</span>
        </button>
      )}
      <figcaption className="mt-2 flex w-0 min-w-full flex-col items-start gap-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-papel/55 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1 sm:text-[0.68rem] sm:tracking-[0.14em]">
        <span>{v.by}</span>
        <a
          href={`https://www.instagram.com/reel/${v.id}/`}
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
    <section id="videos" className="screen bg-tinta text-papel">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
          <div className="max-w-md">
            <p className="kicker reveal mb-4 text-sol">05 · Em vídeo</p>
            <h2 className="h-sec reveal">
              Um jeito de <span className="italic text-sol">conhecer</span> o grupo
            </h2>
            <p className="reveal mt-5 leading-relaxed text-papel/75" style={{ "--d": "100ms" } as React.CSSProperties}>
              A Polyana comenta, em vídeos curtos, o que está em jogo em cada encontro de estudos.
              É uma boa forma de sentir o tom das conversas antes de entrar.
            </p>
            <div className="reveal mt-6 flex flex-wrap gap-3" style={{ "--d": "180ms" } as React.CSSProperties}>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sol !py-3">
                @paralaxeslab
              </a>
              <a href={links.instagramPolyana} target="_blank" rel="noopener noreferrer" className="btn btn-line !py-3">
                @polyanalitica
              </a>
            </div>
          </div>

          {/* Os dois vídeos ficam lado a lado, bem juntos. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:flex lg:items-start lg:gap-5">
            {videos.map((v) => (
              <Reel key={v.id} v={v} />
            ))}
          </div>
        </div>

        {links.youtubeApresentacao && (
          <div className="reveal mt-10 aspect-video max-h-[40vh] overflow-hidden rounded-[1.6rem]">
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
