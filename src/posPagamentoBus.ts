export const EVENTO_PAGANDO = "paralaxe:pagando";
export type EspacoPago = "estudos" | "escuta";

/** Chamado quando a pessoa clica em pagar (o Mercado Pago abre em outra aba). */
export function avisarPagamento(espaco: EspacoPago) {
  window.dispatchEvent(new CustomEvent<EspacoPago>(EVENTO_PAGANDO, { detail: espaco }));
}
