import { useEffect, useState } from "react";
import Logo from "./Logo";

const nav = [
  { href: "#nome", label: "O nome" },
  { href: "#espacos", label: "Os dois espaços" },
  { href: "#como", label: "Como funciona" },
  { href: "#agenda", label: "Agenda" },
  { href: "#videos", label: "Vídeos" },
  { href: "#faq", label: "Dúvidas" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        solid || open
          ? "bg-noite/90 shadow-[0_1px_0_rgba(244,236,224,0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between text-papel">
        <a href="#topo" className="flex items-center gap-2.5" aria-label="Paralaxe, início">
          <Logo className="h-8 w-8 text-sol" />
          <span className="font-mono text-[0.8rem] uppercase tracking-[0.42em]">Paralaxe</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-papel/75 transition hover:text-sol"
            >
              {n.label}
            </a>
          ))}
          <a href="#inscricao" className="btn btn-sol !px-5 !py-2.5 text-sm">
            Inscrever-se
          </a>
        </nav>

        <button
          className="grid h-10 w-10 place-items-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <span className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 top-0 h-[2px] w-6 bg-current transition ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[2px] w-6 bg-current transition ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav className="wrap flex flex-col gap-1 pb-6 pt-2 text-papel md:hidden" aria-label="Menu">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-papel/10 py-3 font-display text-2xl"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#inscricao"
            onClick={() => setOpen(false)}
            className="btn btn-sol mt-4"
          >
            Inscrever-se
          </a>
        </nav>
      )}
    </header>
  );
}
