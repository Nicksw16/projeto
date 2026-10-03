import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router";

import { SectionHeading } from "@/components/reveal";
import { AutomationVisual, WebsiteVisual } from "@/components/sections/services";
import StackingCards, { StackingCardItem } from "@/components/ui/stacking-cards";

function ProcessVisual() {
  const steps = ["Conversa sobre o seu negócio", "Proposta clara, sem letras miúdas", "Robô e site prontos para testar", "No ar — e a gente segue por perto"];
  return (
    <div className="space-y-2.5 px-6 pb-8 pt-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-ink-800 px-4 py-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lynx-400 text-ink-950">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="text-sm text-neutral-200">{step}</span>
          <span className="ml-auto font-mono text-xs text-neutral-500">0{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

const cards = [
  {
    tag: "Automação de WhatsApp",
    title: "Atende na hora, a qualquer hora.",
    text: "A IA responde em segundos, entende o que o cliente quer, marca horários e só chama você quando precisa de uma pessoa.",
    href: "/automacao",
    cta: "Ver a automação por dentro",
    visual: <AutomationVisual />,
  },
  {
    tag: "Criação de sites",
    title: "Um site que faz o cliente confiar.",
    text: "Bonito, rápido e feito para o seu negócio — com o botão do WhatsApp no lugar certo para virar conversa.",
    href: "/servicos",
    cta: "Conhecer os serviços",
    visual: <WebsiteVisual />,
  },
  {
    tag: "Sem dor de cabeça",
    title: "Você não precisa entender de tecnologia.",
    text: "A gente cuida de tudo: configuração, textos, testes e lançamento. Você só aprova e começa a atender mais.",
    href: "/processo",
    cta: "Ver como trabalhamos",
    visual: <ProcessVisual />,
  },
];

export function SolutionStack() {
  return (
    <section className="relative pt-24 sm:pt-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="A virada"
          title={
            <>
              Seu negócio respondendo <span className="font-serif font-normal italic text-lynx-300">sozinho.</span>
            </>
          }
          description="Três peças que trabalham juntas para nenhuma mensagem ficar sem resposta — e nenhum visitante ir embora sem falar com você."
        />
      </div>
      <StackingCards totalCards={cards.length} className="container-lynx mt-10 pb-[10vh]">
        {cards.map((card, index) => (
          <StackingCardItem key={card.tag} index={index} className="h-[92vh] sm:h-screen">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.9)] md:grid-cols-2">
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="font-mono text-xs text-lynx-400">0{index + 1} — {card.tag}</span>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{card.title}</h3>
                <p className="mt-4 text-neutral-400">{card.text}</p>
                <Link
                  to={card.href}
                  className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-lynx-300 hover:text-lynx-200"
                >
                  {card.cta}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="flex items-center border-t border-white/[0.06] bg-ink-950/40 pt-6 md:border-l md:border-t-0">
                <div className="w-full">{card.visual}</div>
              </div>
            </div>
          </StackingCardItem>
        ))}
      </StackingCards>
    </section>
  );
}
