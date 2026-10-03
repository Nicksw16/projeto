import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Services } from "@/components/sections/services";
import { usePageMeta } from "@/lib/use-page-meta";

export default function ServicosPage() {
  usePageMeta("Serviços", "Automação de WhatsApp com IA e criação de sites sob medida para o seu negócio vender mais.");
  return (
    <>
      <PageHero eyebrow="Serviços" title="O que a Lynx faz" description="Automação de WhatsApp com IA e sites de alta conversão." />
      <Services />
      <NextPage to="/automacao" label="Automação" description="Veja como o robô atende, qualifica e agenda." />
      <Cta />
    </>
  );
}
