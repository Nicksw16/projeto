import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, FileCheck2, Headphones, ShieldCheck, ThumbsUp } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, SectionHeading } from "@/components/reveal";
import { whatsappLink } from "@/config/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Base: Onboarding Checklist (21st.dev) — a lista do que depende do cliente, para mostrar que é pouca coisa.

const tasks = [
  { id: "oi", title: "Mandar um “oi” no WhatsApp", detail: "Leva menos de um minuto" },
  { id: "conversa", title: "Contar como você atende hoje", detail: "Uma conversa. Pode ser por áudio" },
  { id: "material", title: "Enviar logo, fotos e lista de preços", detail: "Pelo próprio WhatsApp" },
  { id: "teste", title: "Testar a IA e aprovar o site", detail: "Pelo celular, quando der" },
  { id: "atender", title: "Atender os clientes que chegarem", detail: "Essa parte é a melhor" },
];

const promises = [
  { icon: FileCheck2, title: "Tudo por escrito", text: "Escopo, prazo e valor combinados antes de começar." },
  { icon: ThumbsUp, title: "Você aprova cada etapa", text: "Nada vai ao ar sem o seu ok." },
  { icon: Headphones, title: "Por perto depois da entrega", text: "Ajustes e suporte com gente de verdade." },
  { icon: ShieldCheck, title: "Sem jargão", text: "A gente explica sem tecniquês. Prometido." },
];

function CheckCircle({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
        done ? "border-lynx-400 bg-lynx-400" : "border-white/20",
      )}
    >
      <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="#050605"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: done ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </svg>
    </span>
  );
}

export function YourPart() {
  const [done, setDone] = useState<Set<string>>(() => new Set(["oi"]));
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const progress = done.size / tasks.length;
  const allDone = done.size === tasks.length;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Sua parte é pequena"
            title={
              <>
                Tudo o que depende de você <span className="font-serif font-normal italic text-lynx-300">cabe nesta lista.</span>
              </>
            }
            description="Pode marcar os itens. O resto (domínio, hospedagem, configuração, integrações e treinamento da IA) fica com a gente."
          />
          <Reveal delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-2">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/[0.07] bg-ink-900 p-4">
                <Icon className="size-5 text-lynx-300" />
                <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-neutral-400">{text}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-ink-800 to-ink-900 shadow-[0_40px_120px_-50px_rgb(189_238_54/0.3)]">
            <div className="border-b border-white/[0.07] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Sua lista</p>
                <p className="text-sm tabular-nums text-neutral-400">
                  {done.size} de {tasks.length}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-lynx-400 to-emerald-400"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
            </div>

            <ul className="flex flex-col p-3">
              {tasks.map((t) => {
                const isDone = done.has(t.id);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      onClick={() => toggle(t.id)}
                      className="flex w-full items-center gap-4 rounded-2xl p-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline-none"
                    >
                      <CheckCircle done={isDone} />
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-[15px] font-medium transition-colors duration-300",
                            isDone ? "text-neutral-500 line-through decoration-lynx-400/60" : "text-white",
                          )}
                        >
                          {t.title}
                        </span>
                        <span className="block text-[13px] text-neutral-500">{t.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-white/[0.07] p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={allDone ? "done" : "todo"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4 text-center text-sm text-neutral-400"
                >
                  {allDone ? "Viu? É só isso. O resto é com a gente. 💚" : "Marque tudo e veja como sobra pouco para você."}
                </motion.p>
              </AnimatePresence>
              <ButtonLink href={whatsappLink("Oi, Lynx! Quero começar pelo passo 1: este é o meu “oi” 👋")} className="w-full">
                <WhatsAppIcon className="size-4" />
                Fazer o passo 1 agora
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
