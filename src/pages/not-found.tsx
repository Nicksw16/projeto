import { ArrowLeft } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/page-hero";
import { whatsappLink } from "@/config/site";
import { usePageMeta } from "@/lib/use-page-meta";

export default function NotFoundPage() {
  usePageMeta("Página não encontrada");
  return (
    <div className="min-h-[70vh]">
      <PageHero
        eyebrow="404"
        title={
          <>
            Essa página <span className="font-serif font-normal italic text-lynx-300">sumiu.</span>
          </>
        }
        description="O link pode estar errado ou a página mudou de lugar. Mas a gente continua por aqui."
      >
        <ButtonLink href="/" size="lg">
          <ArrowLeft className="size-4" />
          Voltar ao início
        </ButtonLink>
        <ButtonLink href={whatsappLink("Olá, Lynx! Cheguei numa página que não existe 😅")} variant="secondary" size="lg">
          <WhatsAppIcon className="size-4" />
          Falar no WhatsApp
        </ButtonLink>
      </PageHero>
    </div>
  );
}
