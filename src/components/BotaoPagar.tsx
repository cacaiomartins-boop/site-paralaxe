import { modoDireto } from "../data/clinic";
import { iniciarPagamento, type EspacoPago } from "../posPagamentoBus";

/**
 * Botão de pagar. No modo "direto" é um botão de verdade (não um link): assim não dá para arrastar para outra aba,
 * abrir com o botão do meio nem pelo menu do clique direito, caminhos que pulariam a janela de aviso do site.
 */
export default function BotaoPagar({
  href,
  espaco,
  className,
  children,
}: {
  href: string;
  espaco: EspacoPago;
  className: string;
  children: React.ReactNode;
}) {
  if (modoDireto) {
    return (
      <button type="button" onClick={() => iniciarPagamento(espaco, href)} className={className}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
