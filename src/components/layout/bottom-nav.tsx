import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ellipsis, Home, MessageSquareText, Tag } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

import { WhatsAppIcon } from "@/components/icons";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: Bottom Nav Bar (arunachalam via 21st.dev) — só no celular, com o WhatsApp no centro, ao alcance do polegar.
const items = [
  { label: "Início", href: "/", icon: Home },
  { label: "Automação", href: "/automacao", icon: MessageSquareText },
  { label: "Planos", href: "/planos", icon: Tag },
];

const more = [
  { label: "Serviços", href: "/servicos" },
  { label: "Processo", href: "/processo" },
  { label: "FAQ", href: "/faq" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Some ao rolar para baixo e volta ao rolar para cima, para não tampar o conteúdo.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMoreOpen(false), [pathname]);

  const tab = (item: (typeof items)[number]) => (
    <NavLink
      key={item.href}
      to={item.href}
      end
      className={({ isActive }) =>
        cn(
          "flex h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors",
          isActive ? "text-lynx-300" : "text-neutral-400",
        )
      }
    >
      <item.icon className="size-5" strokeWidth={2} />
      {item.label}
    </NavLink>
  );

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden"
      animate={{ y: hidden && !moreOpen ? "130%" : "0%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mb-2 overflow-hidden rounded-3xl border border-white/10 bg-ink-850/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            {more.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex h-12 items-center rounded-2xl px-4 text-base",
                  pathname === item.href ? "bg-white/[0.06] text-white" : "text-neutral-300",
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Navegação rápida"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-ink-850/90 p-1.5 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.9)] backdrop-blur-xl"
      >
        {tab(items[0])}
        {tab(items[1])}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a Lynx no WhatsApp"
          className="relative -mt-7 flex size-16 shrink-0 items-center justify-center rounded-full bg-lynx-400 text-ink-950 shadow-[0_8px_30px_-6px_rgb(189_238_54/0.8)] ring-4 ring-ink-950"
        >
          <WhatsAppIcon className="size-7" />
        </a>
        {tab(items[2])}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          className={cn(
            "flex h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium",
            moreOpen || more.some((m) => m.href === pathname) ? "text-lynx-300" : "text-neutral-400",
          )}
        >
          <Ellipsis className="size-5" />
          Mais
        </button>
      </nav>
    </motion.div>
  );
}
