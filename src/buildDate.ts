/** Data de hoje no formato AAAA-MM-DD, no horário do computador de quem está vendo. */
export function hojeISO() {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

/**
 * Data em que o HTML foi pré-renderizado. O build grava essa data numa <meta name="build-date">; o navegador a lê
 * para a primeira renderização sair igual à do servidor (sem erro de hidratação). Depois a tela se atualiza
 * para a data de verdade (veja a Agenda).
 */
export function dataDoBuild() {
  if (typeof document !== "undefined") {
    const m = document.querySelector('meta[name="build-date"]');
    return m?.getAttribute("content") || hojeISO();
  }
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.BUILD_DATE || hojeISO();
}
