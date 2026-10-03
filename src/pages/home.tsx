import { Comparison } from "@/components/sections/comparison";
import { Cta } from "@/components/sections/cta";
import { HomeHero } from "@/components/sections/home-hero";
import { Logos } from "@/components/sections/logos";
import { NicheDemo } from "@/components/sections/niche-demo";
import { SolutionStack } from "@/components/sections/solution-stack";
import { Stats } from "@/components/sections/stats";
import { ScrollWordReveal } from "@/components/ui/scroll-word-reveal";
import { usePageMeta } from "@/lib/use-page-meta";

// Capítulo 1 — "A mensagem das 23h47": problema → virada → prova → solução → ação.
export default function HomePage() {
  usePageMeta(null);
  return (
    <>
      <HomeHero />
      <Logos />
      <ScrollWordReveal
        kicker="Enquanto isso, no seu WhatsApp…"
        text="Enquanto você dorme, almoça ou atende outro cliente, mensagens chegam. Cada uma sem resposta é um cliente indo embora para o concorrente."
        accents={["sem", "resposta"]}
      />
      <Comparison />
      <NicheDemo />
      <SolutionStack />
      <Stats />
      <Cta />
    </>
  );
}
