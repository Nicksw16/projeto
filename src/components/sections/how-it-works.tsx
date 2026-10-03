import { motion, useReducedMotion } from "motion/react";
import { Pin } from "lucide-react";

import { LynxMark } from "@/components/logo";
import { SectionHeading } from "@/components/reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Base: How It Works (21st.dev) — cartões fixados com alfinete, ligados por um caminho tracejado animado.

const steps = [
  {
    title: "Você manda um “oi”",
    lynx: "Responde, entende como seu negócio funciona e onde está o gargalo.",
    you: "Conta como atende hoje. Pode ser por áudio.",
  },
  {
    title: "Proposta por escrito",
    lynx: "Desenha o site e/ou a conversa da IA, com escopo, prazo e valor no papel.",
    you: "Lê, tira as dúvidas e aprova.",
  },
  {
    title: "Mão na massa",
    lynx: "Cria o site, treina a IA com as suas informações e conecta suas ferramentas.",
    you: "Envia logo, fotos, preços e as perguntas que mais recebe.",
  },
  {
    title: "Testes de verdade",
    lynx: "Simula conversas reais e ajusta o tom até a IA soar como o seu negócio.",
    you: "Conversa com a IA e diz o que mudaria.",
  },
  {
    title: "No ar",
    lynx: "Publica, mostra para sua equipe como acompanhar e segue ajustando.",
    you: "Atende os clientes que chegarem.",
  },
];

// Posição de cada cartão no desktop (em % da largura e px do topo) e a inclinação.
const layout = [
  { side: "left", top: 0, rotate: -3 },
  { side: "right", top: 210, rotate: 3.5 },
  { side: "left", top: 430, rotate: -2 },
  { side: "right", top: 650, rotate: 3 },
  { side: "left", top: 870, rotate: -3.5 },
] as const;

// Caminho que serpenteia entre os cartões (viewBox 1000 x 1160).
const PATH =
  "M 250 140 C 250 300, 750 190, 750 350 C 750 520, 250 410, 250 570 C 250 740, 750 630, 750 790 C 750 960, 250 850, 250 1010";

function StepCard({ index, className }: { index: number; className?: string }) {
  const step = steps[index];
  return (
    <div
      className={cn(
        "relative rounded-[24px] border border-white/[0.09] bg-gradient-to-b from-ink-800 to-ink-900 p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      <span className="absolute -top-3.5 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-lynx-400/40 bg-ink-950 text-lynx-300 shadow-[0_0_20px_-4px_rgb(189_238_54/0.6)]">
        <Pin className="size-3.5 rotate-45" />
      </span>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-5xl italic leading-none text-lynx-300">{index + 1}</span>
        <h3 className="text-xl font-semibold tracking-tight text-white">{step.title}</h3>
      </div>
      <dl className="mt-5 grid gap-3 text-[14.5px] leading-relaxed">
        <div className="flex gap-3 rounded-2xl bg-lynx-400/[0.06] p-3">
          <dt className="shrink-0">
            <LynxMark className="mt-0.5 size-5" />
            <span className="sr-only">A Lynx</span>
          </dt>
          <dd className="text-neutral-200">{step.lynx}</dd>
        </div>
        <div className="flex gap-3 rounded-2xl bg-white/[0.03] p-3">
          <dt className="mt-px shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Você</dt>
          <dd className="text-neutral-400">{step.you}</dd>
        </div>
      </dl>
    </div>
  );
}

export function HowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="O caminho"
          title={
            <>
              Cinco passos. <span className="font-serif font-normal italic text-lynx-300">Em cada um, quem faz o quê.</span>
            </>
          }
          description="Sem jargão e sem surpresa: você sabe o que a Lynx está fazendo e o que (pouco) depende de você."
        />

        {/* Desktop: cartões espalhados ligados pelo caminho */}
        <div className="relative mx-auto mt-20 hidden h-[1160px] max-w-5xl md:block">
          <svg viewBox="0 0 1000 1160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d={PATH} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={PATH}
              fill="none"
              stroke="#bdee36"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 14"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              animate={reduced ? undefined : { strokeDashoffset: [0, -144] }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{
                opacity: { duration: 1.2 },
                strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
              }}
              style={{ filter: "drop-shadow(0 0 6px rgb(189 238 54 / 0.5))" }}
            />
          </svg>

          {layout.map((pos, i) => (
            <motion.div
              key={i}
              className={cn("absolute w-[44%]", pos.side === "left" ? "left-[2%]" : "right-[2%]")}
              style={{ top: pos.top }}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: pos.rotate }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <StepCard index={i} />
            </motion.div>
          ))}
        </div>

        {/* Celular: cartões empilhados com o fio tracejado à esquerda */}
        <ol className="relative mt-14 flex flex-col gap-8 pl-6 md:hidden">
          <span className="absolute bottom-6 left-[11px] top-6 border-l-2 border-dashed border-lynx-400/30" aria-hidden="true" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative"
            >
              <StepCard index={i} className={i % 2 ? "rotate-[1deg]" : "-rotate-[1deg]"} />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
