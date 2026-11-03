import { lazy, Suspense, useEffect, useState } from "react";

import { HomeHero } from "@/components/sections/home-hero";
import { Logos } from "@/components/sections/logos";
import { ScrollWordReveal } from "@/components/ui/scroll-word-reveal";
import { usePageMeta } from "@/lib/use-page-meta";

const HomeRest = lazy(() => import("@/pages/home-rest"));

// Capítulo 1 — "A mensagem das 23h47": problema → virada → prova → solução → ação.
export default function HomePage() {
  usePageMeta(null);
  const showRest = useIdle();
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
      <Suspense fallback={<div className="min-h-[200vh]" aria-hidden="true" />}>{showRest && <HomeRest />}</Suspense>
    </>
  );
}

// Fica true após 1,5 s ou no primeiro toque/rolagem/tecla, o que vier primeiro. Antes disso a parte de baixo
// mostra só o espaço reservado (a rolagem dispara a montagem na hora).
function useIdle() {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const go = () => setIdle(true);
    const events = ["pointerdown", "scroll", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const id = window.setTimeout(go, 1500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(id);
    };
  }, []);
  return idle;
}
