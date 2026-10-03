import { Fragment, useRef } from "react";
import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Scroll word reveal (motion.dev via 21st.dev) — adaptado para a rolagem da página, com palavras de destaque.
const REST = 0.14;
const SPAN = 0.8;
const WINDOW = 0.18;

function Word({
  children,
  progress,
  index,
  count,
  reduced,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reduced: boolean;
  accent: boolean;
}) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPAN;
  const end = Math.min(1, start + WINDOW);
  const opacity = useTransform(progress, [start, end], [REST, 1]);
  return (
    <motion.span
      aria-hidden="true"
      style={reduced ? undefined : { opacity }}
      className={cn(accent && "font-serif font-normal italic text-lynx-300")}
    >
      {children}
    </motion.span>
  );
}

export function ScrollWordReveal({
  kicker,
  text,
  accents = [],
  className,
}: {
  kicker: string;
  text: string;
  /** Palavras (exatamente como no texto) que ganham o itálico verde. */
  accents?: string[];
  className?: string;
}) {
  const target = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const words = text.split(" ");

  return (
    <section ref={target} className={cn("relative h-[190vh]", className)} aria-label={text}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container-lynx grid grid-cols-[auto_1fr] gap-6 sm:gap-10">
          <div className="relative w-[2px] overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <motion.span
              className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-lynx-300 to-emerald-400"
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{kicker}</p>
            <p className="mt-6 max-w-5xl text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.6rem]">
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <Word
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reduced={reduced}
                    accent={accents.includes(word)}
                  >
                    {word}
                  </Word>
                  {index < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
