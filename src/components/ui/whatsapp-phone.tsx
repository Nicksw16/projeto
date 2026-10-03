import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, CalendarCheck, Camera, Mic, MoreVertical, Paperclip, Phone, Smile, Store, Video } from "lucide-react";

import { cn } from "@/lib/utils";

// Base: Great UI Mobile Mockup (saurabh-2607 via 21st.dev) — roteiro de atendimento automático da Lynx

type Message = {
  id: number;
  from: "client" | "bot";
  text?: string;
  time: string;
  options?: string[];
  picked?: string;
  card?: { title: string; detail: string };
};

type Step = { message: Message; wait: number };

const SCRIPT: Step[] = [
  { wait: 700, message: { id: 1, from: "client", text: "Oi! Vocês têm horário amanhã? 😊", time: "10:41" } },
  {
    wait: 1500,
    message: {
      id: 2,
      from: "bot",
      text: "Olá! Sou a Lia, assistente virtual da Sua Empresa 👋 Tenho estes horários livres para amanhã:",
      options: ["09:30", "14:00", "16:30"],
      time: "10:41",
    },
  },
  { wait: 1900, message: { id: 3, from: "client", text: "14:00, por favor!", time: "10:42" } },
  {
    wait: 1500,
    message: {
      id: 4,
      from: "bot",
      text: "Prontinho! ✅ Seu horário está confirmado.",
      card: { title: "Agendamento confirmado", detail: "Amanhã, 14:00 · lembrete 1h antes" },
      time: "10:42",
    },
  },
  { wait: 1800, message: { id: 5, from: "client", text: "Perfeito, obrigado!", time: "10:42" } },
  { wait: 1400, message: { id: 6, from: "bot", text: "Eu que agradeço! Qualquer coisa é só chamar 💚", time: "10:42" } },
];

const TYPING_TIME = 1100;
const RESTART_AFTER = 4200;

function DoubleCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
      <path d="M11.045.585 11.988 1.528 5.858 7.658 2.558 4.358l.944-.943 2.356 2.357L11.045.585Zm3.3 0 .943.943-6.13 6.13-.943-.943 6.13-6.13ZM9.158 9.545l-3.3-3.3.943-.943 2.357 2.356 5.187-5.187.943.944-6.13 6.13Z" />
    </svg>
  );
}

export function WhatsAppPhone({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState<Message[]>(reduced ? SCRIPT.map((s) => s.message) : []);
  const [typing, setTyping] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    setVisible([]);
    setTyping(false);

    SCRIPT.forEach(({ message, wait }) => {
      elapsed += wait;
      if (message.from === "bot") {
        timers.push(setTimeout(() => setTyping(true), elapsed));
        elapsed += TYPING_TIME;
      }
      timers.push(
        setTimeout(() => {
          setTyping(false);
          setVisible((prev) => {
            // Quando o cliente escolhe um horário, marca a opção na mensagem do bot.
            const next = prev.map((m) =>
              m.options && message.from === "client" && m.options.includes(message.text?.slice(0, 5) ?? "")
                ? { ...m, picked: message.text?.slice(0, 5) }
                : m,
            );
            return [...next, message];
          });
        }, elapsed),
      );
    });

    timers.push(setTimeout(() => setCycle((c) => c + 1), elapsed + RESTART_AFTER));
    return () => timers.forEach(clearTimeout);
  }, [cycle, reduced]);

  return (
    <div className={cn("relative mx-auto w-full max-w-[300px] select-none", className)}>
      <div className="relative flex h-[580px] w-full flex-col overflow-hidden rounded-[46px] border border-white/10 bg-neutral-950 p-2.5 shadow-[0_40px_120px_-30px_rgb(189_238_54/0.35),inset_0_0_0_1px_rgb(255_255_255/0.04)]">
        <div className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-neutral-800" />
        <div className="absolute -left-[3px] top-40 h-12 w-[3px] rounded-l bg-neutral-800" />
        <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-neutral-800" />

        <div className="relative isolate flex h-full w-full flex-col overflow-hidden rounded-[36px] bg-[#0b141a] text-neutral-100">
          {/* Status bar */}
          <div className="relative z-30 flex shrink-0 items-center justify-between bg-[#111b21] px-6 pb-1 pt-3 text-[11px] font-semibold">
            <span>10:42</span>
            <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="16" width="3.5" height="5" rx="0.5" />
                <rect x="7.5" y="12" width="3.5" height="9" rx="0.5" />
                <rect x="13" y="8" width="3.5" height="13" rx="0.5" />
                <rect x="18.5" y="4" width="3.5" height="17" rx="0.5" />
              </svg>
              <svg className="h-2.5 w-4" fill="none" viewBox="0 0 24 14" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect x="1" y="1" width="18" height="12" rx="3" />
                <rect x="3" y="3" width="11" height="8" rx="1.5" fill="currentColor" />
              </svg>
            </span>
          </div>

          {/* Header do chat */}
          <div className="z-20 flex shrink-0 items-center justify-between border-b border-white/5 bg-[#111b21] px-3 py-2">
            <div className="flex items-center gap-2">
              <ArrowLeft className="size-4 text-neutral-300" />
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-lynx-300 to-emerald-500 text-ink-950">
                <Store className="size-4" />
              </div>
              <div className="leading-tight">
                <p className="text-[12.5px] font-semibold">Sua Empresa</p>
                <p className={cn("text-[10px]", typing ? "text-emerald-400" : "text-neutral-400")}>
                  {typing ? "digitando…" : "online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Video className="size-4" />
              <Phone className="size-3.5" />
              <MoreVertical className="size-4" />
            </div>
          </div>

          {/* Conversa */}
          <div className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-2.5 pb-2">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative z-10 mx-auto mb-2 rounded-md bg-[#182229] px-2.5 py-0.5 text-[10px] text-neutral-400">
              Hoje
            </div>
            <div className="relative z-10 flex flex-col justify-end gap-1.5">
              <AnimatePresence initial={false}>
                {visible.map((msg) => (
                  <motion.div
                    key={`${cycle}-${msg.id}`}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className={cn("flex", msg.from === "client" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[84%] rounded-xl px-2.5 py-1.5 text-[12px] leading-snug shadow-sm",
                        msg.from === "client" ? "rounded-tr-sm bg-[#005c4b]" : "rounded-tl-sm bg-[#202c33]",
                      )}
                    >
                      {msg.text && <p>{msg.text}</p>}
                      {msg.card && (
                        <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-lynx-400/20 bg-lynx-400/10 p-2">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-lynx-400 text-ink-950">
                            <CalendarCheck className="size-4" />
                          </span>
                          <span className="leading-tight">
                            <span className="block text-[11.5px] font-semibold text-lynx-200">{msg.card.title}</span>
                            <span className="block text-[10.5px] text-neutral-300">{msg.card.detail}</span>
                          </span>
                        </div>
                      )}
                      <span
                        className={cn(
                          "mt-0.5 flex items-center justify-end gap-1 text-[9px]",
                          msg.from === "client" ? "text-emerald-100/60" : "text-neutral-400",
                        )}
                      >
                        {msg.time}
                        {msg.from === "client" && <DoubleCheck className="h-2.5 w-3 text-[#53bdeb]" />}
                      </span>
                      {msg.options && (
                        <div className="-mx-2.5 -mb-1.5 mt-1 grid grid-cols-3 border-t border-white/10">
                          {msg.options.map((opt) => (
                            <span
                              key={opt}
                              className={cn(
                                "py-1.5 text-center text-[11.5px] font-medium transition-colors [&:not(:last-child)]:border-r [&:not(:last-child)]:border-white/10",
                                msg.picked === opt ? "bg-emerald-400/15 text-emerald-300" : "text-[#53bdeb]",
                              )}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-1 rounded-xl rounded-tl-sm bg-[#202c33] px-3 py-2.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="size-1.5 rounded-full bg-neutral-400"
                          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Input */}
          <div className="z-20 flex shrink-0 items-center gap-1.5 bg-[#0b141a] px-2 pb-1 pt-1.5">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-[#202c33] px-3 py-2 text-[12px] text-neutral-400">
              <Smile className="size-4" />
              <span className="flex-1">Mensagem</span>
              <Paperclip className="size-4" />
              <Camera className="size-4" />
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#00a884] text-white">
              <Mic className="size-4" />
            </span>
          </div>
          <div className="flex shrink-0 justify-center pb-2 pt-1">
            <div className="h-1 w-24 rounded-full bg-neutral-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
