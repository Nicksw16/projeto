import { NextPage } from "@/components/layout/next-page";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Cta } from "@/components/sections/cta";
import { PlanCompare } from "@/components/sections/plan-compare";
import { PlanFinder } from "@/components/sections/plan-finder";
import { Pricing } from "@/components/sections/pricing";
import { Accordion } from "@/components/ui/accordion";
import { usePageMeta } from "@/lib/use-page-meta";

const priceFaq = [
  {
    id: "por-que",
    title: "Por que vocês não mostram o preço?",
    content:
      "Porque cada negócio pede uma coisa. Um site de uma página é bem diferente de um site com várias seções, e uma IA que só tira dúvidas é diferente de uma que agenda e conversa com três sistemas. Com preço fixo, ou quem precisa de pouco pagaria demais, ou quem precisa de mais receberia de menos.",
  },
  {
    id: "como",
    title: "Como chego no valor do meu projeto?",
    content:
      "Você conta no WhatsApp o que precisa, a gente faz as perguntas certas e manda uma proposta por escrito com escopo, prazo e valor. Sem compromisso: se não fizer sentido para você, tudo bem.",
  },
  {
    id: "recorrente",
    title: "Tem custo mensal?",
    content:
      "A proposta separa o que é pago uma vez (a criação) do que é recorrente, quando existe, como hospedagem, a API oficial do WhatsApp ou suporte. Você vê tudo antes de decidir, sem taxa escondida.",
  },
  {
    id: "depois",
    title: "Posso começar por um e adicionar o outro depois?",
    content:
      "Pode. Dá para começar pelo site ou pela automação e juntar os dois mais tarde. O projeto já nasce pensado para isso.",
  },
];

export default function PlanosPage() {
  usePageMeta(
    "Planos",
    "Site Profissional, Automação WhatsApp ou o Combo Lynx. Compare o que vem em cada plano, faça o quiz e peça uma proposta por escrito.",
  );
  return (
    <>
      <PageHero
        eyebrow="Planos"
        title={
          <>
            Três caminhos. <span className="font-serif font-normal italic text-lynx-300">Escolha onde sua história começa.</span>
          </>
        }
        description="Todo projeto é feito para o seu negócio, por isso o valor vem numa proposta por escrito, sem letra miúda."
      />
      <Pricing />
      <PlanFinder />
      <PlanCompare />

      <section className="relative py-24 sm:py-32">
        <div className="container-lynx grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="Sobre o preço"
              title={
                <>
                  Por que <span className="font-serif font-normal italic text-lynx-300">sob consulta?</span>
                </>
              }
              description="A pergunta mais justa de todas. A resposta curta: para você pagar pelo que o seu negócio precisa, nem mais, nem menos."
            />
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <Accordion items={priceFaq} defaultOpen={["por-que"]} />
          </Reveal>
        </div>
      </section>

      <NextPage to="/faq" label="FAQ" description="Antes que você pergunte: sim, ela fala como gente." />
      <Cta />
    </>
  );
}
