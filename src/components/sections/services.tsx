import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  Database,
  Headphones,
  MessageCircle,
  Palette,
  Search,
  Send,
  Smartphone,
  UserRound,
  Workflow,
} from "lucide-react";

import { ButtonLink } from "@/components/button";
import { Reveal, SectionHeading } from "@/components/reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

function GlowCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative h-full rounded-[28px] border border-white/[0.08] p-1.5", className)}>
      <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={2} disabled={false} />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.04] bg-ink-900">
        {children}
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-300">
          <Check className="mt-0.5 size-4 shrink-0 text-lynx-400" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

const flow = [
  { icon: MessageCircle, label: "Cliente manda mensagem", tone: "neutral" },
  { icon: Bot, label: "IA entende o que ele precisa", tone: "lynx" },
] as const;

const branches = [
  { icon: CalendarCheck, label: "Agenda" },
  { icon: Send, label: "Orçamento" },
  { icon: UserRound, label: "Humano" },
];

function AutomationVisual() {
  return (
    <div className="relative flex flex-col items-center px-6 pb-8 pt-2">
      {flow.map(({ icon: Icon, label, tone }, i) => (
        <div key={label} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.25 }}
            className={cn(
              "flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm",
              tone === "lynx"
                ? "border-lynx-400/30 bg-lynx-400/10 text-lynx-200 shadow-[0_0_30px_-8px_rgb(189_238_54/0.5)]"
                : "border-white/10 bg-white/[0.03] text-neutral-200",
            )}
          >
            <Icon className="size-4" />
            {label}
          </motion.div>
          <div className="relative h-8 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 h-3 bg-gradient-to-b from-transparent via-lynx-300 to-transparent"
              animate={{ top: ["-30%", "120%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            />
          </div>
        </div>
      ))}
      <div className="relative w-full max-w-sm">
        <div className="absolute left-[16.66%] right-[16.66%] top-0 h-px bg-white/10" />
        <div className="grid grid-cols-3 gap-2">
          {branches.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className="h-5 w-px bg-white/10" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.12 }}
                className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-ink-800 px-2 py-3 text-xs text-neutral-300"
              >
                <Icon className="size-4 text-lynx-300" />
                {label}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="relative px-6 pb-8 pt-2">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-ink-800 px-3 py-2">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] text-neutral-500">
            seunegocio.com.br
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="h-2 w-12 rounded-full bg-white/20" />
            <span className="flex gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-white/10" />
              <span className="h-1.5 w-6 rounded-full bg-white/10" />
              <span className="h-1.5 w-6 rounded-full bg-white/10" />
            </span>
          </div>
          <div className="space-y-1.5 pt-3">
            <span className="block h-3 w-4/5 rounded-full bg-white/80" />
            <span className="block h-3 w-3/5 rounded-full bg-gradient-to-r from-lynx-300 to-emerald-400" />
          </div>
          <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
          <span className="block h-1.5 w-1/2 rounded-full bg-white/15" />
          <span className="inline-flex h-5 w-20 items-center justify-center rounded-full bg-lynx-400 text-[8px] font-semibold text-ink-950">
            Fale conosco
          </span>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <span className="h-10 rounded-lg bg-white/[0.04]" />
            <span className="h-10 rounded-lg bg-white/[0.04]" />
            <span className="h-10 rounded-lg bg-white/[0.04]" />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="absolute -bottom-1 right-3 w-[84px] overflow-hidden rounded-[16px] border-[3px] border-ink-700 bg-ink-950 p-2 shadow-2xl"
      >
        <span className="mx-auto mb-2 block h-1 w-6 rounded-full bg-white/15" />
        <span className="block h-1.5 w-full rounded-full bg-white/70" />
        <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-gradient-to-r from-lynx-300 to-emerald-400" />
        <span className="mt-2 block h-1 w-full rounded-full bg-white/15" />
        <span className="mt-1 block h-1 w-2/3 rounded-full bg-white/15" />
        <span className="mt-2 block h-3 w-full rounded-full bg-lynx-400" />
        <span className="mt-2 block h-6 w-full rounded-md bg-white/[0.05]" />
      </motion.div>
    </div>
  );
}

const extras = [
  {
    icon: Bot,
    title: "IA que conversa como gente",
    text: "Respostas naturais, no tom da sua marca, treinadas com as informações do seu negócio.",
  },
  {
    icon: Database,
    title: "Integrado ao que você já usa",
    text: "Planilhas, CRM, agenda, pagamentos e e-mail conectados ao atendimento.",
  },
  {
    icon: Workflow,
    title: "Follow-up automático",
    text: "Lembretes, recuperação de orçamentos e reengajamento sem esforço manual.",
  },
  {
    icon: Palette,
    title: "Design que é a sua cara",
    text: "Identidade visual única — nada de template genérico que o cliente já viu mil vezes.",
  },
  {
    icon: Search,
    title: "Pronto para o Google",
    text: "SEO técnico, carregamento rápido e estrutura pensada para ser encontrado.",
  },
  {
    icon: Headphones,
    title: "Suporte de verdade",
    text: "Gente real acompanhando seu projeto antes, durante e depois da entrega.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="O que fazemos"
          title={
            <>
              Duas especialidades.{" "}
              <span className="font-serif font-normal italic text-lynx-300">Um só objetivo:</span> fazer você vender mais.
            </>
          }
          description="Unimos o melhor de dois mundos: um site que conquista no primeiro clique e um WhatsApp que atende, qualifica e fecha — tudo trabalhando junto."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <Reveal className="sm:col-span-2 lg:col-span-7">
            <GlowCard>
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-lynx-400 text-ink-950">
                    <MessageCircle className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-lynx-300">Automação de WhatsApp</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Um atendente incansável, 24 horas por dia.
                </h3>
                <p className="mt-3 max-w-lg text-neutral-400">
                  Chatbots com inteligência artificial que respondem na hora, tiram dúvidas, qualificam leads, agendam
                  horários e passam para sua equipe só quando realmente precisa.
                </p>
                <div className="mt-7">
                  <FeatureList
                    items={[
                      "Atendimento com IA 24/7",
                      "Qualificação automática de leads",
                      "Agendamentos e lembretes",
                      "Catálogo, orçamento e pagamento",
                      "Transferência para humano",
                      "Disparos e campanhas segmentadas",
                    ]}
                  />
                </div>
              </div>
              <div className="mt-auto">
                <AutomationVisual />
              </div>
            </GlowCard>
          </Reveal>

          <Reveal className="sm:col-span-2 lg:col-span-5" delay={0.1}>
            <GlowCard>
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-ink-950">
                    <Smartphone className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-neutral-300">Criação de Sites</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Sites que impressionam e convertem.
                </h3>
                <p className="mt-3 text-neutral-400">
                  Landing pages, sites institucionais e lojas virtuais com design exclusivo, velocidade de verdade e
                  foco total em transformar visita em contato.
                </p>
                <div className="mt-7">
                  <FeatureList
                    items={[
                      "Design 100% exclusivo",
                      "Rápido e responsivo",
                      "SEO para o Google",
                      "Botão e integração WhatsApp",
                      "Landing pages e lojas",
                      "Domínio, hospedagem e SSL",
                    ]}
                  />
                </div>
              </div>
              <div className="mt-auto">
                <WebsiteVisual />
              </div>
            </GlowCard>
          </Reveal>

          {extras.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} className="lg:col-span-4" delay={0.05 * i}>
              <GlowCard>
                <div className="flex h-full flex-col p-6 sm:p-7">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lynx-300">
                    <Icon className="size-[18px]" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <ButtonLink href={whatsappLink("Olá, Lynx! Quero entender qual serviço é ideal para o meu negócio.")} variant="secondary">
            Não sabe por onde começar? Fale com a gente
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
