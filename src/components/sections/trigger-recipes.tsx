import { ArrowDown, BellRing, Clock, FileText, MessageCircle, MessageSquareWarning, PackageCheck, UserRound } from "lucide-react";

import { Reveal, SectionHeading } from "@/components/reveal";

// Base: Trigger to Action card (21st.dev) — regras "Quando → Então" do atendimento automático.

type App = { name: string; logo?: string; icon?: typeof MessageCircle };

const WHATSAPP: App = { name: "WhatsApp", logo: "/logos/whatsapp-icon.svg" };
const AGENDA: App = { name: "Google Agenda", logo: "/logos/google-calendar.svg" };
const PLANILHA: App = { name: "Google Planilhas", logo: "/logos/google-sheets.svg" };
const PAGAMENTO: App = { name: "Mercado Pago", logo: "/logos/mercado-pago.svg" };
const GMAIL: App = { name: "Gmail", logo: "/logos/gmail.svg" };
const EQUIPE: App = { name: "Sua equipe", icon: UserRound };

const recipes: { when: string; whenIcon: typeof MessageCircle; then: string; apps: App[] }[] = [
  {
    when: "Chega mensagem fora do horário",
    whenIcon: Clock,
    then: "Responde na hora e oferece o próximo horário livre",
    apps: [WHATSAPP, AGENDA],
  },
  {
    when: "Cliente pede um orçamento",
    whenIcon: FileText,
    then: "Faz as perguntas certas e anota tudo para você",
    apps: [WHATSAPP, PLANILHA],
  },
  {
    when: "Falta 1 dia para o horário marcado",
    whenIcon: BellRing,
    then: "Manda lembrete e pede confirmação",
    apps: [AGENDA, WHATSAPP],
  },
  {
    when: "Cliente some depois do orçamento",
    whenIcon: MessageCircle,
    then: "Retoma a conversa com um lembrete gentil",
    apps: [WHATSAPP],
  },
  {
    when: "Pedido confirmado",
    whenIcon: PackageCheck,
    then: "Envia o link de pagamento e registra o pedido",
    apps: [PAGAMENTO, PLANILHA],
  },
  {
    when: "Aparece uma reclamação",
    whenIcon: MessageSquareWarning,
    then: "Passa para sua equipe com o resumo da conversa",
    apps: [EQUIPE, GMAIL],
  },
];

function AppTile({ app }: { app: App }) {
  return (
    <span
      title={app.name}
      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
    >
      {app.logo ? (
        <img src={app.logo} alt={app.name} className="size-[18px]" loading="lazy" />
      ) : app.icon ? (
        <app.icon className="size-[18px] text-lynx-300" aria-label={app.name} />
      ) : null}
    </span>
  );
}

export function TriggerRecipes() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Regras do seu jeito"
          title={
            <>
              Quando acontecer isso, <span className="font-serif font-normal italic text-lynx-300">ela faz aquilo.</span>
            </>
          }
          description="Alguns exemplos de regras que a gente monta. As do seu negócio saem da nossa conversa inicial."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r, i) => (
            <Reveal key={r.when} delay={(i % 3) * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-ink-900 p-5 transition-colors duration-300 hover:border-lynx-400/25">
                <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-lynx-400/0 blur-3xl transition-colors duration-500 group-hover:bg-lynx-400/10" />

                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Quando</span>
                  <p className="mt-2 flex items-start gap-2.5 text-[15px] font-medium text-white">
                    <r.whenIcon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                    {r.when}
                  </p>
                </div>

                <div className="relative flex justify-center py-1.5" aria-hidden="true">
                  <span className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-ink-950 text-lynx-300">
                    <ArrowDown className="size-3.5" />
                  </span>
                </div>

                <div className="relative rounded-2xl border border-lynx-400/20 bg-lynx-400/[0.06] p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lynx-300">Então</span>
                  <p className="mt-2 text-[15px] font-medium text-white">{r.then}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {r.apps.map((app) => (
                      <AppTile key={app.name} app={app} />
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
