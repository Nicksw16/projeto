import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { YourPart } from "@/components/sections/your-part";
import { whatsappLink } from "@/config/site";
import { usePageMeta } from "@/lib/use-page-meta";

export default function ProcessoPage() {
  usePageMeta(
    "Como funciona",
    "Os cinco passos de um projeto com a Lynx, do primeiro “oi” ao site e à IA no ar. Em cada etapa, o que a Lynx faz e o pouco que depende de você.",
  );
  return (
    <>
      <PageHero
        eyebrow="Processo"
        title={
          <>
            Do primeiro “oi” ao robô no ar, <span className="font-serif font-normal italic text-lynx-300">sem você virar técnico.</span>
          </>
        }
        description="Você conta como seu negócio funciona. A gente cuida da parte chata: tecnologia, configuração, testes e ajustes."
      >
        <ButtonLink href={whatsappLink("Oi, Lynx! Quero começar. Como é o primeiro passo?")} size="lg">
          <WhatsAppIcon className="size-[18px]" />
          Começar pelo passo 1
        </ButtonLink>
        <ButtonLink href="/planos" variant="secondary" size="lg">
          Ver planos
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </PageHero>

      <HowItWorks />
      <YourPart />

      <NextPage to="/planos" label="Planos" description="Três caminhos. Escolha onde a sua história começa." />
      <Cta />
    </>
  );
}
