import Logo from "./Logo";
import { links, site } from "../data/clinic";

export default function Footer() {
  return (
    <footer className="bg-noite pb-24 pt-14 text-papel md:pb-10">
      <div className="wrap">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sol">
              <Logo className="h-10 w-10" />
              <span className="font-glitch text-lg tracking-[0.12em] text-papel">Paralaxe</span>
            </div>
            <p className="mt-5 max-w-sm font-display text-2xl italic leading-snug text-papel/80">
              {site.tagline} Estudos e supervisão em psicanálise, on-line.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-papel/70" aria-label="Rodapé">
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sol">
              Instagram
            </a>
            <a href={links.threads} target="_blank" rel="noopener noreferrer" className="hover:text-sol">
              Threads
            </a>
            <a href={links.drive} target="_blank" rel="noopener noreferrer" className="hover:text-sol">
              Referências
            </a>
            <a href="#inscricao" className="hover:text-sol">
              Inscrição
            </a>
          </nav>
        </div>
        <p className="mt-12 border-t border-papel/10 pt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-papel/40">
          © {site.year} Paralaxe · organização {site.organizer}
        </p>
      </div>
    </footer>
  );
}
