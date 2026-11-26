import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Só no computador (npm run dev): serve as funções de /api para testar o formulário sem a Vercel.
// Usa DRY_RUN: não manda e-mail nem cobra nada de verdade. Na Vercel este plugin não existe.
function apiLocal(): Plugin {
  return {
    name: "api-local",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res) => {
        const nome = (req.url || "").split("?")[0].replace(/^\//, "");
        const corpo = await new Promise<string>((ok) => {
          let b = "";
          req.on("data", (c) => (b += c));
          req.on("end", () => ok(b));
        });
        try {
          process.env.DRY_RUN ||= "1";
          process.env.SITE_URL ||= "http://localhost:8085";
          const mod = await server.ssrLoadModule(`/api/${nome}.js`);
          let json: unknown;
          try {
            json = corpo ? JSON.parse(corpo) : {};
          } catch {
            json = {};
          }
          const r: any = {
            method: req.method,
            headers: req.headers,
            query: Object.fromEntries(new URL(req.url || "", "http://x").searchParams),
            body: json,
          };
          const s: any = {
            statusCode: 200,
            setHeader: (k: string, v: string) => res.setHeader(k, v),
            status(c: number) {
              res.statusCode = c;
              s.statusCode = c;
              return s;
            },
            json(o: unknown) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(o));
              return s;
            },
            end(b?: string) {
              res.statusCode = s.statusCode;
              res.end(b);
              return s;
            },
          };
          await mod.default(r, s);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ erro: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiLocal()],
  server: { host: true, port: 8085 },
});
