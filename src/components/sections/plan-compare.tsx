import { Check, Minus } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { Reveal, SectionHeading } from "@/components/reveal";
import { plans } from "@/components/sections/pricing";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: Feature Comparison Table (21st.dev) — colunas na ordem Site · Combo · Automação, Combo destacado.

type Cell = boolean | string;

const groups: { name: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    name: "Site",
    rows: [
      { label: "Site com design exclusivo", values: [true, true, false] },
      { label: "Perfeito no celular", values: [true, true, false] },
      { label: "Pronto para o Google", values: [true, true, false] },
      { label: "Domínio, hospedagem e SSL", values: [true, true, false] },
    ],
  },
  {
    name: "Atendimento no WhatsApp",
    rows: [
      { label: "IA respondendo 24 horas", values: [false, true, true] },
      { label: "Agendamentos e lembretes", values: [false, true, true] },
      { label: "Integração com planilha e CRM", values: [false, true, true] },
      { label: "Passa para uma pessoa quando precisa", values: [false, true, true] },
    ],
  },
  {
    name: "Juntos",
    rows: [
      { label: "Botões do site levam ao WhatsApp", values: [true, true, false] },
      { label: "Quem chega pelo site já é atendido", values: [false, true, false] },
      { label: "Suporte", values: ["Incluso", "Prioritário", "Incluso"] },
    ],
  },
];

function Value({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (typeof value === "string") {
    return <span className={cn("text-xs font-medium sm:text-sm", highlight ? "text-lynx-200" : "text-neutral-300")}>{value}</span>;
  }
  return value ? (
    <span
      className={cn(
        "mx-auto flex size-6 items-center justify-center rounded-full",
        highlight ? "bg-lynx-400 text-ink-950" : "bg-white/[0.07] text-lynx-300",
      )}
    >
      <Check className="size-3.5" strokeWidth={3} />
      <span className="sr-only">Incluso</span>
    </span>
  ) : (
    <span className="mx-auto flex size-6 items-center justify-center text-neutral-600">
      <Minus className="size-4" />
      <span className="sr-only">Não incluso</span>
    </span>
  );
}

export function PlanCompare() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Lado a lado"
          title={
            <>
              O que vem em <span className="font-serif font-normal italic text-lynx-300">cada caminho.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">Comparação entre os planos Site Profissional, Combo Lynx e Automação WhatsApp</caption>
              <colgroup>
                <col className="w-[46%] sm:w-[40%]" />
                <col />
                <col className="bg-lynx-400/[0.05]" />
                <col />
              </colgroup>
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th scope="col" className="p-3 text-xs font-medium text-neutral-500 sm:p-5 sm:text-sm">
                    Recurso
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-1 py-3 text-center sm:p-5">
                      <span className={cn("block text-[13px] font-semibold sm:text-base", p.id === "combo" ? "text-lynx-300" : "text-white")}>
                        <span className="sm:hidden">{p.short}</span>
                        <span className="hidden sm:inline">{p.name}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g.name}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="bg-white/[0.02] px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 sm:px-5">
                      {g.name}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-t border-white/[0.05]">
                      <th scope="row" className="p-3 text-[13px] font-normal leading-snug text-neutral-300 sm:px-5 sm:py-4 sm:text-[15px]">
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td key={i} className="px-1 py-3 text-center sm:p-4">
                          <Value value={v} highlight={plans[i].id === "combo"} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
              <tfoot>
                <tr className="border-t border-white/[0.07]">
                  <td className="p-3 sm:p-5" />
                  {plans.map((p) => (
                    <td key={p.id} className="px-1 py-4 text-center sm:p-5">
                      <ButtonLink
                        href={whatsappLink(p.message)}
                        variant={p.id === "combo" ? "primary" : "secondary"}
                        className="h-9 w-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm"
                      >
                        Pedir
                        <span className="hidden sm:inline">proposta</span>
                      </ButtonLink>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
