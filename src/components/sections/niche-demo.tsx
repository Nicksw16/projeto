import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, SectionHeading } from "@/components/reveal";
import { WhatsAppPhone } from "@/components/ui/whatsapp-phone";
import { niches } from "@/config/niches";
import { whatsappLink } from "@/config/site";
import { getNiche, setNiche } from "@/lib/lead";
import { cn } from "@/lib/utils";

// Demo tocável por tipo de negócio: chips no estilo Suggestions (21st.dev) + o celular com o roteiro daquele nicho.
export function NicheDemo({
  eyebrow = "Serve pro meu negócio?",
  title,
  description = "Toque no seu tipo de negócio e veja uma conversa de exemplo acontecendo — do jeito que o seu cliente vai sentir.",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
}) {
  const [active, setActive] = useState(() => {
    const saved = getNiche();
    return niches.find((n) => n.label === saved)?.id ?? niches[0].id;
  });
  const niche = niches.find((n) => n.id === active) ?? niches[0];

  const choose = (id: string) => {
    setActive(id);
    const picked = niches.find((n) => n.id === id);
    if (picked) setNiche(picked.label);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[600px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(189_238_54/0.07),transparent_65%)]" />
      <div className="container-lynx grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow={eyebrow}
            title={
              title ?? (
                <>
                  Escolha seu negócio e <span className="font-serif font-normal italic text-lynx-300">veja funcionando.</span>
                </>
              )
            }
            description={description}
          />

          <Reveal delay={0.1} className="mt-8">
            <div role="tablist" aria-label="Tipo de negócio" className="flex flex-wrap gap-2">
              {niches.map((n) => (
                <button
                  key={n.id}
                  role="tab"
                  type="button"
                  aria-selected={n.id === active}
                  onClick={() => choose(n.id)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
                    n.id === active
                      ? "border-lynx-400 bg-lynx-400 text-ink-950 shadow-[0_6px_24px_-8px_rgb(189_238_54/0.7)]"
                      : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white",
                  )}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={niche.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-8 rounded-3xl border border-white/[0.08] bg-ink-900/70 p-6"
            >
              <p className="text-lg font-semibold tracking-tight text-white">{niche.headline}</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {niche.does.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <Check className="mt-0.5 size-4 shrink-0 text-lynx-400" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={whatsappLink(`Olá, Lynx! Tenho um(a) ${niche.label.toLowerCase()} e quero um atendimento assim no meu WhatsApp.`)}
                className="mt-6"
              >
                <WhatsAppIcon className="size-4" />
                Quero isso no meu {niche.label.toLowerCase()}
              </ButtonLink>
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lynx-400/20 to-emerald-500/15 blur-[90px]" />
          <WhatsAppPhone key={niche.id} script={niche.script} />
          <p className="mt-4 text-center text-xs text-neutral-500">Conversa simulada · exemplo de {niche.label.toLowerCase()}</p>
        </Reveal>
      </div>
    </section>
  );
}
