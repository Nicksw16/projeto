import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Marker Highlight (reapollo via 21st.dev) — portado de Remotion para Motion.
// Um traço de marca-texto limão passa por trás da palavra e o texto troca para escuro.
export function Marker({ children, className, delay = 0.5 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block whitespace-nowrap px-[0.08em]", className)}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.08em] top-[0.18em] -z-0 origin-left rounded-[0.12em] bg-lynx-400"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 18, stiffness: 120, delay }}
      />
      <motion.span
        className="relative"
        initial={reduced ? false : { color: "currentColor" }}
        whileInView={{ color: "#050605" }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: delay + 0.18 }}
      >
        {children}
      </motion.span>
    </span>
  );
}
