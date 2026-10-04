import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { CHAT, CONFIRM, PICKED_SLOT, SLOTS, STEPS } from "@/components/three/chat-script";
import { cn } from "@/lib/utils";

// "O celular das 23h47": a virada da história. Logo depois de "cada mensagem sem resposta é um cliente
// indo embora", o celular do dono acende às 23h47 e a IA da Lynx responde sozinha, conforme a rolagem.
// three.js + anime.js só são baixados quando a seção se aproxima; antes disso (e sem WebGL ou com
// movimento reduzido) fica um celular estático com a conversa completa. Trecho preso: 110svh.

type Mode = "loading" | "ready" | "static";

function hasWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function StaticPhone({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[74/152] w-[min(64vw,290px)] rounded-[42px] bg-gradient-to-br from-[#5d665f] via-[#262c27] to-[#3f4741] p-[3px] shadow-[0_50px_120px_-40px_rgb(189_238_54/0.45)] [transform:perspective(1400px)_rotateY(-14deg)_rotateX(4deg)]",
        className,
      )}
    >
      <div className="h-full rounded-[39px] bg-[#030403] p-[6px]">
        <div className="flex h-full flex-col overflow-hidden rounded-[33px] bg-[#0b141a] text-[10.5px] leading-snug text-[#e9edef]">
          <div className="bg-[#1f2c34] px-4 pb-2 pt-6">
            <p className="text-[12px] font-semibold">Novo contato</p>
            <p className="text-[9.5px] text-[#8696a0]">online</p>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-2.5">
            <p className="mx-auto rounded-md border border-lynx-400/25 bg-lynx-400/10 px-2 py-0.5 text-center text-[8.5px] text-lynx-300">
              Fora do horário · a IA da Lynx responde por você
            </p>
            {CHAT.map((m, i) => (
              <div
                key={m.text}
                className={cn(
                  "max-w-[84%] rounded-lg px-2 py-1",
                  m.from === "ia" ? "self-end rounded-tr-none bg-[#005c4b]" : "self-start rounded-tl-none bg-[#202c33]",
                )}
              >
                {m.from === "ia" && <span className="block text-[9px] font-semibold text-lynx-300">✦ IA da Lynx</span>}
                {m.text}
                {i === 1 && (
                  <span className="mt-1 flex gap-1">
                    {SLOTS.map((s) => (
                      <span
                        key={s}
                        className={cn("flex-1 rounded-full py-0.5 text-center font-semibold", s === PICKED_SLOT ? "bg-lynx-400 text-ink-950" : "bg-white/10")}
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                )}
                {i === 3 && (
                  <span className="mt-1 block rounded-md border border-lynx-400/30 bg-black/30 px-2 py-1">
                    <span className="block font-semibold text-lynx-200">{CONFIRM.title}</span>
                    <span className="block text-[9px] text-neutral-300">{CONFIRM.detail}</span>
                  </span>
                )}
                <span className="block text-right text-[8px] text-white/55">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Scroll3D() {
  const reduced = Boolean(useReducedMotion());
  const [mode, setMode] = useState<Mode>("loading");
  const isStatic = reduced || mode === "static";
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

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

  const ready = mode === "ready" && !reduced;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="celular-2347"
      className={cn("relative overflow-x-clip", isStatic ? "py-20 sm:py-28" : "h-[210svh]")}
    >
      <div ref={stageRef} className={cn("relative", !isStatic && "sticky top-0 h-svh overflow-hidden")}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_55%_50%_at_68%_55%,black,transparent)] max-lg:[mask-image:radial-gradient(ellipse_80%_45%_at_50%_65%,black,transparent)]" />
          <div
            ref={glowRef}
            className={cn(
              "absolute left-[68%] top-[55%] size-[min(720px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(189_238_54/0.16),rgb(37_211_102/0.05)_45%,transparent_68%)] max-lg:left-1/2 max-lg:top-[64%]",
              !isStatic && "opacity-25",
            )}
          />
          {!isStatic && <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink-950 to-transparent" />}
          {!isStatic && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />}
        </div>

        <div
          ref={hostRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
        />

        <div className={cn("container-lynx relative grid lg:grid-cols-12 lg:items-center", !isStatic && "h-full content-start lg:content-center")}>
          <div ref={textRef} className={cn("relative lg:col-span-5", !isStatic && "pt-[76px] lg:pt-0")}>
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
              <p
                className={cn(
                  "max-w-md text-pretty text-[15px] leading-relaxed text-neutral-400 sm:text-lg",
                  !isStatic && "max-lg:opacity-[calc(1_-_var(--s3d-chat,0))]",
                )}
              >
                Enquanto você dorme, a IA da Lynx atende o cliente, entende o pedido, oferece horários e confirma o
                agendamento — e só chama você quando precisa.
              </p>
              <p
                ref={captionRef}
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-0 inline-flex items-center gap-2 rounded-full border border-lynx-400/25 bg-ink-900/80 px-3 py-1 text-[13px] font-medium text-lynx-200 lg:hidden",
                  isStatic ? "hidden" : "opacity-[var(--s3d-chat,0)]",
                )}
              >
                {`${STEPS[0].time} · ${STEPS[0].label}`}
              </p>
            </div>

            <ol
              ref={stepsRef}
              aria-label="O que acontece na conversa"
              className={cn("relative mt-8 space-y-1", !isStatic && "max-lg:hidden")}
            >
              <span aria-hidden="true" className="absolute bottom-4 left-[11px] top-4 w-px overflow-hidden bg-white/10">
                <span
                  ref={railRef}
                  className={cn("absolute inset-0 origin-top bg-gradient-to-b from-lynx-300 to-emerald-400", !isStatic && "scale-y-0")}
                />
              </span>
              {STEPS.map((s, i) => (
                <li
                  key={s.label}
                  data-state={isStatic ? "done" : "todo"}
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
              "flex justify-center lg:col-span-7",
              isStatic ? "mt-12 lg:mt-0" : "mt-10 transition-[opacity,visibility] duration-700 lg:mt-0",
              ready && "invisible opacity-0",
            )}
          >
            <StaticPhone />
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
