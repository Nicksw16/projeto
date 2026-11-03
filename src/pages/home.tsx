import { lazy, Suspense } from "react";

import { HomeHero } from "@/components/sections/home-hero";
import { Logos } from "@/components/sections/logos";
import { ScrollWordReveal } from "@/components/ui/scroll-word-reveal";
import { usePageMeta } from "@/lib/use-page-meta";

const HomeRest = lazy(() => import("@/pages/home-rest"));

// Capítulo 1 — "A mensagem das 23h47": problema → virada → prova → solução → ação.
export default function HomePage() {
  usePageMeta(null);
  return (
    <>
      <HomeHero />
      <Logos />
      <ScrollWordReveal
        kicker="Agora mesmo, no seu WhatsApp…"
        text="Enquanto você dorme, almoça ou atende outro cliente, mensagens chegam. Cada uma sem resposta é um cliente indo embora para o concorrente."
        accents={["sem", "resposta"]}
      />
      {/* Reserva altura enquanto carrega para a página não pular. */}
      <Suspense fallback={<div className="min-h-[200vh]" aria-hidden="true" />}>
        <HomeRest />
      </Suspense>
    </>
  );
}
