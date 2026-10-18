import { useEffect, useState } from "react";
import { videos, links } from "../data/clinic";

type Video = (typeof videos)[number];

function Poster({ v, onOpen }: { v: Video; onOpen: () => void }) {
  return (
    <figure className="reveal mx-auto w-full lg:w-auto">
      <button
        onClick={onOpen}
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
      <figcaption className="mt-2 flex flex-col items-start gap-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-papel/55 sm:mt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-[0.68rem] sm:tracking-[0.14em]">
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

/** Janela com o vídeo: assim o Reel inteiro cabe na tela, sem esticar a seção. */
function Modal({ v, onClose }: { v: Video; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-noite/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={v.title}
      onClick={onClose}
    >
      <div
        className="relative h-[min(80svh,760px)] w-[min(94vw,380px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-1 right-0 z-10 grid h-9 w-9 -translate-y-full place-items-center rounded-full bg-papel text-tinta"
          aria-label="Fechar vídeo"
        >
          ×
        </button>
        <iframe
          title={v.title}
          src={`https://www.instagram.com/reel/${v.id}/embed`}
          className="h-full w-full rounded-2xl bg-white"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function Videos() {
  const [open, setOpen] = useState<Video | null>(null);

  return (
    <section id="videos" className="screen bg-tinta text-papel">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_auto] lg:gap-14">
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

          {/* No celular os dois vídeos ficam lado a lado; no computador entram na grade da seção. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:contents">
            {videos.map((v) => (
              <Poster key={v.id} v={v} onOpen={() => setOpen(v)} />
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

      {open && <Modal v={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
