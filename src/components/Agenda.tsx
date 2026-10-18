import { events, spaces, type AgendaEvent } from "../data/clinic";

const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return { d: String(d).padStart(2, "0"), mes: meses[m - 1], dia: dias[dt.getDay()] };
}

function todayISO() {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

function Row({ e, past }: { e: AgendaEvent; past?: boolean }) {
  const { d, mes, dia } = parts(e.date);
  const sp = spaces[e.space];
  const chip = e.space === "estudos" ? "bg-sol text-tinta" : "bg-ceu text-tinta";

  return (
    <li
      className={`reveal grid grid-cols-[4.2rem_1fr] gap-x-5 gap-y-3 border-t border-papel/15 py-7 sm:grid-cols-[7rem_1fr_auto] sm:items-center ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="leading-none">
        <div className="font-display text-5xl font-light sm:text-6xl">{d}</div>
        <div className="kicker mt-2 text-papel/60">{mes}</div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${chip}`}>
            {sp.name}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-papel/60">
            {dia}, {e.time} · on-line
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-medium leading-tight sm:text-[1.7rem]">{e.title}</h3>
        {e.text && <p className="mt-2 max-w-2xl leading-relaxed text-papel/70">{e.text}</p>}
      </div>
      {!past && (
        <a
          href={sp.form}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-line col-span-2 text-papel sm:col-span-1"
        >
          Inscrever-se
        </a>
      )}
    </li>
  );
}

export default function Agenda() {
  const hoje = todayISO();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const proximos = sorted.filter((e) => e.date >= hoje);
  const passados = sorted.filter((e) => e.date < hoje).reverse();

  return (
    <section id="agenda" className="bg-noite py-24 text-papel sm:py-32">
      <div className="wrap">
        <p className="kicker reveal mb-6 text-sol">03 · Agenda</p>
        <h2 className="reveal max-w-3xl text-[clamp(2.3rem,5vw,4.2rem)] font-light leading-[1.02] tracking-[-0.02em]">
          Próximos <span className="italic text-sol">encontros</span>
        </h2>

        {proximos.length > 0 ? (
          <ul className="mt-12">{proximos.map((e) => <Row key={e.date + e.space} e={e} />)}</ul>
        ) : (
          <p className="mt-12 max-w-xl text-lg text-papel/70">
            As próximas datas estão sendo organizadas. Acompanhe pelo Instagram ou entre em um dos
            grupos de WhatsApp para ser avisado.
          </p>
        )}

        {passados.length > 0 && (
          <details className="group mt-10 border-t border-papel/15 pt-6">
            <summary className="flex cursor-pointer items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-papel/60 hover:text-sol">
              Já aconteceu ({passados.length})
              <span className="plus text-xl transition-transform">+</span>
            </summary>
            <ul className="mt-4">
              {passados.map((e) => (
                <Row key={e.date + e.space} e={e} past />
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
