import { Comparison } from "@/components/sections/comparison";
import { Cta } from "@/components/sections/cta";
import { NicheDemo } from "@/components/sections/niche-demo";
import { Scroll3D } from "@/components/sections/scroll-3d";
import { SolutionStack } from "@/components/sections/solution-stack";
import { Stats } from "@/components/sections/stats";

// Tudo que fica abaixo da primeira tela: carregado depois, para o topo aparecer e responder mais cedo.
export default function HomeRest() {
  return (
    <>
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
