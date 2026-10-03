import { useDeferredValue, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Accordion } from "@/components/ui/accordion";
import { faqCategories, faqs, type FaqCategory } from "@/config/faq";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: Searchable FAQ (21st.dev) + chips de categoria. Sem resultado → WhatsApp já com o termo buscado.

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Dados estruturados FAQPage para o Google, enquanto a página estiver aberta.
function useFaqJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
}

export function FaqExplorer() {
  useFaqJsonLd();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "Todas">("Todas");
  const deferred = useDeferredValue(query);

  const terms = normalize(deferred).split(/\s+/).filter(Boolean);
  const results = faqs.filter(
    (f) =>
      (category === "Todas" || f.category === category) &&
      terms.every((t) => normalize(`${f.q} ${f.a}`).includes(t)),
  );
  const items = results.map((f) => ({ id: f.id, title: f.q, content: f.a }));

  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="container-lynx max-w-3xl">
        <Reveal>
          <label className="group relative flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-ink-900 px-5 transition-colors focus-within:border-lynx-400/50 focus-within:shadow-[0_0_0_4px_rgb(189_238_54/0.08)]">
            <Search className="size-5 shrink-0 text-neutral-500 group-focus-within:text-lynx-300" />
            <span className="sr-only">Buscar uma dúvida</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque: preço, Google, número, prazo…"
              className="h-full w-full bg-transparent text-base text-white outline-none placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-neutral-400 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            {(["Todas", ...faqCategories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "h-9 rounded-full border px-4 text-sm transition-colors",
                  category === c
                    ? "border-lynx-400/50 bg-lynx-400/15 text-lynx-200"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <p className="mt-8 text-sm text-neutral-500" aria-live="polite">
          {results.length === 1 ? "1 pergunta" : `${results.length} perguntas`}
          {deferred && ` para “${deferred}”`}
        </p>

        <div className="mt-3">
          <AnimatePresence mode="wait" initial={false}>
            {items.length > 0 ? (
              <motion.div
                key={`${category}-${terms.join(" ")}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Accordion items={items} defaultOpen={terms.length ? [items[0].id] : []} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-[24px] border border-dashed border-white/15 bg-ink-900/60 p-8 text-center"
              >
                <p className="text-lg font-medium text-white">Não achamos nada sobre “{deferred}”.</p>
                <p className="mt-2 text-sm text-neutral-400">Pergunte direto. A gente responde com gente de verdade.</p>
                <ButtonLink href={whatsappLink(`Oi, Lynx! Procurei no FAQ do site e não achei: ${deferred}`)} className="mt-6">
                  <WhatsAppIcon className="size-4" />
                  Perguntar no WhatsApp
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
