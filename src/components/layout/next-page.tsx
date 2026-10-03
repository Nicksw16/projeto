import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import { Reveal } from "@/components/reveal";
import { FlipText } from "@/components/ui/flip-link";

// Cartão "próxima página" no fim de cada página interna, para o visitante seguir navegando.
export function NextPage({ to, label, description }: { to: string; label: string; description: string }) {
  return (
    <section className="pb-8 pt-4">
      <div className="container-lynx">
        <Reveal>
          <Link
            to={to}
            className="group relative flex items-center justify-between gap-6 overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900 p-7 transition-colors hover:border-lynx-400/30 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-lynx-400/0 blur-3xl transition-colors duration-500 group-hover:bg-lynx-400/15" />
            <div className="relative">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Próxima página</span>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                <FlipText>{label}</FlipText>
              </p>
              <p className="mt-2 text-sm text-neutral-400 sm:text-base">{description}</p>
            </div>
            <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 group-hover:rotate-45 group-hover:border-lynx-400 group-hover:bg-lynx-400 group-hover:text-ink-950 sm:size-20">
              <ArrowUpRight className="size-6 sm:size-8" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
