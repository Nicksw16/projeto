import { ArrowRight, Check } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { LynxMark } from "@/components/logo";
import { Reveal, SectionHeading } from "@/components/reveal";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: Integrations Orbit Section (21st.dev) — anéis girando com as ferramentas que conversam com a Lynx.

const inner = [
  { name: "WhatsApp", logo: "whatsapp-icon" },
  { name: "Google Agenda", logo: "google-calendar" },
  { name: "Google Planilhas", logo: "google-sheets" },
  { name: "Gmail", logo: "gmail" },
];

const outer = [
  { name: "Instagram", logo: "instagram-icon" },
  { name: "Mercado Pago", logo: "mercado-pago" },
  { name: "Notion", logo: "notion" },
  { name: "Shopify", logo: "shopify" },
  { name: "Stripe", logo: "stripe" },
  { name: "WordPress", logo: "wordpress" },
  { name: "OpenAI", logo: "openai_dark" },
  { name: "n8n", logo: "n8n" },
];

const points = [
  "Agenda: marca, remarca e lembra sozinha",
  "Planilha ou CRM: cada contato anotado",
  "Pagamento: link enviado na própria conversa",
  "E-mail: sua equipe avisada quando precisa",
];

function Ring({
  items,
  radius,
  duration,
  reverse,
  size,
}: {
  items: { name: string; logo: string }[];
  radius: number;
  duration: number;
  reverse?: boolean;
  size: string;
}) {
  return (
    <div
      className={cn("absolute inset-0", reverse ? "animate-orbit-reverse" : "animate-orbit")}
      style={{ animationDuration: `${duration}s` }}
    >
      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div
            key={item.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%` }}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl border border-white/10 bg-ink-800/90 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur",
                size,
                reverse ? "animate-orbit" : "animate-orbit-reverse",
              )}
              style={{ animationDuration: `${duration}s` }}
              title={item.name}
            >
              <img src={`/logos/${item.logo}.svg`} alt={item.name} className="size-1/2" loading="lazy" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IntegrationsOrbit() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-lynx grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Integrações"
            title={
              <>
                Conversa com o que <span className="font-serif font-normal italic text-lynx-300">você já usa.</span>
              </>
            }
            description="A IA não fica isolada no WhatsApp: ela consulta e atualiza suas ferramentas durante o atendimento."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-col gap-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-neutral-200">
                  <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-lynx-400/15 text-lynx-300">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-neutral-500">
              Usa outro sistema? Se ele tiver integração disponível, a gente conecta. Pergunte antes de fechar.
            </p>
            <ButtonLink
              href={whatsappLink("Oi, Lynx! Queria saber se a automação integra com o sistema que eu uso: ")}
              variant="secondary"
              className="mt-8"
            >
              <WhatsAppIcon className="size-4" />
              Integra com o meu sistema?
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-label="Ferramentas que se conectam à Lynx" role="img">
            <div className="absolute inset-[22%] rounded-full border border-white/[0.07]" />
            <div className="absolute inset-[4%] rounded-full border border-dashed border-white/[0.07]" />
            <div className="absolute inset-[30%] rounded-full bg-lynx-400/10 blur-3xl" />

            <Ring items={inner} radius={28} duration={48} size="size-12 sm:size-14" />
            <Ring items={outer} radius={46} duration={80} reverse size="size-11 sm:size-12" />

            <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26px] border border-lynx-400/30 bg-ink-900 shadow-[0_0_60px_-10px_rgb(189_238_54/0.5)] sm:size-24">
              <span className="absolute inset-0 animate-pulse-ring rounded-[26px] border border-lynx-400/40" />
              <LynxMark className="size-11 sm:size-12" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
