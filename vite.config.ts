import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
