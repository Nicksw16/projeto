import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Marker } from "@/components/ui/marker";
import { NotificationStack } from "@/components/ui/notification-stack";
import { Spotlight } from "@/components/ui/spotlight";
import { whatsappLink } from "@/config/site";
import { DUR, EASE } from "@/lib/motion";

// Sobe sem esconder: o título (LCP) nunca começa invisível.
const rise = (delay: number) => ({
  initial: { y: 18 },
  animate: { y: 0 },
  transition: { duration: DUR.slow, delay, ease: EASE },
});

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.slow, delay, ease: EASE },
});

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40 lg:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <Spotlight className="-top-40 left-0 md:-top-24 md:left-40" fill="#bdee36" />
        <div className="absolute right-[-10%] top-1/3 h-[520px] w-[520px] rounded-full bg-lynx-400/10 blur-[120px]" />
        <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-lynx relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.p {...fadeUp(0.05)} className="eyebrow">
            <span className="size-1.5 rounded-full bg-lynx-400 shadow-[0_0_8px_rgb(189_238_54)]" />
            Para clínicas, salões, lojas e restaurantes
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            className="mt-7 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.4rem]"
          >
            Seu cliente chamou às 23h47.{" "}
            <span className="font-serif text-[1.06em] font-normal italic tracking-[-0.02em]">
              <Marker delay={0.9}>Quem respondeu?</Marker>
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-neutral-300">
            A Lynx coloca uma <strong className="font-semibold text-white">inteligência artificial no seu WhatsApp</strong> que
            responde na hora, tira dúvidas e marca horários — e cria o <strong className="font-semibold text-white">site</strong>{" "}
            que leva mais clientes até ela. Dia e noite, sem você parar o que está fazendo.
          </motion.p>

          <motion.div {...fadeUp(0.45)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappLink("Olá, Lynx! Quero ver como fica no meu WhatsApp.")} size="lg">
              <WhatsAppIcon className="size-[18px]" />
              Me mostra como fica no meu WhatsApp
            </ButtonLink>
            <ButtonLink href="/automacao" variant="secondary" size="lg">
              Ver como funciona
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeUp(0.6)} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
            {["Responde 24 horas por dia", "Fala como gente, em português", "Passa para você quando precisa"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-lynx-400/15 text-lynx-300">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...fadeUp(0.35)} className="relative lg:col-span-5">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lynx-400/20 to-emerald-500/15 blur-[90px]" />
          <NotificationStack />
        </motion.div>
      </div>
    </section>
  );
}
