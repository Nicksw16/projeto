import { createContext, type HTMLAttributes, type PropsWithChildren, useContext, useRef } from "react";
import { type MotionValue, motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Stacking Cards (Khoa Phan / danielpetho via 21st.dev) — cartões que fixam e encolhem uns sobre os outros.
const Ctx = createContext<{ progress: MotionValue<number>; totalCards: number; scaleMultiplier: number } | null>(null);

export default function StackingCards({
  children,
  className,
  totalCards,
  scaleMultiplier = 0.04,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>> & { totalCards: number; scaleMultiplier?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <Ctx.Provider value={{ progress: scrollYProgress, totalCards, scaleMultiplier }}>
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function StackingCardItem({
  index,
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>> & { index: number }) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("StackingCardItem precisa estar dentro de StackingCards");
  const { progress, totalCards, scaleMultiplier } = ctx;
  const scale = useTransform(progress, [index * (1 / totalCards), 1], [1, 1 - (totalCards - index) * scaleMultiplier]);
  return (
    <div className={cn("sticky top-0", className)} {...props}>
      <motion.div className="relative origin-top" style={{ top: `calc(${12 + index * 3}vh)`, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
