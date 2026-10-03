import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet } from "react-router";

import { BottomNav } from "@/components/layout/bottom-nav";
import { FloatingWhatsApp } from "@/components/sections/floating-whatsapp";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { withLeadContext } from "@/lib/lead";
import { EASE } from "@/lib/motion";

// Congela o conteúdo da página que está saindo para a animação de saída não mostrar a página nova.
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function SiteLayout() {
  const location = useLocation();

  // Todo link de WhatsApp do site leva junto a página de origem e o negócio escolhido nas demos.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (anchor?.href.startsWith("https://wa.me/")) anchor.href = withLeadContext(anchor.href, location.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [location.pathname]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[100] rounded-full bg-lynx-400 px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
        <motion.main
          id="conteudo"
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <FrozenOutlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
      <BottomNav />
    </>
  );
}
