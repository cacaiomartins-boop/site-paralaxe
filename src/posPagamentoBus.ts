export const EVENTO_PAGANDO = "paralaxe:pagando";
export type EspacoPago = "estudos" | "escuta";

const CHAVE = "paralaxe:pagando";
const VALIDADE_MS = 6 * 60 * 60 * 1000; // 6 horas

function guardar(espaco: EspacoPago) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ espaco, t: Date.now() }));
  } catch {
    /* sem armazenamento (navegação privada): a janela ainda funciona nesta página */
  }
}

/** Esquece que a pessoa foi pagar (ela cancelou, ou já entrou no grupo). */
export function limparPagamento() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignorado */
  }
}

/** Se a pessoa clicou em pagar há pouco e a página recarregou ao voltar, devolve o espaço. */
export function pagamentoPendente(): EspacoPago | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const { espaco, t } = JSON.parse(bruto) as { espaco: EspacoPago; t: number };
    if ((espaco === "estudos" || espaco === "escuta") && Date.now() - t < VALIDADE_MS) return espaco;
    limparPagamento();
  } catch {
    /* ignorado */
  }
  return null;
}

/** Abre o Mercado Pago e avisa a janela do site. Funciona com aba nova, mesma aba e navegador do Instagram. */
export function iniciarPagamento(espaco: EspacoPago, href: string) {
  guardar(espaco);
  window.dispatchEvent(new CustomEvent<EspacoPago>(EVENTO_PAGANDO, { detail: espaco }));
  const aba = window.open(href, "_blank");
  if (aba) {
    aba.opener = null;
  } else {
    window.location.href = href; // popup bloqueado ou navegador interno sem abas: abre na mesma janela
  }
}
