import { ArrowDown } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { AutomationSteps } from "@/components/sections/automation-steps";
import { Cta } from "@/components/sections/cta";
import { IntegrationsOrbit } from "@/components/sections/integrations-orbit";
import { NicheDemo } from "@/components/sections/niche-demo";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { TriggerRecipes } from "@/components/sections/trigger-recipes";
import { UsVsThem } from "@/components/sections/us-vs-them";
import { whatsappLink } from "@/config/site";
import { usePageMeta } from "@/lib/use-page-meta";

export default function AutomacaoPage() {
  usePageMeta(
    "Automação de WhatsApp com IA",
    "A IA da Lynx atende na hora, entende texto livre, agenda, anota pedidos e chama sua equipe quando precisa. Veja como funciona e calcule o tempo que você gasta hoje.",
  );
  return (
    <>
      <PageHero
        eyebrow="Automação"
        title={
          <>
            Ela atende, entende e agenda. <span className="font-serif font-normal italic text-lynx-300">Você só confirma.</span>
          </>
        }
        description="Uma IA treinada com as informações do seu negócio, respondendo no seu WhatsApp a qualquer hora, do jeito que uma boa atendente responderia."
      >
        <ButtonLink href={whatsappLink("Oi, Lynx! Quero a automação com IA no meu WhatsApp. Como funciona?")} size="lg">
          <WhatsAppIcon className="size-[18px]" />
          Quero isso no meu WhatsApp
        </ButtonLink>
        <ButtonLink href="#calculadora" variant="secondary" size="lg">
          Calcular meu tempo
          <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
        </ButtonLink>
      </PageHero>

      <AutomationSteps />

      <NicheDemo
        eyebrow="No seu tipo de negócio"
        title={
          <>
            Mesma IA, <span className="font-serif font-normal italic text-lynx-300">conversas diferentes.</span>
          </>
        }
        description="Ela aprende os serviços, os preços e o jeito de falar do seu negócio. Escolha um exemplo e veja a conversa acontecer."
      />

      <TriggerRecipes />

      <UsVsThem
        eyebrow="Não é robô de menu"
        title={
          <>
            Esqueça o <span className="font-serif font-normal italic text-lynx-300">“digite 1 para preços”.</span>
          </>
        }
        description="Muita gente já teve experiência ruim com chatbot. Por isso a diferença precisa ficar clara."
        us={{
          title: "IA da Lynx",
          description: "Entende o que o cliente escreveu e resolve a conversa.",
          points: [
            "Entende o cliente escrevendo do jeito dele",
            "Responde com as informações do seu negócio",
            "Marca horário e anota pedido na própria conversa",
            "Sabe a hora de chamar uma pessoa",
            "Fala no tom da sua marca",
          ],
          cta: { label: "Quero ver a IA no meu negócio", href: whatsappLink("Oi, Lynx! Quero ver como a IA responderia no meu negócio.") },
        }}
        them={{
          title: "Robô de menu",
          description: "“Digite 1 para preços, 2 para horários…”",
          points: [
            "Cliente precisa ler e escolher números",
            "Pergunta fora do menu trava a conversa",
            "Volta para o começo quando não entende",
            "Só manda texto pronto, não resolve nada",
            "Parece máquina, e o cliente percebe",
          ],
        }}
      />

      <IntegrationsOrbit />
      <RoiCalculator />

      <NextPage to="/processo" label="Processo" description="Do primeiro “oi” ao robô no ar, sem você virar técnico." />
      <Cta />
    </>
  );
}
