import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestionMark, Monitor, MessageCircle, X } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { whatsappLink } from "@/config/site";

// Base: Floating Action Button (motion.dev via 21st.dev) — só no desktop; no celular quem faz esse papel é a barra inferior.
const actions = [
  { label: "Quero automatizar meu WhatsApp", icon: MessageCircle, message: "Olá, Lynx! Quero automatizar o WhatsApp do meu negócio." },
  { label: "Quero um site", icon: Monitor, message: "Olá, Lynx! Quero um site para o meu negócio." },
  { label: "Tenho uma dúvida", icon: MessageCircleQuestionMark, message: "Olá, Lynx! Tenho uma dúvida." },
];

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-7 right-7 z-50 hidden flex-col items-end gap-3 md:flex"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-end gap-2"
              >
                <StatusBadge className="mb-1" />
                {actions.map((action, index) => (
                  <motion.a
                    key={action.label}
                    href={whatsappLink(action.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 16, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 16, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22, delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-ink-800/95 py-2 pl-4 pr-2 text-sm text-white shadow-xl backdrop-blur transition-colors hover:border-lynx-400/40"
                  >
                    {action.label}
                    <span className="flex size-8 items-center justify-center rounded-full bg-lynx-400/15 text-lynx-300">
                      <action.icon className="size-4" />
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar opções de contato" : "Abrir opções de contato no WhatsApp"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex size-14 items-center justify-center rounded-full bg-wa text-white shadow-[0_10px_40px_-8px_rgb(37_211_102/0.7)]"
          >
            {!open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-wa" />}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "wa"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
