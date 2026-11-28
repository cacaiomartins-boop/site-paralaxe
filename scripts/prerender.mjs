// Roda depois do `vite build`: gera o HTML da página com o conteúdo já dentro
// (para buscadores e robôs de IA que não executam JavaScript) e injeta os dados estruturados.
import { build } from "vite";
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const saidaSsr = path.join(raiz, "dist-ssr");

// A Agenda depende da data: o servidor e o navegador precisam começar com a mesma data (veja src/buildDate.ts).
const hoje = new Date();
const p = (x) => String(x).padStart(2, "0");
process.env.BUILD_DATE = `${hoje.getFullYear()}-${p(hoje.getMonth() + 1)}-${p(hoje.getDate())}`;

await build({
  root: raiz,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: saidaSsr, emptyOutDir: true },
});

const { render, jsonLd } = await import(pathToFileURL(path.join(saidaSsr, "entry-server.js")).href);
const html = render();

const arquivo = path.join(raiz, "dist", "index.html");
let modelo = await readFile(arquivo, "utf-8");

const marcador = '<div id="root"></div>';
if (!modelo.includes(marcador)) throw new Error("Marcador #root não encontrado em dist/index.html");
if (!modelo.includes("</head>")) throw new Error("</head> não encontrado em dist/index.html");

modelo = modelo
  .replace("</head>", `<meta name="build-date" content="${process.env.BUILD_DATE}" />\n    <script type="application/ld+json">${jsonLd()}</script>\n  </head>`)
  .replace(marcador, `<div id="root">${html}</div>`);

await writeFile(arquivo, modelo);
await rm(saidaSsr, { recursive: true, force: true });
console.log(`Pré-renderização ok (${html.length} caracteres de HTML, data do build ${process.env.BUILD_DATE}).`);
