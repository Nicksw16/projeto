import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { usePageMeta } from "@/lib/use-page-meta";

export default function FaqPage() {
  usePageMeta("Perguntas frequentes", "Dúvidas sobre automação de WhatsApp, criação de sites, prazos e suporte da Lynx.");
  return (
    <>
      <PageHero eyebrow="FAQ" title="Perguntas frequentes" description="Tudo o que você precisa saber antes de chamar." />
      <Faq />
      <Cta />
    </>
  );
}
