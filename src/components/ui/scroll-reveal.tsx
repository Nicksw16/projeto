import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Scroll Reveal Image (unlumen via 21st.dev) — a janela se abre de estreita para larga, com o conteúdo
// "afastando a câmera", conforme entra na tela. Aceita qualquer conteúdo em vez de só imagem.
export function ScrollReveal({
  children,
  className,
  height = "min(78vh, 46rem)",
}: {
  children: React.ReactNode;
  className?: string;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] });

  const width = useSpring(useTransform(scrollYProgress, [0, 1], ["58%", "100%"]), { stiffness: 120, damping: 30 });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.25, 1]), { stiffness: 120, damping: 30 });
  const radius = useSpring(useTransform(scrollYProgress, [0.4, 1], [12, 28]), { stiffness: 120, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto overflow-hidden shadow-[0_40px_120px_-30px_rgb(189_238_54/0.25)]", className)}
      style={reduced ? { height, borderRadius: 28 } : { width, height, borderRadius: radius }}
    >
      <motion.div className="h-full w-full origin-top" style={reduced ? undefined : { scale }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
