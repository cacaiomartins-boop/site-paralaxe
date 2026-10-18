import { useEffect, useRef, useState } from "react";
import { videos, links } from "../data/clinic";

type Video = (typeof videos)[number];

// O player do Instagram tem largura mínima de 326 px; abaixo disso ele é reduzido por escala.
const EMBED_W = 326;
const EMBED_H = 580;

/** Vídeo já carregado com a arte do Instagram, pronto para dar play. */
function Reel({ v }: { v: Video }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / EMBED_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="reveal mx-auto w-full lg:mx-0 lg:w-auto">
      <div
        ref={box}
        className="relative aspect-[326/580] w-full overflow-hidden rounded-[1.2rem] bg-white ring-1 ring-papel/10 sm:rounded-[1.6rem] lg:w-[min(340px,44vh)]"
      >
        <iframe
          title={v.title}
          src={`https://www.instagram.com/reel/${v.id}/embed`}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="absolute left-0 top-0 border-0"
          style={{
            width: EMBED_W,
            height: EMBED_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
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
