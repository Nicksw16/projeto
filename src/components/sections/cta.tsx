import { ArrowRight, Mail } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { LynxMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { site, whatsappLink } from "@/config/site";

export function Cta() {
  return (
    <section id="contato" className="relative py-16 sm:py-24">
      <div className="container-lynx">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-lynx-400/20 bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            <div className="absolute left-1/2 top-0 h-72 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lynx-400/25 blur-[100px]" />
            <div className="absolute -bottom-40 left-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[100px]" />
            <div className="noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />

            <div className="relative">
              <LynxMark className="mx-auto size-14 drop-shadow-[0_0_24px_rgb(189_238_54/0.5)]" />
              <h2 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl">
                Pronto para colocar seu negócio no <span className="font-serif font-normal italic text-lynx-300">modo Lynx?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
                Conte o que você precisa e receba uma proposta por escrito, feita para o seu negócio. Sem compromisso, sem enrolação.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href={whatsappLink("Olá, Lynx! Quero colocar meu negócio no modo Lynx 🚀")} size="lg">
                  <WhatsAppIcon className="size-[18px]" />
                  Chamar no WhatsApp
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                {site.email && (
                  <ButtonLink href={`mailto:${site.email}`} variant="secondary" size="lg">
                    <Mail className="size-4" />
                    {site.email}
                  </ButtonLink>
                )}
              </div>
              <StatusBadge className="mt-8" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
