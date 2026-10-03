import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { Spotlight } from "@/components/ui/spotlight";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
        <Spotlight className="-top-40 left-0 md:-top-32 md:left-48" fill="#bdee36" />
        <div className="absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-lynx-400/10 blur-[110px]" />
        <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-lynx relative text-center">
        <motion.nav
          aria-label="Você está em"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-neutral-400 backdrop-blur"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Início
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-lynx-300">{eyebrow}</span>
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="mx-auto mt-6 max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-400"
        >
          {description}
        </motion.p>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
