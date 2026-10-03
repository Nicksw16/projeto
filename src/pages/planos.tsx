import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Pricing } from "@/components/sections/pricing";
import { usePageMeta } from "@/lib/use-page-meta";

export default function PlanosPage() {
  usePageMeta("Planos", "Planos de site profissional, automação de WhatsApp e o Combo Lynx. Orçamento sob medida.");
  return (
    <>
      <PageHero eyebrow="Planos" title="Escolha por onde começar" description="Todo projeto é personalizado." />
      <Pricing />
      <NextPage to="/faq" label="FAQ" description="Tire suas dúvidas antes de chamar." />
      <Cta />
    </>
  );
}
