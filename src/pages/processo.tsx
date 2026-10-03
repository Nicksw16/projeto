import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Process } from "@/components/sections/process";
import { usePageMeta } from "@/lib/use-page-meta";

export default function ProcessoPage() {
  usePageMeta("Processo", "As etapas de um projeto com a Lynx, do diagnóstico ao lançamento.");
  return (
    <>
      <PageHero eyebrow="Processo" title="Do primeiro oi ao projeto no ar" description="Um caminho simples e transparente." />
      <Process />
      <NextPage to="/planos" label="Planos" description="Escolha por onde começar." />
      <Cta />
    </>
  );
}
