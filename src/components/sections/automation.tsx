import { forwardRef, useRef } from "react";
import { Globe, MessageSquareText, Sparkles, Waypoints } from "lucide-react";

import { LynxMark } from "@/components/logo";
import { Reveal, SectionHeading } from "@/components/reveal";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Node = forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode; label: string }>(
  ({ className, children, label }, ref) => (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-ink-800 p-3 shadow-[0_0_30px_-12px_rgb(0_0_0/0.8)] sm:size-16",
          className,
        )}
      >
        {children}
      </div>
      <span className="text-[11px] text-neutral-500 sm:text-xs">{label}</span>
    </div>
  ),
);
Node.displayName = "Node";

function LogoImg({ file }: { file: string }) {
  return <img src={`/logos/${file}`} alt="" className="size-full object-contain" loading="lazy" />;
}

function BeamDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const whatsRef = useRef<HTMLDivElement>(null);
  const instaRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const gmailRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[440px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900 px-4 sm:px-10"
    >
      <div className="bg-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative flex w-full max-w-lg items-stretch justify-between">
        <div className="flex flex-col justify-between gap-8">
          <Node ref={whatsRef} label="WhatsApp">
            <LogoImg file="whatsapp-icon.svg" />
          </Node>
          <Node ref={instaRef} label="Instagram">
            <LogoImg file="instagram-icon.svg" />
          </Node>
          <Node ref={siteRef} label="Seu site">
            <Globe className="size-full text-lynx-300" strokeWidth={1.5} />
          </Node>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <span className="absolute inset-0 animate-pulse-ring rounded-[28px] bg-lynx-400/30" />
            <div
              ref={hubRef}
              className="relative z-10 flex size-20 items-center justify-center rounded-[28px] border border-lynx-400/40 bg-gradient-to-b from-ink-700 to-ink-850 shadow-[0_0_60px_-10px_rgb(189_238_54/0.6)] sm:size-24"
            >
              <LynxMark className="size-11 sm:size-12" />
            </div>
          </div>
          <span className="mt-3 rounded-full border border-lynx-400/25 bg-lynx-400/10 px-3 py-1 text-xs font-medium text-lynx-200">
            IA da Lynx
          </span>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <Node ref={sheetsRef} label="Planilhas">
            <LogoImg file="google-sheets.svg" />
          </Node>
          <Node ref={calendarRef} label="Agenda">
            <LogoImg file="google-calendar.svg" />
          </Node>
          <Node ref={gmailRef} label="E-mail">
            <LogoImg file="gmail.svg" />
          </Node>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={whatsRef} toRef={hubRef} curvature={-60} endYOffset={-10} duration={4} />
      <AnimatedBeam containerRef={containerRef} fromRef={instaRef} toRef={hubRef} duration={4.6} delay={0.4} />
      <AnimatedBeam containerRef={containerRef} fromRef={siteRef} toRef={hubRef} curvature={60} endYOffset={10} duration={5.2} delay={0.8} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={sheetsRef} curvature={-60} startYOffset={-10} duration={4.4} delay={1.2} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={calendarRef} duration={5} delay={1.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={gmailRef} curvature={60} startYOffset={10} duration={4.8} delay={2} />
    </div>
  );
}

const steps = [
  {
    icon: MessageSquareText,
    title: "Recebe de qualquer canal",
    text: "WhatsApp, Instagram ou formulário do site: toda mensagem cai no mesmo fluxo inteligente.",
  },
  {
    icon: Sparkles,
    title: "Entende e responde com IA",
    text: "A IA identifica a intenção do cliente e responde em segundos, com as informações do seu negócio.",
  },
  {
    icon: Waypoints,
    title: "Entrega onde você precisa",
    text: "Leads na planilha ou CRM, horários na agenda, avisos por e-mail — sem copiar e colar nada.",
  },
];

export function Automation() {
  return (
    <section id="automacao" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[600px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(189_238_54/0.07),transparent_65%)]" />
      <div className="container-lynx grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Como a automação funciona"
            title={
              <>
                Seu atendimento no <span className="font-serif font-normal italic text-lynx-300">piloto automático.</span>
              </>
            }
            description="Conectamos seus canais de contato a uma IA treinada para o seu negócio — e ela distribui cada informação para o lugar certo."
          />
          <ol className="mt-10 space-y-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={0.1 * i}>
                <li className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-lynx-400/20 hover:bg-white/[0.035]">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lynx-400/10 text-lynx-300 ring-1 ring-lynx-400/20">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      <span className="mr-2 font-mono text-xs text-lynx-400">0{i + 1}</span>
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-400">{text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={0.15}>
          <BeamDiagram />
        </Reveal>
      </div>
    </section>
  );
}
