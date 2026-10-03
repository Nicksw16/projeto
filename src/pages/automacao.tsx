import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Automation } from "@/components/sections/automation";
import { Cta } from "@/components/sections/cta";
import { usePageMeta } from "@/lib/use-page-meta";

export default function AutomacaoPage() {
  usePageMeta("Automação de WhatsApp", "Como funciona o chatbot com IA da Lynx: atende, qualifica, agenda e integra com suas ferramentas.");
  return (
    <>
      <PageHero eyebrow="Automação" title="Seu WhatsApp no piloto automático" description="Como a IA da Lynx atende seus clientes." />
      <Automation />
      <NextPage to="/processo" label="Processo" description="Do primeiro oi ao projeto no ar." />
      <Cta />
    </>
  );
}
