import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Zap } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { LynxMark } from "@/components/logo";
import { cn } from "@/lib/utils";

// Base: Notification Stack (starc007 / beui.dev via 21st.dev) — reescrito para contar a cena das 23h47:
// mensagens sem resposta se empilham… até a IA da Lynx responder. Passe o mouse (ou toque) para abrir a pilha.
const UNREAD = [
  { id: "a", name: "Cliente novo", text: "Oi! Vocês atendem amanhã?", time: "23:47" },
  { id: "b", name: "Cliente novo", text: "Qual o valor? Queria marcar…", time: "23:52" },
  { id: "c", name: "Cliente novo", text: "Alguém aí? 😕 Vou ver em outro lugar", time: "00:10" },
];

const PEEK = 10;
const INSET = 14;

export function NotificationStack({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? 3 : 0);
  const [answered, setAnswered] = useState(Boolean(reduced));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setCount(0);
      setAnswered(false);
      timers = [
        setTimeout(() => setCount(1), 600),
        setTimeout(() => setCount(2), 1700),
        setTimeout(() => setCount(3), 2800),
        setTimeout(() => setAnswered(true), 4400),
        setTimeout(run, 10500),
      ];
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  // As mais novas ficam por cima.
  const shown = UNREAD.slice(0, count).reverse();

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[24rem]", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setExpanded(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setExpanded(false)}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label="Mensagens que chegaram fora do horário"
        className="relative block w-full rounded-[28px] border border-white/10 bg-ink-850/80 p-3 text-left shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-2 pb-3 pt-1">
          <span className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <WhatsAppIcon className="size-4 text-wa" />
            WhatsApp · agora
          </span>
          <AnimatePresence mode="wait" initial={false}>
            {answered ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 rounded-full bg-lynx-400/15 px-2 py-0.5 text-[11px] font-medium text-lynx-300"
              >
                <Check className="size-3" strokeWidth={3} /> Todas respondidas
              </motion.span>
            ) : (
              <motion.span
                key="n"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] text-neutral-400"
              >
                <span className="grid size-5 place-items-center rounded-full bg-orange-500 text-[10px] font-semibold text-white tabular-nums">
                  {count}
                </span>
                não lidas
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative grid min-h-[13.5rem] content-start gap-2">
          <AnimatePresence initial={false}>
            {shown.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{
                  opacity: answered ? 0.45 : 1,
                  y: expanded ? 0 : index * PEEK,
                  scale: 1,
                  clipPath: expanded ? "inset(0px 0px round 18px)" : `inset(0px ${index * INSET}px round 18px)`,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="flex gap-3 rounded-[18px] border border-white/[0.07] bg-ink-700 p-3.5"
                style={{ zIndex: shown.length - index, gridColumn: 1, gridRow: expanded ? index + 1 : 1 }}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-sm">👤</span>
                <span className={cn("min-w-0 flex-1", !expanded && index > 0 && "invisible")}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-white">{item.name}</span>
                    <span className="text-[11px] tabular-nums text-neutral-500">{item.time}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-neutral-300">{item.text}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute inset-x-0 bottom-0 z-20 flex gap-3 rounded-[18px] border border-lynx-400/40 bg-gradient-to-br from-ink-600 to-ink-800 p-3.5 shadow-[0_20px_60px_-15px_rgb(189_238_54/0.5)]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lynx-400/15 ring-1 ring-lynx-400/30">
                  <LynxMark className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-[13px] font-semibold text-lynx-200">
                      IA da Lynx <Zap className="size-3" />
                    </span>
                    <span className="text-[11px] text-neutral-400">respondeu em 2s</span>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-neutral-100">
                    Oi! 😊 Temos horário amanhã às 9h, 14h ou 16h. Quer que eu reserve?
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
      <p className="mt-3 text-center text-[11px] text-neutral-500">Simulação ilustrativa · passe o mouse ou toque para abrir</p>
    </div>
  );
}
