import { Comparison } from "@/components/sections/comparison";
import { Cta } from "@/components/sections/cta";
import { HomeHero } from "@/components/sections/home-hero";
import { Logos } from "@/components/sections/logos";
import { NicheDemo } from "@/components/sections/niche-demo";
import { Scroll3D } from "@/components/sections/scroll-3d";
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
        kicker="Agora mesmo, no seu WhatsApp…"
        text="Enquanto você dorme, almoça ou atende outro cliente, mensagens chegam. Cada uma sem resposta é um cliente indo embora para o concorrente."
        accents={["sem", "resposta"]}
      />
      {/* A virada: depois de "cada mensagem sem resposta…", o celular acende às 23h47 e a IA responde. */}
      <Scroll3D />
      <Comparison />
      <NicheDemo />
      <SolutionStack />
      <Stats />
      <Cta />
    </>
  );
}
