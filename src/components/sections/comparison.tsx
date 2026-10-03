import { Check, X } from "lucide-react";

import { LynxMark } from "@/components/logo";
import { Reveal, SectionHeading } from "@/components/reveal";

const rows = [
  { without: "Cliente espera horas por uma resposta", with: "Resposta em segundos, 24 horas por dia" },
  { without: "Mensagens ficam sem resposta à noite e no fim de semana", with: "Todo contato registrado e acompanhado" },
  { without: "Equipe responde as mesmas perguntas o dia todo", with: "Equipe livre para focar em fechar vendas" },
  { without: "Site lento, genérico ou desatualizado", with: "Site rápido, exclusivo e que passa confiança" },
  { without: "Orçamento enviado e esquecido, sem retorno", with: "Lembrete automático que retoma a conversa" },
];

export function Comparison() {
  return (
    <section aria-labelledby="comparativo" className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="A diferença na prática"
          title={
            <span id="comparativo">
              Quanto você perde <span className="font-serif font-normal italic text-lynx-300">sem perceber?</span>
            </span>
          }
          description="Cada mensagem sem resposta é um cliente indo para o concorrente. Veja o que muda quando a Lynx entra no jogo."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[28px] border border-white/[0.07] bg-ink-900/60 p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
                  <X className="size-5" />
                </span>
                <h3 className="text-xl font-semibold text-neutral-300">Sem automação</h3>
              </div>
              <ul className="mt-8 space-y-4">
                {rows.map((row) => (
                  <li key={row.without} className="flex items-start gap-3 text-neutral-500">
                    <X className="mt-0.5 size-4 shrink-0 text-red-400/70" strokeWidth={2.5} />
                    <span className="line-through decoration-white/15">{row.without}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-[28px] border border-lynx-400/25 bg-gradient-to-br from-ink-700 via-ink-850 to-ink-900 p-7 shadow-[0_30px_100px_-40px_rgb(189_238_54/0.4)] sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-lynx-400/15 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-lynx-400/15 ring-1 ring-lynx-400/30">
                  <LynxMark className="size-6" />
                </span>
                <h3 className="text-xl font-semibold text-white">Com a Lynx</h3>
              </div>
              <ul className="relative mt-8 space-y-4">
                {rows.map((row) => (
                  <li key={row.with} className="flex items-start gap-3 text-neutral-100">
                    <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-lynx-400 text-ink-950">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {row.with}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
