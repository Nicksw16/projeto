import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { nav, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu do celular ao trocar de página.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-4",
          scrolled || open
            ? "border-white/10 bg-ink-900/75 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
        aria-label="Principal"
      >
        <Link to="/" className="rounded-full px-2 py-1" aria-label="Lynx — página inicial">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "relative block rounded-full px-4 py-2 text-sm transition-colors",
                    isActive ? "text-white" : "text-neutral-400 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href={whatsappLink()} className="hidden h-10 sm:inline-flex">
            <WhatsAppIcon className="size-4" />
            Fale conosco
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-white/10 bg-ink-900/95 p-3 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {[{ label: "Início", href: "/" }, ...nav].map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg transition-colors hover:bg-white/[0.05]",
                        isActive ? "bg-white/[0.06] text-white" : "text-neutral-300",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span className="size-2 rounded-full bg-lynx-400 shadow-[0_0_10px_rgb(189_238_54)]" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ButtonLink href={whatsappLink()} size="lg" className="mt-2 w-full">
              <WhatsAppIcon className="size-4" />
              Falar no WhatsApp
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
