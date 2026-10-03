import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { LynxMark } from "@/components/logo";
import { SectionHeading } from "@/components/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { whatsappLink } from "@/config/site";
import { EASE } from "@/lib/motion";

// Base: Chat Bubble Thread (21st.dev) — respostas rápidas que abrem o WhatsApp com a pergunta já escrita.

const replies = [
  { label: "Quanto custa no meu caso?", message: "Oi, Lynx! Quanto custaria no meu caso? Meu negócio é: " },
  { label: "Quanto tempo leva?", message: "Oi, Lynx! Quanto tempo leva para ficar pronto?" },
  { label: "Funciona no meu tipo de negócio?", message: "Oi, Lynx! A automação funciona no meu tipo de negócio? Eu trabalho com: " },
  { label: "Quero falar com uma pessoa", message: "Oi, Lynx! Quero falar com uma pessoa, por favor." },
];

export function QuickReplies() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-lynx grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <SectionHeading
          align="left"
          eyebrow="Prefere perguntar?"
          title={
            <>
              Toque numa pergunta e <span className="font-serif font-normal italic text-lynx-300">ela já vai escrita.</span>
            </>
          }
          description="Abre o WhatsApp com a mensagem pronta. É só enviar."
        />

        <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-white/[0.08] bg-[#0b141a] p-5 shadow-[0_40px_120px_-50px_rgb(189_238_54/0.35)]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <span className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-ink-800">
                <LynxMark className="size-5" />
              </span>
              <span className="text-sm font-semibold text-white">Lynx</span>
            </span>
            <StatusBadge className="hidden sm:inline-flex" />
          </div>

          <div className="flex flex-col gap-2.5 pt-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE }}
              className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#202c33] px-4 py-2.5 text-[14.5px] text-neutral-100"
            >
              Oi! 👋 Qual é a sua dúvida? Escolha uma ou escreva do seu jeito.
            </motion.div>

            <div className="mt-3 flex flex-col items-end gap-2">
              {replies.map((r, i) => (
                <motion.a
                  key={r.label}
                  href={whatsappLink(r.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: EASE }}
                  className="group inline-flex items-center gap-2 rounded-2xl rounded-tr-md border border-lynx-400/30 px-4 py-2.5 text-[14.5px] text-lynx-200 transition-colors hover:bg-lynx-400 hover:text-ink-950"
                >
                  {r.label}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
