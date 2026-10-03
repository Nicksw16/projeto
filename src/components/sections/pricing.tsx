import { ArrowRight, Check, MessageCircle, Monitor, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { Reveal, SectionHeading } from "@/components/reveal";
import { BorderBeam } from "@/components/ui/border-beam";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Site Profissional",
    icon: Monitor,
    description: "Para quem quer uma presença digital que passa confiança e gera contatos todos os dias.",
    features: [
      "Landing page ou site institucional",
      "Design exclusivo e responsivo",
      "SEO técnico para o Google",
      "Integração com WhatsApp",
      "Formulários, mapa e redes sociais",
      "Domínio, hospedagem e SSL configurados",
    ],
    message: "Olá, Lynx! Tenho interesse no plano Site Profissional.",
  },
  {
    name: "Combo Lynx",
    icon: Sparkles,
    featured: true,
    description: "Site + automação trabalhando juntos: o visitante chega pelo site e é atendido na hora pelo WhatsApp.",
    features: [
      "Tudo do Site Profissional",
      "Tudo da Automação WhatsApp",
      "Leads do site direto no atendimento",
      "Integração completa com seu CRM",
      "Estratégia unificada de conversão",
      "Suporte prioritário",
    ],
    message: "Olá, Lynx! Tenho interesse no Combo Lynx (site + automação de WhatsApp).",
  },
  {
    name: "Automação WhatsApp",
    icon: MessageCircle,
    description: "Para quem perde vendas por demora no atendimento e quer escalar sem contratar mais gente.",
    features: [
      "Chatbot com IA 24/7",
      "Fluxos de conversa personalizados",
      "Agendamentos e lembretes",
      "Qualificação de leads",
      "Integração com planilhas e CRM",
      "Transferência para atendente humano",
    ],
    message: "Olá, Lynx! Tenho interesse no plano Automação WhatsApp.",
  },
];

export function Pricing() {
  return (
    <section id="planos" className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Planos"
          title={
            <>
              Escolha por onde <span className="font-serif font-normal italic text-lynx-300">começar.</span>
            </>
          }
          description="Todo projeto é personalizado. Escolha o formato que mais combina com o seu momento e receba um orçamento sob medida."
        />

        <div className="mt-16 grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={0.1 * i} className={cn(plan.featured && "lg:-my-4")}>
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 sm:p-8",
                  plan.featured
                    ? "border-lynx-400/30 bg-gradient-to-b from-ink-700 via-ink-850 to-ink-900 shadow-[0_30px_100px_-30px_rgb(189_238_54/0.35)]"
                    : "border-white/[0.08] bg-ink-900",
                )}
              >
                {plan.featured && (
                  <>
                    <BorderBeam size={260} duration={10} borderWidth={1.5} />
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-lynx-400/20 blur-3xl" />
                  </>
                )}

                <div className="relative flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      plan.featured ? "bg-lynx-400 text-ink-950" : "border border-white/10 bg-white/[0.03] text-lynx-300",
                    )}
                  >
                    <plan.icon className="size-5" />
                  </span>
                  {plan.featured && (
                    <span className="rounded-full border border-lynx-400/30 bg-lynx-400/10 px-3 py-1 text-xs font-medium text-lynx-200">
                      Recomendado
                    </span>
                  )}
                </div>

                <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-white">{plan.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-neutral-400 lg:min-h-[4.25rem]">{plan.description}</p>

                <div className="relative mt-6 border-y border-white/[0.06] py-5">
                  <span className="block whitespace-nowrap text-3xl font-semibold tracking-tight text-white">Sob consulta</span>
                  <span className="mt-1 block text-sm text-neutral-500">Orçamento personalizado para o seu projeto</span>
                </div>

                <ul className="relative mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-neutral-300">
                      <span
                        className={cn(
                          "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full",
                          plan.featured ? "bg-lynx-400 text-ink-950" : "bg-white/[0.06] text-lynx-300",
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-8">
                  <ButtonLink
                    href={whatsappLink(plan.message)}
                    variant={plan.featured ? "primary" : "secondary"}
                    size="lg"
                    className="w-full"
                  >
                    Solicitar orçamento
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
