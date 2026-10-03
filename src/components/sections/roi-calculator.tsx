import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Calculator, Info } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, SectionHeading } from "@/components/reveal";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: ROI Pricing Calculator (21st.dev) — reescrito para estimar o tempo que o visitante gasta respondendo WhatsApp.

const WEEKS_PER_MONTH = 4.33;

const fmt = (n: number, digits = 0) => n.toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex overflow-hidden tabular-nums", className)} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {value.split("").map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-neutral-200">
          {label}
          {hint && <span className="mt-0.5 block text-xs font-normal text-neutral-500">{hint}</span>}
        </label>
        <span className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-sm font-semibold tabular-nums text-white">
          {value} <span className="font-normal text-neutral-400">{suffix}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, #bdee36 ${pct}%, rgb(255 255 255 / 0.1) ${pct}%)` }}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-lynx-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-ink-900 [&::-moz-range-thumb]:bg-lynx-300 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-ink-900 [&::-webkit-slider-thumb]:bg-lynx-300 [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(189_238_54/0.6)]"
      />
    </div>
  );
}

export function RoiCalculator() {
  const [messages, setMessages] = useState(40);
  const [minutes, setMinutes] = useState(3);
  const [days, setDays] = useState(6);
  const [repeated, setRepeated] = useState(60);
  const [hourValue, setHourValue] = useState(30);

  const hours = (messages * minutes * days * WEEKS_PER_MONTH) / 60;
  const repeatedHours = (hours * repeated) / 100;
  const workDays = repeatedHours / 8;
  const money = repeatedHours * hourValue;

  const message =
    `Oi, Lynx! Fiz o cálculo no site: recebo umas ${messages} mensagens por dia, levo uns ${minutes} min em cada uma ` +
    `e atendo ${days} dias por semana. Dá ${fmt(hours)}h por mês no WhatsApp, ${fmt(repeatedHours)}h só com perguntas repetidas. ` +
    `Quero ver como a automação ficaria no meu negócio.`;

  return (
    <section id="calculadora" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Faça a conta"
          title={
            <>
              Quanto do seu mês vai embora <span className="font-serif font-normal italic text-lynx-300">respondendo WhatsApp?</span>
            </>
          }
          description="Coloque os seus números. A conta é sua, feita aqui mesmo no navegador."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-5xl">
          <div className="grid overflow-hidden rounded-[32px] border border-white/[0.08] bg-ink-900 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-7 p-6 sm:p-9">
              <Slider label="Mensagens por dia" value={messages} min={5} max={300} step={5} suffix="msgs" onChange={setMessages} />
              <Slider
                label="Tempo para responder cada uma"
                hint="Ler, pensar, digitar, consultar a agenda…"
                value={minutes}
                min={1}
                max={15}
                suffix="min"
                onChange={setMinutes}
              />
              <div>
                <span className="text-sm font-medium text-neutral-200">Dias de atendimento por semana</span>
                <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Dias de atendimento por semana">
                  {[5, 6, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={days === d}
                      onClick={() => setDays(d)}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-medium transition-colors",
                        days === d
                          ? "border-lynx-400/50 bg-lynx-400/15 text-lynx-200"
                          : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white",
                      )}
                    >
                      {d} dias
                    </button>
                  ))}
                </div>
              </div>
              <Slider
                label="Quanto disso é pergunta repetida?"
                hint="Preço, horário, endereço, “tem vaga?”. Use o seu palpite."
                value={repeated}
                min={10}
                max={90}
                step={5}
                suffix="%"
                onChange={setRepeated}
              />
              <div>
                <label htmlFor="hour-value" className="text-sm font-medium text-neutral-200">
                  Quanto vale uma hora sua?
                  <span className="mt-0.5 block text-xs font-normal text-neutral-500">Ou de quem responde por você</span>
                </label>
                <div className="mt-3 flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-lynx-400/50">
                  <span className="text-sm text-neutral-500">R$</span>
                  <input
                    id="hour-value"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={1000}
                    value={hourValue}
                    onChange={(e) => setHourValue(Math.max(0, Math.min(1000, Number(e.target.value) || 0)))}
                    className="h-full w-full bg-transparent px-2 text-sm font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-neutral-500">/hora</span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between gap-8 border-t border-white/[0.07] bg-gradient-to-b from-ink-800 to-ink-900 p-6 sm:p-9 lg:border-l lg:border-t-0">
              <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-lynx-400/10 blur-3xl" />
              <div className="relative">
                <p className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calculator className="size-4 text-lynx-300" />
                  Por mês, você passa
                </p>
                <p className="mt-2 flex items-baseline gap-2 text-6xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
                  <AnimatedNumber value={fmt(hours)} />
                  <span className="text-2xl font-medium tracking-normal text-neutral-400">horas</span>
                </p>
                <p className="mt-1 text-sm text-neutral-400">respondendo mensagens no WhatsApp.</p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-lynx-400/25 bg-lynx-400/[0.07] p-4">
                    <p className="text-sm text-lynx-200">Só com perguntas repetidas</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                      <AnimatedNumber value={`${fmt(repeatedHours)}h`} />
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">É essa parte que a automação pode assumir.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <p className="text-xs text-neutral-400">Isso dá</p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        <AnimatedNumber value={fmt(workDays, 1)} /> <span className="text-sm font-normal text-neutral-400">dias de 8h</span>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <p className="text-xs text-neutral-400">Em tempo, vale</p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        R$ <AnimatedNumber value={fmt(money)} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <ButtonLink href={whatsappLink(message)} className="w-full">
                  <WhatsAppIcon className="size-4" />
                  Mandar esse cálculo no WhatsApp
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-neutral-500">
                  <Info className="mt-px size-3.5 shrink-0" />
                  Estimativa feita só com os números que você colocou. Não é promessa de resultado.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
