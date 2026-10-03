import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/reveal";
import { ConceptSite } from "@/components/sections/concept-site";
import { Cta } from "@/components/sections/cta";
import { Differentials } from "@/components/sections/services";
import { UsVsThem } from "@/components/sections/us-vs-them";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ServicesStack } from "@/components/ui/services-stack";
import { whatsappLink } from "@/config/site";
import { usePageMeta } from "@/lib/use-page-meta";

// Capítulo 2 — "As ferramentas".
export default function ServicosPage() {
  usePageMeta("Serviços", "Automação de WhatsApp com IA e criação de sites sob medida para o seu negócio vender mais.");
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title={
          <>
            Um site que <span className="font-serif font-normal italic text-lynx-300">convence.</span> Um WhatsApp que{" "}
            <span className="font-serif font-normal italic text-lynx-300">responde.</span>
          </>
        }
        description="Duas ferramentas que trabalham juntas: o site traz o cliente e passa confiança, o robô com IA atende na hora e marca o horário. Você escolhe uma — ou as duas."
      >
        <ButtonLink href={whatsappLink("Olá, Lynx! Quero saber qual serviço é ideal para o meu negócio.")} size="lg">
          <WhatsAppIcon className="size-[18px]" />
          Qual é o ideal para mim?
        </ButtonLink>
        <ButtonLink href="/planos" variant="secondary" size="lg">
          Ver planos
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </PageHero>

      <section aria-label="Exemplo de site" className="container-lynx pb-8">
        <Reveal className="mb-6 text-center">
          <span className="eyebrow">Projeto conceito · role para abrir</span>
        </Reveal>
        <ScrollReveal>
          <BrowserFrame url="bloomestetica.com.br">
            <ConceptSite />
          </BrowserFrame>
        </ScrollReveal>
        <p className="mt-5 text-center text-sm text-neutral-500">
          Cada site nasce do zero com a identidade do seu negócio — não da nossa. Este é um projeto conceito, com o WhatsApp
          integrado.
        </p>
      </section>

      <UsVsThem
        eyebrow="O jeito Lynx"
        title={
          <>
            Não é só um site bonito. <span className="font-serif font-normal italic text-lynx-300">É um vendedor.</span>
          </>
        }
        description="O problema não é ter site ou ter WhatsApp — é eles não trabalharem por você."
        us={{
          title: "Com a Lynx",
          description: "Site e atendimento feitos para virar conversa e venda.",
          points: [
            "Site exclusivo, rápido e perfeito no celular",
            "Cada botão leva o cliente direto para o seu WhatsApp",
            "IA responde na hora, de dia e de madrugada",
            "Horários e pedidos anotados sem erro",
            "Gente de verdade acompanhando depois da entrega",
          ],
          cta: { label: "Quero o jeito Lynx", href: whatsappLink("Olá, Lynx! Quero o jeito Lynx no meu negócio.") },
        }}
        them={{
          title: "O jeito comum",
          description: "O que a maioria dos negócios tem hoje.",
          points: [
            "Template genérico, igual ao do concorrente",
            "Site lento que não aparece no Google",
            "WhatsApp respondido só quando sobra tempo",
            "Cliente desiste de esperar e vai embora",
            "Ninguém para chamar quando algo quebra",
          ],
        }}
      />

      <ServicesStack
        eyebrow="O que a Lynx faz por você"
        services={[
          {
            id: "automacao",
            title: "Automação de WhatsApp com IA",
            text: "Um atendente que nunca dorme: a IA aprende sobre o seu negócio, responde dúvidas, qualifica quem tem interesse, marca horários e chama sua equipe só quando realmente precisa.",
          },
          {
            id: "sites",
            title: "Criação de sites",
            text: "Sites e landing pages com design exclusivo, rápidos, prontos para o Google e para o celular — com o WhatsApp integrado para cada visita virar uma conversa.",
          },
        ]}
      />

      <Differentials />
      <NextPage to="/automacao" label="Automação" description="Veja por dentro como a IA atende, entende e agenda." />
      <Cta />
    </>
  );
}
