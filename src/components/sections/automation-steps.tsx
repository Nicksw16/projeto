import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { BellRing, CalendarCheck, Check, FileSpreadsheet, MessageCircle, Sparkles, UserRound, Zap } from "lucide-react";

import { SectionHeading } from "@/components/reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Conceito do Sticky Content Wrapper (21st.dev), portado para motion: texto rola à esquerda, a tela fixa à direita troca junto.

const steps = [
  {
    icon: MessageCircle,
    kicker: "01 · Atende",
    title: "Responde na hora, até de madrugada.",
    text: "Mensagem às 23h47, no domingo ou no meio do seu expediente lotado: a resposta sai em segundos, com o tom do seu negócio.",
  },
  {
    icon: Sparkles,
    kicker: "02 · Entende",
    title: "Lê o que a pessoa escreveu, do jeito que ela escreveu.",
    text: "Nada de “digite 1 para preços”. O cliente escreve normal, com erro de digitação e tudo, e a IA entende o que ele quer.",
  },
  {
    icon: CalendarCheck,
    kicker: "03 · Resolve",
    title: "Agenda, anota o pedido e manda o lembrete.",
    text: "Marca o horário na sua agenda, registra o pedido na planilha e avisa o cliente um dia antes. Sem você digitar nada.",
  },
  {
    icon: UserRound,
    kicker: "04 · Chama você",
    title: "Passa para sua equipe quando precisa de gente.",
    text: "Reclamação, pedido especial ou cliente que quer falar com uma pessoa: você recebe o resumo da conversa e assume dali.",
  },
];

function Bubble({ from, children, time }: { from: "client" | "bot"; children: React.ReactNode; time: string }) {
  return (
    <div className={cn("flex", from === "client" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug text-neutral-100",
          from === "client" ? "rounded-tr-md bg-[#005c4b]" : "rounded-tl-md bg-[#202c33]",
        )}
      >
        {children}
        <span className="mt-1 block text-right text-[10px] text-white/50">{time}</span>
      </div>
    </div>
  );
}

function VisualAtende() {
  return (
    <div className="flex flex-col gap-3">
      <Bubble from="client" time="23:47">
        Oi, vocês abrem sábado?
      </Bubble>
      <Bubble from="bot" time="23:47">
        Abrimos sim! Das 9h às 14h 😊 Quer que eu já reserve um horário pra você?
      </Bubble>
      <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full border border-lynx-400/25 bg-lynx-400/10 px-3 py-1.5 text-xs font-medium text-lynx-200">
        <Zap className="size-3.5" />
        Respondido em 2 segundos
      </div>
    </div>
  );
}

function VisualEntende() {
  const tags = [
    ["Serviço", "unha + sobrancelha"],
    ["Quando", "depois das 18h"],
    ["Quer", "agendar"],
  ];
  return (
    <div className="flex flex-col gap-4">
      <Bubble from="client" time="10:12">
        queria fazer as unha e a sobrancelha mas so consigo dps do trabalho
      </Bubble>
      <div className="rounded-2xl border border-white/[0.08] bg-ink-950/60 p-4">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
          <Sparkles className="size-3.5 text-lynx-300" />O que a IA entendeu
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {tags.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.15, duration: 0.4, ease: EASE }}
              className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-sm"
            >
              <span className="text-neutral-400">{k}</span>
              <span className="font-medium text-lynx-200">{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualResolve() {
  const items = [
    { icon: CalendarCheck, title: "Horário marcado", detail: "Qui, 18:30 · Unha + sobrancelha" },
    { icon: FileSpreadsheet, title: "Anotado na planilha", detail: "Cliente, serviço e telefone" },
    { icon: BellRing, title: "Lembrete agendado", detail: "Quarta, 18:30 · pede confirmação" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ icon: Icon, title, detail }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.18, duration: 0.45, ease: EASE }}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-ink-950/60 p-3.5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lynx-400 text-ink-950">
            <Icon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-white">{title}</span>
            <span className="block truncate text-[13px] text-neutral-400">{detail}</span>
          </span>
          <Check className="size-4 shrink-0 text-lynx-300" strokeWidth={3} />
        </motion.div>
      ))}
    </div>
  );
}

function VisualChama() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-950/60 p-4">
      <div className="flex items-center gap-3">
        <span className="relative flex size-10 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
          <BellRing className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-400" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Atendimento humano pedido</p>
          <p className="text-[13px] text-neutral-400">Marina · há 1 min</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-white/[0.04] p-3 text-[13px] leading-relaxed text-neutral-300">
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">Resumo da conversa</span>
        Pedido #482 chegou com um item faltando. Cliente quer troca ou reembolso e prefere falar com uma pessoa.
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="flex h-10 items-center justify-center rounded-full bg-lynx-400 text-sm font-medium text-ink-950">Assumir conversa</span>
        <span className="flex h-10 items-center justify-center rounded-full border border-white/10 text-sm text-neutral-300">Ver histórico</span>
      </div>
    </div>
  );
}

const visuals = [VisualAtende, VisualEntende, VisualResolve, VisualChama];

function Screen({ index }: { index: number }) {
  const Visual = visuals[index];
  const step = steps[index];
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-ink-800 to-ink-900 p-5 shadow-[0_40px_120px_-50px_rgb(189_238_54/0.35)] sm:p-7">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400">
          <step.icon className="size-4 text-lynx-300" />
          {step.kicker}
        </span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">Simulação</span>
      </div>
      <div className="relative">
        <Visual />
      </div>
    </div>
  );
}

export function AutomationSteps() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  // O passo ativo é o que está cruzando o meio da tela (mais estável que observar cada item em rolagens rápidas).
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Como ela trabalha"
          title={
            <>
              Quatro coisas que ela faz <span className="font-serif font-normal italic text-lynx-300">enquanto você trabalha.</span>
            </>
          }
          description="Role a página e acompanhe uma mensagem do começo ao fim."
        />

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <ol ref={listRef} className="flex flex-col gap-14 md:gap-0">
            {steps.map((step, i) => (
              <li key={step.kicker} className="flex flex-col justify-center md:min-h-[70vh]">
                <motion.div
                  animate={{ opacity: active === i ? 1 : 0.35 }}
                  transition={{ duration: 0.4 }}
                  className="max-md:!opacity-100"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-lynx-300">
                    <step.icon className="size-4" />
                    {step.kicker}
                  </span>
                  <h3 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg">{step.text}</p>
                </motion.div>
                {/* No celular a tela aparece logo abaixo de cada passo */}
                <div className="mt-6 md:hidden">
                  <Screen index={i} />
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden md:block">
            <div className="sticky top-0 flex h-screen items-center">
              <div className="w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <Screen index={active} />
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
                  {steps.map((s, i) => (
                    <span
                      key={s.kicker}
                      className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-lynx-400" : "w-1.5 bg-white/15")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
