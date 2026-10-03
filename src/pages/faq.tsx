import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { FaqExplorer } from "@/components/sections/faq-explorer";
import { QuickReplies } from "@/components/sections/quick-replies";
import { usePageMeta } from "@/lib/use-page-meta";

export default function FaqPage() {
  usePageMeta(
    "Perguntas frequentes",
    "Dúvidas sobre a automação de WhatsApp com IA, criação de sites, preço, prazo e suporte da Lynx. Busque a sua ou pergunte direto no WhatsApp.",
  );
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Antes que você pergunte: <span className="font-serif font-normal italic text-lynx-300">sim, ela fala como gente.</span>
          </>
        }
        description="As dúvidas que mais aparecem, respondidas sem tecniquês. Busque pela palavra ou filtre por assunto."
      />
      <FaqExplorer />
      <QuickReplies />
      <Cta />
    </>
  );
}
