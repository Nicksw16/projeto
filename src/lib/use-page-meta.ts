import { useEffect } from "react";

import { site } from "@/config/site";

const DEFAULT_TITLE = "Lynx — Automação de WhatsApp com IA e Criação de Sites";

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute("content", value);
}

// Título, descrição, canonical e prévia de compartilhamento por página.
// noindex: para páginas que não devem aparecer no Google (ex.: 404).
export function usePageMeta(title: string | null, description: string = site.description, noindex = false) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Lynx` : DEFAULT_TITLE;
    const url = site.url + window.location.pathname;
    document.title = fullTitle;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);

    if (!noindex) return;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, [title, description, noindex]);
}
