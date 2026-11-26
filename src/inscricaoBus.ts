import type { ServicoKey } from "./data/clinic";

export const EVENTO_INSCRICAO = "paralaxe:inscrever";

/** Abre a janela de inscrição já com o serviço escolhido. */
export function abrirInscricao(servico: ServicoKey) {
  window.dispatchEvent(new CustomEvent<ServicoKey>(EVENTO_INSCRICAO, { detail: servico }));
}
