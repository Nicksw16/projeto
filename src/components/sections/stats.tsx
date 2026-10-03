import { Reveal } from "@/components/reveal";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { prefix: "", value: 24, suffix: "/7", label: "Atendimento sem pausa", detail: "Feriados e madrugadas inclusos" },
  { prefix: "<", value: 5, suffix: "s", label: "Para responder", detail: "Cliente atendido na hora" },
  { prefix: "", value: 100, suffix: "%", label: "Sob medida", detail: "Projetos feitos para o seu negócio" },
  { prefix: "", value: 0, suffix: "", label: "Templates genéricos", detail: "Design exclusivo, sempre", down: true },
];

export function Stats() {
  return (
    <section aria-label="Números" className="relative py-12 sm:py-16">
      <div className="container-lynx">
        <Reveal>
          <div className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900/70 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="relative border-white/[0.06] p-6 sm:p-8 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r"
              >
                <p className="flex items-baseline text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
                  {stat.prefix && <span className="mr-1 text-3xl text-lynx-300 sm:text-4xl">{stat.prefix}</span>}
                  <NumberTicker value={stat.down ? 100 : stat.value} direction={stat.down ? "down" : "up"} delay={0.15 * i} />
                  {stat.suffix && <span className="text-lynx-300">{stat.suffix}</span>}
                </p>
                <p className="mt-3 text-sm font-medium text-neutral-200 sm:text-base">{stat.label}</p>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{stat.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
