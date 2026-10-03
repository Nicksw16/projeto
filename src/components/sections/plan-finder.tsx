import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, SectionHeading } from "@/components/reveal";
import { plans } from "@/components/sections/pricing";
import { whatsappLink } from "@/config/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Base: Product Finder Quiz (21st.dev) — 3 perguntas, cada resposta pontua os planos e traz um motivo.

type PlanId = (typeof plans)[number]["id"];
type Choice = { label: string; score: Partial<Record<PlanId, number>>; reason?: string };

const questions: { q: string; choices: Choice[] }[] = [
  {
    q: "Hoje, o que mais te incomoda?",
    choices: [
      {
        label: "Demoro para responder no WhatsApp",
        score: { automacao: 2, combo: 1 },
        reason: "Você perde tempo (e cliente) respondendo mensagem por mensagem.",
      },
      {
        label: "Pouca gente me encontra ou confia em mim na internet",
        score: { site: 2, combo: 1 },
        reason: "Você precisa ser encontrado e passar confiança antes do primeiro contato.",
      },
      {
        label: "Um pouco dos dois",
        score: { combo: 3 },
        reason: "O problema está tanto em atrair quanto em atender.",
      },
    ],
  },
  {
    q: "Você já tem site?",
    choices: [
      { label: "Não tenho", score: { site: 1, combo: 1 }, reason: "Sem site, o cliente não tem onde conhecer seu negócio antes de chamar." },
      { label: "Tenho, mas não traz contato", score: { site: 1, combo: 1 }, reason: "Seu site atual não está convertendo visita em conversa." },
      { label: "Tenho e funciona bem", score: { automacao: 2 }, reason: "Seu site já cumpre o papel; o gargalo está no atendimento." },
    ],
  },
  {
    q: "Quantas mensagens chegam por dia?",
    choices: [
      { label: "Até 10", score: { site: 1 }, reason: "Com poucas mensagens, o primeiro passo é trazer mais gente." },
      { label: "De 10 a 50", score: { automacao: 1, combo: 1 } },
      { label: "Mais de 50", score: { automacao: 2, combo: 1 }, reason: "Com esse volume, responder tudo na mão vira um segundo emprego." },
    ],
  },
];

const TIE_ORDER: PlanId[] = ["combo", "automacao", "site"];

function recommend(answers: number[]) {
  const total: Record<PlanId, number> = { site: 0, combo: 0, automacao: 0 };
  answers.forEach((a, qi) => {
    const s = questions[qi].choices[a].score;
    (Object.keys(s) as PlanId[]).forEach((k) => (total[k] += s[k] ?? 0));
  });
  const best = TIE_ORDER.reduce((acc, id) => (total[id] > total[acc] ? id : acc), TIE_ORDER[0]);
  return plans.find((p) => p.id === best) ?? plans[1];
}

export function PlanFinder() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const finished = step === questions.length;
  const plan = finished ? recommend(answers) : null;
  const reasons = answers.map((a, qi) => questions[qi].choices[a].reason).filter(Boolean) as string[];

  const message = plan
    ? `Oi, Lynx! Fiz o quiz do site e deu ${plan.name}. ` +
      answers.map((a, qi) => `${questions[qi].q} ${questions[qi].choices[a].label}.`).join(" ") +
      " Pode me explicar como ficaria?"
    : "";

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx">
        <SectionHeading
          eyebrow="Na dúvida?"
          title={
            <>
              Três perguntas e a gente <span className="font-serif font-normal italic text-lynx-300">aponta o caminho.</span>
            </>
          }
          description="Sem cadastro, sem e-mail. É só uma sugestão para começar a conversa."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-2xl">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900 p-6 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-lynx-400/10 blur-3xl" />

            <div className="relative mb-7 flex items-center gap-2" aria-hidden="true">
              {questions.map((_, i) => (
                <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.span
                    className="block h-full origin-left bg-lynx-400"
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!finished ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative"
                >
                  <p className="text-sm text-neutral-500">
                    Pergunta {step + 1} de {questions.length}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{questions[step].q}</h3>
                  <div className="mt-6 grid gap-3">
                    {questions[step].choices.map((c, ci) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setAnswers((prev) => [...prev, ci])}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left text-[15px] text-neutral-200 transition-all hover:border-lynx-400/40 hover:bg-lynx-400/[0.06] hover:text-white"
                      >
                        {c.label}
                        <ArrowRight className="size-4 shrink-0 text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:text-lynx-300" />
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setAnswers((prev) => prev.slice(0, -1))}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-white"
                    >
                      <ArrowLeft className="size-3.5" />
                      Voltar
                    </button>
                  )}
                </motion.div>
              ) : (
                plan && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="relative"
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-lynx-300">
                      <Sparkles className="size-4" />
                      Seu ponto de partida
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-lynx-400 text-ink-950">
                        <plan.icon className="size-6" />
                      </span>
                      <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{plan.name}</h3>
                    </div>
                    <p className="mt-4 text-neutral-400">{plan.description}</p>

                    {reasons.length > 0 && (
                      <ul className="mt-6 grid gap-2.5">
                        {reasons.map((r) => (
                          <li key={r} className="flex items-start gap-3 text-[15px] text-neutral-200">
                            <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-lynx-400/15 text-lynx-300">
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <ButtonLink href={whatsappLink(message)} className="flex-1">
                        <WhatsAppIcon className="size-4" />
                        Conversar sobre o {plan.short}
                      </ButtonLink>
                      <button
                        type="button"
                        onClick={() => setAnswers([])}
                        className={cn(
                          "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 px-5 text-sm font-medium text-neutral-300 transition-colors hover:border-white/25 hover:text-white",
                        )}
                      >
                        <RotateCcw className="size-4" />
                        Refazer
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
