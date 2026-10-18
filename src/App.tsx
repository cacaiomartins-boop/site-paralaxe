import { useEffect, useState } from "react";
import { useReveal } from "./hooks";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Espacos from "./components/Espacos";
import ComoFunciona from "./components/ComoFunciona";
import Agenda from "./components/Agenda";
import Videos from "./components/Videos";
import Referencias from "./components/Referencias";
import Combinados from "./components/Combinados";
import Inscricao from "./components/Inscricao";
import Faq from "./components/Faq";
import EmBreve from "./components/EmBreve";
import Footer from "./components/Footer";

/** Botão fixo no celular: aparece depois do topo e some quando a inscrição está na tela. */
function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    const visible = new Set<Element>();
    const update = () => setShow(pastHero && visible.size === 0);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Some quando a inscrição ou o aviso final estão na tela, para não cobrir os botões.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      update();
    });
    ["inscricao", "embreve"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <a
      href="#inscricao"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`btn btn-sol fixed bottom-4 left-1/2 z-40 -translate-x-1/2 !px-8 !py-3 shadow-xl transition duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      Quero participar
    </a>
  );
}

export default function App() {
  useReveal();

  return (
    <div className="grain">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Espacos />
        <ComoFunciona />
        <Agenda />
        <Videos />
        <Referencias />
        <Combinados />
        <Inscricao />
        <Faq />
        <EmBreve />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
