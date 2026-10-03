import { motion, useScroll, useSpring } from "motion/react";

// Base: Scroll Progress (21st.dev). Linha limão fina no topo mostrando quanto falta da página.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-lynx-300 to-emerald-400"
      style={{ scaleX }}
    />
  );
}
