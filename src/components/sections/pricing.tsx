import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, MessageCircle, Monitor, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { Reveal } from "@/components/reveal";
import { BorderBeam } from "@/components/ui/border-beam";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

export const plans = [
  {
    id: "site",
    name: "Site Profissional",
    short: "Site",
    icon: Monitor,
    description: "Para ser encontrado no Google e passar confiança antes mesmo da primeira mensagem.",
    features: [
      "Landing page ou site institucional",
      "Design exclusivo, perfeito no celular",
      "Pronto para o Google",
      "Botões que levam direto ao seu WhatsApp",
      "Formulários, mapa e redes sociais",
      "Domínio, hospedagem e SSL configurados",
    ],
    message: "Olá, Lynx! Tenho interesse no plano Site Profissional.",
  },
  {
    id: "combo",
    name: "Combo Lynx",
    short: "Combo",
    icon: Sparkles,
    featured: true,
    description: "Site e WhatsApp trabalhando juntos: o visitante chega pelo site e é atendido na hora.",
    features: [
      "Tudo do Site Profissional",
      "Tudo da Automação WhatsApp",
      "Quem chega pelo site já é atendido",
      "Contatos organizados na planilha ou CRM",
      "Site e conversa pensados juntos",
      "Suporte prioritário",
    ],
    message: "Olá, Lynx! Tenho interesse no Combo Lynx (site + automação de WhatsApp).",
  },
  {
    id: "automacao",
    name: "Automação WhatsApp",
    short: "Automação",
    icon: MessageCircle,
    description: "Para quem perde cliente por demora no atendimento e não quer contratar mais gente.",
    features: [
      "IA atendendo 24 horas, 7 dias",
      "Conversa no tom do seu negócio",
      "Agendamentos e lembretes",
      "Entende o que cada cliente procura",
      "Integração com planilha e CRM",
      "Passa para uma pessoa quando precisa",
    ],
    message: "Olá, Lynx! Tenho interesse no plano Automação WhatsApp.",
  },
] as const;

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  const featured = "featured" in plan && plan.featured;
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 sm:p-8",
        featured
          ? "border-lynx-400/30 bg-gradient-to-b from-ink-700 via-ink-850 to-ink-900 shadow-[0_30px_100px_-30px_rgb(189_238_54/0.35)]"
          : "border-white/[0.08] bg-ink-900",
      )}
    >
      {featured && (
        <>
          <BorderBeam size={260} duration={10} borderWidth={1.5} />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-lynx-400/20 blur-3xl" />
        </>
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl",
            featured ? "bg-lynx-400 text-ink-950" : "border border-white/10 bg-white/[0.03] text-lynx-300",
          )}
        >
          <plan.icon className="size-5" />
        </span>
        {featured && (
          <span className="rounded-full border border-lynx-400/30 bg-lynx-400/10 px-3 py-1 text-xs font-medium text-lynx-200">
            Recomendado
          </span>
        )}
      </div>

      <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-white">{plan.name}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-neutral-400 lg:min-h-[4.25rem]">{plan.description}</p>

      <div className="relative mt-6 border-y border-white/[0.06] py-5">
        <span className="block whitespace-nowrap text-3xl font-semibold tracking-tight text-white">Sob consulta</span>
        <span className="mt-1 block text-sm text-neutral-500">Proposta por escrito, feita para o seu negócio</span>
      </div>

      <ul className="relative mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-neutral-300">
            <span
              className={cn(
                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full",
                featured ? "bg-lynx-400 text-ink-950" : "bg-white/[0.06] text-lynx-300",
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-8">
        <ButtonLink href={whatsappLink(plan.message)} variant={featured ? "primary" : "secondary"} size="lg" className="w-full">
          Pedir proposta
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </div>
    </div>
  );
}

// Desktop: três colunas. Celular: carrossel com snap que já abre centralizado no Combo (Snap Carousel, 21st.dev).
export function Pricing() {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const el = scroller.current;
    if (!el || getComputedStyle(el).overflowX !== "auto") return;
    const card = el.children[1] as HTMLElement | undefined;
    if (card) el.scrollLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setCurrent(best);
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <section id="planos" className="relative pb-24 pt-4 sm:pb-32">
      <div className="container-lynx max-lg:px-0">
        <Reveal>
          <div
            ref={scroller}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-[7.5%] pb-2 pt-4 [scrollbar-width:none] lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn("w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-auto", "featured" in plan && plan.featured && "lg:-my-4")}
              >
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        </Reveal>
        <div className="mt-6 flex justify-center gap-2 lg:hidden">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              aria-label={`Ver ${plan.name}`}
              aria-current={current === i}
              onClick={() => goTo(i)}
              className={cn("h-2 rounded-full transition-all duration-300", current === i ? "w-7 bg-lynx-400" : "w-2 bg-white/20")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
