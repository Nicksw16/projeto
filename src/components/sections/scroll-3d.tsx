import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

import { LynxMark } from "@/components/logo";
import { CHAT, CONFIRM, PICKED_SLOT, SLOTS, STEPS, SUMMARY } from "@/components/three/chat-script";
import { cn } from "@/lib/utils";

// "O celular das 23h47": a virada da história. Logo depois de "cada mensagem sem resposta é um cliente
// indo embora", o celular do dono acende às 23h47 e a IA da Lynx responde sozinha, conforme a rolagem.
// three.js + anime.js só são baixados quando a seção se aproxima. Enquanto carregam — e em aparelhos sem
// WebGL ou se o 3D falhar — um celular em HTML conta a mesma conversa, também guiado pela rolagem.
// Com "reduzir movimento" fica o celular em HTML, só com trocas suaves (sem giro). Trecho preso: 110svh.

type Mode = "loading" | "ready" | "static";

// Mesma escala de tempo da cena 3D (0–1000 ao longo da passagem da seção pela tela).
const STEP_AT = [190, 352, 405, 545, 650];
// Batidas da conversa no celular em HTML: tela acende, notificação, abre o chat (+ digitando), resposta com
// horários, cliente escolhe, digitando, confirmação, agradecimento, resumo para o dono.
const BEATS = [150, 190, 300, 352, 430, 480, 545, 600, 650];

function hasWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

const countPassed = (marks: number[], t: number) => marks.reduce((n, m) => (t >= m ? n + 1 : n), 0);

function Bubble({
  from,
  children,
  time,
  still,
}: {
  from: "contato" | "ia";
  children: React.ReactNode;
  time: string;
  still: boolean;
}) {
  return (
    <motion.div
      layout={!still}
      initial={still ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-[86%] rounded-lg px-2 py-1",
        from === "ia" ? "self-end rounded-tr-none bg-[#005c4b]" : "self-start rounded-tl-none bg-[#202c33]",
      )}
    >
      {from === "ia" && <span className="block text-[9px] font-semibold text-lynx-300">✦ IA da Lynx</span>}
      {children}
      <span className="block text-right text-[8px] text-white/55">
        {time}
        {from === "ia" && <span className="ml-0.5 text-[#53bdeb]">✓✓</span>}
      </span>
    </motion.div>
  );
}

function Typing({ still }: { still: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1 self-end rounded-lg rounded-tr-none bg-[#005c4b] px-2.5 py-2"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-white/70"
          animate={still ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </motion.div>
  );
}

// Celular em HTML/CSS. `beat` = quantas batidas da conversa já passaram com a rolagem.
function HtmlPhone({ beat, still }: { beat: number; still: boolean }) {
  const show = (n: number) => beat >= n;
  const chatOpen = show(3);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[74/152] w-full rounded-[42px] bg-gradient-to-br from-[#5d665f] via-[#262c27] to-[#3f4741] p-[3px] shadow-[0_50px_120px_-40px_rgb(189_238_54/0.45)]"
    >
      <div className="h-full rounded-[39px] bg-[#030403] p-[6px]">
        <div className="relative h-full overflow-hidden rounded-[33px] bg-[#0b141a] text-[10.5px] leading-snug text-[#e9edef]">
          {/* Tela de bloqueio: acende às 23:47 com a notificação */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center bg-[radial-gradient(ellipse_at_50%_20%,#1d2a22,#050806_70%)] pt-[18%]"
            initial={false}
            animate={{ opacity: chatOpen ? 0 : show(1) ? 1 : 0.25 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[10px] text-white/60">quinta-feira</p>
            <p className="text-[46px] font-light leading-none tracking-tight text-white">23:47</p>
            <AnimatePresence>
              {show(2) && !chatOpen && (
                <motion.div
                  initial={still ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-3 mt-6 flex w-[calc(100%-24px)] items-center gap-2 rounded-2xl bg-white/10 p-2.5 backdrop-blur"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#25d366] text-[13px] text-white">
                    ✆
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] text-white/60">WhatsApp · agora</span>
                    <span className="block font-semibold">Novo contato</span>
                    <span className="block truncate text-white/80">{CHAT[0].text}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Conversa */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            initial={false}
            animate={{ opacity: chatOpen ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-[#1f2c34] px-4 pb-2 pt-6">
              <p className="text-[12px] font-semibold">Novo contato</p>
              <p className="text-[9.5px] text-[#8696a0]">{show(3) && !show(4) ? "IA da Lynx digitando…" : "online"}</p>
            </div>
            <AnimatePresence>
              {show(9) && (
                <motion.div
                  initial={still ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-2 mt-2 flex items-center gap-2 rounded-xl border border-lynx-400/30 bg-ink-900/95 p-2"
                >
                  <LynxMark className="size-5 shrink-0" />
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[9.5px] font-semibold text-lynx-200">{SUMMARY.title}</span>
                    <span className="block text-[9px] text-neutral-400">{SUMMARY.detail}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden p-2.5">
              <p className="mx-auto rounded-md border border-lynx-400/25 bg-lynx-400/10 px-2 py-0.5 text-center text-[8.5px] text-lynx-300">
                Fora do horário · a IA da Lynx responde por você
              </p>
              <AnimatePresence initial={false}>
                {show(3) && (
                  <Bubble key="m0" from="contato" time={CHAT[0].time} still={still}>
                    {CHAT[0].text}
                  </Bubble>
                )}
                {show(3) && !show(4) && <Typing key="t1" still={still} />}
                {show(4) && (
                  <Bubble key="m1" from="ia" time={CHAT[1].time} still={still}>
                    {CHAT[1].text}
                    <span className="mt-1 flex gap-1">
                      {SLOTS.map((s) => (
                        <span
                          key={s}
                          className={cn(
                            "flex-1 rounded-full py-0.5 text-center font-semibold transition-colors duration-300",
                            s === PICKED_SLOT && show(5) ? "bg-lynx-400 text-ink-950" : "bg-white/10",
                          )}
                        >
                          {s}
                        </span>
                      ))}
                    </span>
                  </Bubble>
                )}
                {show(5) && (
                  <Bubble key="m2" from="contato" time={CHAT[2].time} still={still}>
                    {CHAT[2].text}
                  </Bubble>
                )}
                {show(6) && !show(7) && <Typing key="t2" still={still} />}
                {show(7) && (
                  <Bubble key="m3" from="ia" time={CHAT[3].time} still={still}>
                    {CHAT[3].text}
                    <span className="mt-1 block rounded-md border border-lynx-400/30 bg-black/30 px-2 py-1">
                      <span className="block font-semibold text-lynx-200">{CONFIRM.title}</span>
                      <span className="block text-[9px] text-neutral-300">{CONFIRM.detail}</span>
                    </span>
                  </Bubble>
                )}
                {show(8) && (
                  <Bubble key="m4" from="contato" time={CHAT[4].time} still={still}>
                    {CHAT[4].text}
                  </Bubble>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Scroll3D() {
  const reduced = Boolean(useReducedMotion());
  const [mode, setMode] = useState<Mode>("loading");
  const use3D = mode === "ready" && !reduced;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  // Progresso da seção na tela (mesma janela da cena 3D): dirige o celular em HTML quando não há 3D.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const [beat, setBeat] = useState(0);
  const [step, setStep] = useState(-1);
  const use3DRef = useRef(use3D);
  use3DRef.current = use3D;
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (use3DRef.current) return; // com 3D, a própria cena cuida do texto e dos passos
    const t = v * 1000;
    setBeat(countPassed(BEATS, t));
    setStep(countPassed(STEP_AT, t) - 1);
  });
  // Giro leve do celular em HTML conforme a rolagem (sem giro com "reduzir movimento").
  const tilt = useTransform(scrollYProgress, [0.12, 0.72], [-20, -6]);
  const lift = useTransform(scrollYProgress, [0.12, 0.4], [40, 0]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctrl = new AbortController();
    let dispose: (() => void) | null = null;
    const fail = () => {
      setMode("static");
      queueMicrotask(() => dispose?.());
    };
    // Baixa a cena 3D só quando a seção está a ~meia tela de distância (no topo da página ela não pesa).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (!hasWebGL2()) return fail();
        import("@/components/three/phone-scene")
          .then(({ mountPhoneScene }) => {
            const stage = stageRef.current;
            const host = hostRef.current;
            const textBox = textRef.current;
            const anchor = captionRef.current;
            if (ctrl.signal.aborted || !stage || !host || !textBox || !anchor) return null;
            return mountPhoneScene({
              host,
              section,
              stage,
              textBox,
              anchor,
              steps: Array.from(stepsRef.current?.querySelectorAll<HTMLElement>("li") ?? []),
              caption: captionRef.current,
              rail: railRef.current,
              glow: glowRef.current,
              signal: ctrl.signal,
              onReady: () => setMode("ready"),
              onFail: fail,
            });
          })
          .then((d) => {
            if (!d) return;
            if (ctrl.signal.aborted) d();
            else dispose = d;
          })
          .catch(fail);
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(section);
    return () => {
      ctrl.abort();
      io.disconnect();
      dispose?.();
      dispose = null;
    };
  }, [reduced]);

  const htmlStep = Math.max(0, step);

  return (
    <section ref={sectionRef} aria-labelledby="celular-2347" className="relative h-[210svh] overflow-x-clip">
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_55%_50%_at_68%_55%,black,transparent)] max-lg:[mask-image:radial-gradient(ellipse_80%_45%_at_50%_65%,black,transparent)]" />
          <div
            ref={glowRef}
            className="absolute left-[68%] top-[55%] size-[min(720px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(189_238_54/0.16),rgb(37_211_102/0.05)_45%,transparent_68%)] opacity-60 max-lg:left-1/2 max-lg:top-[64%]"
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>

        <div
          ref={hostRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 transition-opacity duration-700", use3D ? "opacity-100" : "opacity-0")}
        />

        <div className="container-lynx relative grid h-full content-start lg:grid-cols-12 lg:content-center lg:items-center">
          <div
            ref={textRef}
            className="relative pt-[76px] lg:col-span-5 lg:pt-0"
            // Sem 3D, o celular em HTML define o "--s3d-chat" aqui; com 3D, a cena define no palco e este herda.
            style={use3D ? undefined : ({ "--s3d-chat": beat >= 3 ? 1 : 0 } as React.CSSProperties)}
          >
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-lynx-400 shadow-[0_0_8px_rgb(189_238_54)]" />
              Simulação · 23h47
            </span>
            <h2
              id="celular-2347"
              className="mt-4 text-balance text-[1.85rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:mt-5 sm:text-5xl lg:text-[3.3rem]"
            >
              23h47. Seu WhatsApp responde{" "}
              <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-lynx-300">sozinho.</span>
            </h2>
            <div className="relative mt-3 sm:mt-5">
              <p className="max-w-md text-pretty text-[15px] leading-relaxed text-neutral-400 transition-opacity duration-300 max-lg:opacity-[calc(1_-_var(--s3d-chat,0))] sm:text-lg">
                Enquanto você dorme, a IA da Lynx atende o cliente, entende o pedido, oferece horários e confirma o
                agendamento — e só chama você quando precisa.
              </p>
              {/* Legenda do passo atual no celular: a cena 3D escreve nesta… */}
              <p
                ref={captionRef}
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-0 inline-flex items-center gap-2 rounded-full border border-lynx-400/25 bg-ink-900/80 px-3 py-1 text-[13px] font-medium text-lynx-200 opacity-[var(--s3d-chat,0)] lg:hidden",
                  !use3D && "hidden",
                )}
              >
                {`${STEPS[0].time} · ${STEPS[0].label}`}
              </p>
              {/* …e esta acompanha o celular em HTML. */}
              {!use3D && (
                <p
                  aria-hidden="true"
                  className="absolute left-0 top-0 inline-flex items-center gap-2 rounded-full border border-lynx-400/25 bg-ink-900/80 px-3 py-1 text-[13px] font-medium text-lynx-200 opacity-[var(--s3d-chat,0)] transition-opacity duration-300 lg:hidden"
                >
                  {`${STEPS[htmlStep].time} · ${STEPS[htmlStep].label}`}
                </p>
              )}
            </div>

            <ol ref={stepsRef} aria-label="O que acontece na conversa" className="relative mt-8 space-y-1 max-lg:hidden">
              <span aria-hidden="true" className="absolute bottom-4 left-[11px] top-4 w-px overflow-hidden bg-white/10">
                {/* trilho da cena 3D */}
                <span
                  ref={railRef}
                  className={cn("absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-lynx-300 to-emerald-400", !use3D && "hidden")}
                />
                {/* trilho do celular em HTML */}
                {!use3D && (
                  <span
                    className="absolute inset-0 origin-top bg-gradient-to-b from-lynx-300 to-emerald-400 transition-transform duration-500"
                    style={{ transform: `scaleY(${step < 0 ? 0 : (step + 1) / STEPS.length})` }}
                  />
                )}
              </span>
              {STEPS.map((s, i) => (
                <li
                  key={s.label}
                  data-state={i < step ? "done" : i === step ? "active" : "todo"}
                  className="group relative flex items-center gap-3 py-1.5 text-[15px] text-neutral-500 transition-colors duration-300 data-[state=active]:text-white data-[state=done]:text-neutral-300"
                >
                  <span className="flex size-[23px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-950 font-mono text-[10px] transition-colors duration-300 group-data-[state=active]:border-lynx-400 group-data-[state=active]:bg-lynx-400 group-data-[state=active]:text-ink-950 group-data-[state=done]:border-lynx-400/50 group-data-[state=done]:text-lynx-300">
                    {i + 1}
                  </span>
                  <span className="w-11 shrink-0 font-mono text-xs text-neutral-500">{s.time}</span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>

          <div
            className={cn(
              "mt-8 flex justify-center transition-[opacity,visibility] duration-700 lg:col-span-7 lg:mt-0",
              use3D && "invisible opacity-0",
            )}
          >
            <motion.div
              style={
                reduced
                  ? { transformPerspective: 1400, rotateY: -10, rotateX: 3 }
                  : { transformPerspective: 1400, rotateY: tilt, rotateX: 3, y: lift }
              }
              className="w-[min(64vw,290px,calc((100svh-360px)*0.487))] lg:w-[min(290px,calc((100svh-160px)*0.487))]"
            >
              <HtmlPhone beat={beat} still={reduced} />
            </motion.div>
          </div>
        </div>

        <ol className="sr-only" aria-label="Simulação da conversa no WhatsApp">
          {CHAT.map((m) => (
            <li key={m.text}>{`${m.from === "ia" ? "IA da Lynx" : "Contato"}, ${m.time}: ${m.text}`}</li>
          ))}
          <li>{`Agendamento confirmado: ${CONFIRM.title}, ${CONFIRM.detail.toLowerCase()}.`}</li>
        </ol>
      </div>
    </section>
  );
}
