import { motion } from "motion/react";
import { ArrowRight, Check, Database, Zap, CalendarCheck } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Spotlight } from "@/components/ui/spotlight";
import { TextCycle } from "@/components/ui/text-cycle";
import { WhatsAppPhone } from "@/components/ui/whatsapp-phone";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease },
});

function FloatingChip({
  icon,
  title,
  subtitle,
  className,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
      className={cn("absolute z-20", className)}
    >
      <div
        className="flex animate-float items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/80 py-2.5 pl-2.5 pr-4 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)] backdrop-blur-xl"
        style={{ animationDelay: `${delay}s` }}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-lynx-400/15 text-lynx-300 ring-1 ring-lynx-400/25">
          {icon}
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold text-white">{title}</span>
          <span className="block text-[11.5px] text-neutral-400">{subtitle}</span>
        </span>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* Fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <Spotlight className="-top-40 left-0 md:-top-24 md:left-40" fill="#bdee36" />
        <div className="absolute right-[-10%] top-1/3 h-[520px] w-[520px] rounded-full bg-lynx-400/10 blur-[120px]" />
        <div className="absolute left-[-15%] top-[60%] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-lynx relative grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.a
            href="#automacao"
            {...fadeUp(0.1)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-xs text-neutral-300 backdrop-blur transition-colors hover:border-lynx-400/30"
          >
            <span className="rounded-full bg-lynx-400 px-2 py-0.5 text-[11px] font-semibold text-ink-950">IA</span>
            Automação de WhatsApp + sites de alta conversão
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            {...fadeUp(0.2)}
            className="mt-7 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.6rem]"
          >
            Sites que <span className="text-gradient">vendem.</span>
            <br />
            WhatsApp que <br className="sm:hidden" />
            <TextCycle
              words={["atende sozinho.", "vende 24h.", "nunca dorme."]}
              interval={2800}
              className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em]"
              charClassName="text-lynx-300 [text-shadow:0_0_40px_rgb(189_238_54/0.35)]"
            />
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-neutral-400"
          >
            A Lynx cria sites rápidos e marcantes que transformam visitantes em clientes — e automações de WhatsApp com
            IA que respondem, qualificam e agendam por você, a qualquer hora do dia.
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappLink("Olá, Lynx! Quero tirar meu projeto do papel.")} size="lg">
              <WhatsAppIcon className="size-[18px]" />
              Quero meu projeto
            </ButtonLink>
            <ButtonLink href="#servicos" variant="secondary" size="lg">
              Conhecer os serviços
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeUp(0.65)} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
            {["Atendimento 24/7", "Projeto 100% sob medida", "Suporte humano de verdade"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-lynx-400/15 text-lynx-300">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative lg:col-span-5">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lynx-400/25 to-emerald-500/20 blur-[90px]" />
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease }}
            className="relative"
          >
            <WhatsAppPhone />
          </motion.div>

          <FloatingChip
            delay={1.2}
            className="-left-1 top-[30%] sm:left-0 sm:top-16 lg:-left-16"
            icon={<Zap className="size-4" />}
            title="Respondeu em 2s"
            subtitle="Sem fila, sem espera"
          />
          <FloatingChip
            delay={1.5}
            className="-right-2 top-[46%] sm:right-0 lg:-right-10"
            icon={<Database className="size-4" />}
            title="Lead qualificado"
            subtitle="Salvo no seu CRM"
          />
          <FloatingChip
            delay={1.8}
            className="-bottom-2 left-0 hidden sm:block lg:-left-20"
            icon={<CalendarCheck className="size-4" />}
            title="+1 agendamento"
            subtitle="Confirmado às 14:00"
          />
        </div>
      </div>
    </section>
  );
}
