import { useEffect, useRef, useState } from "react";
import { modoDireto, spaces } from "../data/clinic";
import { EVENTO_PAGANDO, type EspacoPago } from "../posPagamentoBus";

/**
 * Modo "direto": o botão de pagar abre o Mercado Pago em outra aba e esta janela fica esperando.
 * Quando a pessoa volta para o site, aparece o botão de entrar no grupo. Não confere o pagamento.
 */
export default function PosPagamento() {
  const [espaco, setEspaco] = useState<EspacoPago | null>(null);
  const [voltou, setVoltou] = useState(false);
  const saiu = useRef(false);

  useEffect(() => {
    if (!modoDireto) return;
    const pagando = (ev: Event) => {
      saiu.current = false;
      setVoltou(false);
      setEspaco((ev as CustomEvent<EspacoPago>).detail);
    };
    window.addEventListener(EVENTO_PAGANDO, pagando);
    return () => window.removeEventListener(EVENTO_PAGANDO, pagando);
  }, []);

  useEffect(() => {
    if (!espaco) return;
    // A pessoa saiu desta aba (foi pagar) e depois voltou: mostra o botão.
    const saida = () => {
      if (document.visibilityState === "hidden") saiu.current = true;
    };
    const perdeu = () => (saiu.current = true);
    const retorno = () => {
      if (saiu.current && document.visibilityState === "visible") setVoltou(true);
    };
    document.addEventListener("visibilitychange", saida);
    document.addEventListener("visibilitychange", retorno);
    window.addEventListener("blur", perdeu);
    window.addEventListener("focus", retorno);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setEspaco(null);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("visibilitychange", saida);
      document.removeEventListener("visibilitychange", retorno);
      window.removeEventListener("blur", perdeu);
      window.removeEventListener("focus", retorno);
      window.removeEventListener("keydown", esc);
    };
  }, [espaco]);

  if (!modoDireto || !espaco) return null;
  const grupo = spaces[espaco].group;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-noite/85 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pos-titulo"
    >
      <div className="w-full max-w-md rounded-[2rem] bg-papel p-6 text-tinta sm:p-8">
        {voltou ? (
          <>
            <p className="kicker text-ferrugem">Voltou do pagamento</p>
            <h2 id="pos-titulo" className="mt-1 font-display text-3xl font-light leading-tight">
              Pagamento <span className="italic text-ferrugem">concluído?</span>
            </h2>
            <p className="mt-3 leading-relaxed text-tinta/80">
              Se deu tudo certo, entre no grupo de WhatsApp.
            </p>
            <p className="mt-3 rounded-2xl bg-tinta p-3.5 text-sm font-semibold leading-snug text-papel">
              O acesso só será liberado após a confirmação do pagamento. A Polyana confere e aprova a sua entrada no grupo.
            </p>
            <a href={grupo} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-5 w-full">
              Entrar no grupo de WhatsApp
            </a>
            <button type="button" onClick={() => setEspaco(null)} className="mt-3 w-full text-sm font-semibold text-tinta/70 underline underline-offset-4">
              Ainda não paguei, voltar ao site
            </button>
          </>
        ) : (
          <>
            <p className="kicker text-ferrugem">Pagamento</p>
            <h2 id="pos-titulo" className="mt-1 font-display text-3xl font-light leading-tight">
              Pagamento aberto em <span className="italic text-ferrugem">outra aba.</span>
            </h2>
            <p className="mt-3 leading-relaxed text-tinta/80">
              Conclua o pagamento por lá (Pix, cartão ou boleto). Quando terminar, <strong>volte para esta página</strong>: o botão de
              entrar no grupo aparece aqui.
            </p>
            <p className="mt-3 rounded-2xl bg-tinta p-3.5 text-sm font-semibold leading-snug text-papel">
              O acesso só será liberado após o pagamento.
            </p>
            <button type="button" onClick={() => setVoltou(true)} className="mt-5 text-sm font-semibold text-ferrugem underline underline-offset-4">
              Já terminei
            </button>
            <button type="button" onClick={() => setEspaco(null)} className="mt-3 block text-sm font-semibold text-tinta/60 underline underline-offset-4">
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
