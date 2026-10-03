import { useEffect } from "react";

import { site } from "@/config/site";

// Título e descrição por página (aparecem na aba do navegador e no Google).
export function usePageMeta(title: string | null, description: string = site.description) {
  useEffect(() => {
    document.title = title ? `${title} | Lynx` : "Lynx — Automação de WhatsApp com IA e Criação de Sites";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
