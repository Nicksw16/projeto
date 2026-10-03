// Contexto do visitante (tipo de negócio escolhido nas demos) para a mensagem do WhatsApp chegar mais completa.
const KEY = "lynx:negocio";

export function getNiche(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setNiche(niche: string) {
  try {
    sessionStorage.setItem(KEY, niche);
  } catch {
    // sem storage (aba privada, bloqueado): a demo funciona igual, só não lembra a escolha
  }
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Início",
  "/servicos": "Serviços",
  "/automacao": "Automação",
  "/processo": "Processo",
  "/planos": "Planos",
  "/faq": "FAQ",
};

// Acrescenta ao texto do wa.me de onde o visitante veio e qual negócio escolheu nas demos.
export function withLeadContext(href: string, pathname: string): string {
  try {
    const url = new URL(href);
    if (url.hostname !== "wa.me" || url.searchParams.has("ctx")) return href;
    const text = url.searchParams.get("text") ?? "";
    const niche = getNiche();
    const page = PAGE_NAMES[pathname] ?? pathname;
    const details = [`página ${page}`, niche && `negócio: ${niche}`].filter(Boolean).join(", ");
    url.searchParams.set("text", `${text}\n\n(Enviado pelo site — ${details})`);
    return url.toString();
  } catch {
    return href;
  }
}
