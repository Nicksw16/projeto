import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Pré-carrega as fontes da primeira tela e o bloco de animações (o nome com hash só existe depois do build).
const preloadFonts = {
  name: "preload-fonts",
  transformIndexHtml: {
    order: "post" as const,
    handler(_html: string, ctx: { bundle?: Record<string, unknown> }) {
      const wanted = [/geist-latin-wght-normal/, /instrument-serif-latin-400-italic/];
      const files = Object.keys(ctx.bundle ?? {});
      const fonts = files
        .filter((f) => f.endsWith(".woff2") && wanted.some((r) => r.test(f)))
        .map((f) => ({
          tag: "link",
          attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: `/${f}` },
          injectTo: "head" as const,
        }));
      // As animações (LazyMotion) são um bloco à parte: baixa junto com o JS principal, não depois dele.
      const motion = files
        .filter((f) => /motion-features.*\.js$/.test(f))
        .map((f) => ({ tag: "link", attrs: { rel: "modulepreload", href: `/${f}` }, injectTo: "head" as const }));
      return [...fonts, ...motion];
    },
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // O chunk da cena 3D (three.js) tem ~650 kB, mas só é baixado quando a seção se aproxima.
    chunkSizeWarningLimit: 700,
  },
});
