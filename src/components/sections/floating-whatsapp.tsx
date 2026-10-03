import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { WhatsAppIcon } from "@/components/icons";
import { whatsappLink } from "@/config/site";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a Lynx no WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="group fixed bottom-5 right-5 z-50 flex items-center sm:bottom-7 sm:right-7"
        >
          <span className="mr-3 hidden translate-x-2 rounded-full border border-white/10 bg-ink-800/90 px-4 py-2 text-sm text-white opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
            Fale com a gente 👋
          </span>
          <span className="relative flex size-14 items-center justify-center rounded-full bg-wa text-white shadow-[0_10px_40px_-8px_rgb(37_211_102/0.7)]">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-wa" />
            <WhatsAppIcon className="relative size-7" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
