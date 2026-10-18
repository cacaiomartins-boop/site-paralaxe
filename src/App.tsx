import { useEffect, useState } from "react";
import { useReveal } from "./hooks";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Espacos from "./components/Espacos";
import Agenda from "./components/Agenda";
import Videos from "./components/Videos";
import Referencias from "./components/Referencias";
import Combinados from "./components/Combinados";
import Inscricao from "./components/Inscricao";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

/** Botão fixo no celular: aparece depois do topo e some quando a inscrição está na tela. */
function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let onForm = false;
    const update = () => setShow(pastHero && !onForm);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById("inscricao");
    const io = target
      ? new IntersectionObserver(([en]) => {
          onForm = en.isIntersecting;
          update();
        })
      : null;
    if (target && io) io.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
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
        <Agenda />
        <Videos />
        <Referencias />
        <Combinados />
        <Inscricao />
        <Faq />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
