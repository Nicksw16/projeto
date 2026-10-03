import { ArrowRight, Check, X } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { LynxMark } from "@/components/logo";
import { Reveal, SectionHeading } from "@/components/reveal";

// Base: Us vs Them Comparison (olewandowski1 via 21st.dev) — reestilizado para a Lynx.
export function UsVsThem({
  eyebrow,
  title,
  description,
  us,
  them,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  us: { title: string; description: string; points: string[]; cta: { label: string; href: string } };
  them: { title: string; description: string; points: string[] };
}) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          <Reveal>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-lynx-400/30 bg-gradient-to-b from-ink-700 to-ink-900 shadow-[0_30px_100px_-40px_rgb(189_238_54/0.4)]">
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-lynx-400/15 blur-3xl" />
              <div className="relative border-b border-white/[0.07] p-7">
                <div className="flex items-center gap-2.5">
                  <LynxMark className="size-6" />
                  <h3 className="text-lg font-semibold text-white">{us.title}</h3>
                  <span className="rounded-full bg-lynx-400 px-2 py-0.5 text-[11px] font-semibold text-ink-950">Recomendado</span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{us.description}</p>
              </div>
              <ul className="relative flex flex-1 flex-col gap-3.5 p-7">
                {us.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-neutral-100">
                    <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-lynx-400 text-ink-950">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="relative border-t border-white/[0.07] p-5">
                <ButtonLink href={us.cta.href} className="w-full">
                  {us.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-[28px] border border-white/[0.07] bg-ink-900/50">
              <div className="border-b border-white/[0.06] p-7">
                <h3 className="text-lg font-semibold text-neutral-400">{them.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{them.description}</p>
              </div>
              <ul className="flex flex-1 flex-col gap-3.5 p-7">
                {them.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-neutral-500">
                    <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-white/[0.06] text-neutral-500">
                      <X className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
