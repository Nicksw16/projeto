import { Check, FileSearch, Hammer, PenTool, Rocket } from "lucide-react";

import { SectionHeading } from "@/components/reveal";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";

function StepCard({
  icon: Icon,
  text,
  items,
  deliverable,
}: {
  icon: typeof Rocket;
  text: string;
  items: string[];
  deliverable: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-base leading-relaxed text-neutral-400 md:text-lg">{text}</p>
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-ink-800 to-ink-900">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <span className="flex items-center gap-2 text-sm font-medium text-white">
            <Icon className="size-4 text-lynx-300" />
            O que acontece aqui
          </span>
          <span className="rounded-full bg-lynx-400/10 px-2.5 py-1 text-[11px] font-medium text-lynx-300">
            {deliverable}
          </span>
        </div>
        <ul className="grid gap-3 p-5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-300">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-lynx-400 text-ink-950">
                <Check className="size-2.5" strokeWidth={3.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const data: TimelineEntry[] = [
  {
    step: "01",
    title: "Diagnóstico",
    content: (
      <StepCard
        icon={FileSearch}
        text="Entendemos seu negócio, seu público e onde você está perdendo clientes hoje — no site, no atendimento ou nos dois."
        items={["Conversa sobre objetivos", "Análise do atendimento atual", "Mapeamento de oportunidades", "Proposta clara e sem letras miúdas"]}
        deliverable="Proposta"
      />
    ),
  },
  {
    step: "02",
    title: "Estratégia & Design",
    content: (
      <StepCard
        icon={PenTool}
        text="Desenhamos a experiência completa: as telas do site e o roteiro de conversa do seu robô, no tom da sua marca."
        items={["Layout exclusivo do site", "Roteiro e fluxos do chatbot", "Textos pensados para converter", "Sua aprovação em cada etapa"]}
        deliverable="Protótipo"
      />
    ),
  },
  {
    step: "03",
    title: "Desenvolvimento",
    content: (
      <StepCard
        icon={Hammer}
        text="Colocamos tudo de pé com tecnologia moderna: site rápido e responsivo, IA treinada e integrações conectadas."
        items={["Site otimizado e responsivo", "IA treinada com seu conteúdo", "Integrações com suas ferramentas", "Testes em cenários reais"]}
        deliverable="Versão de testes"
      />
    ),
  },
  {
    step: "04",
    title: "Lançamento & evolução",
    content: (
      <StepCard
        icon={Rocket}
        text="Publicamos, acompanhamos os primeiros resultados e seguimos ajustando para o seu projeto performar cada vez melhor."
        items={["Publicação e configuração final", "Treinamento da sua equipe", "Acompanhamento pós-lançamento", "Melhorias contínuas"]}
        deliverable="No ar 🚀"
      />
    ),
  },
];

export function Process() {
  return (
    <section id="processo" className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Nosso processo"
          title={
            <>
              Do primeiro “oi” ao projeto <span className="font-serif font-normal italic text-lynx-300">no ar.</span>
            </>
          }
          description="Um caminho simples e transparente, com você por dentro de cada etapa. Sem jargão técnico, sem surpresas."
        />
        <div className="md:-mt-6">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  );
}
