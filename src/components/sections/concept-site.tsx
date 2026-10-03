import { ArrowRight, CalendarClock, Leaf, Sparkles, Star } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";

// Projeto conceito exibido dentro do "tablet" — uma marca fictícia para mostrar versatilidade de design.
export function ConceptSite() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fbf6f1] font-sans text-[#2b211e]">
      <div className="absolute -right-24 -top-24 size-[420px] rounded-full bg-[#f3d5c4] opacity-70 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 size-[360px] rounded-full bg-[#e9e2d0] opacity-80 blur-3xl" />

      <div className="relative flex items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <span className="font-serif text-2xl italic md:text-3xl">bloom.</span>
        <nav className="hidden gap-7 text-sm text-[#2b211e]/70 md:flex">
          <span>Tratamentos</span>
          <span>Sobre</span>
          <span>Resultados</span>
          <span>Contato</span>
        </nav>
        <span className="rounded-full bg-[#2b211e] px-4 py-2 text-xs font-medium text-[#fbf6f1] md:text-sm">Agendar</span>
      </div>

      <div className="relative grid gap-6 px-5 pt-2 md:grid-cols-2 md:gap-10 md:px-10 md:pt-2">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c9826b]/30 bg-white/60 px-3 py-1 text-[11px] text-[#9a5a45] md:text-xs">
            <Leaf className="size-3" /> Estética avançada
          </span>
          <h3 className="mt-4 font-serif text-[2rem] leading-[1.02] tracking-tight md:text-[3.5rem]">
            Beleza natural, com <span className="italic text-[#c9826b]">ciência</span> e cuidado.
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#2b211e]/65 md:text-base">
            Protocolos personalizados para realçar o que você tem de melhor — com tecnologia e acolhimento.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#25d366]/25 md:text-sm">
              <WhatsAppIcon className="size-4" /> Agendar pelo WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2b211e]/15 px-4 py-2.5 text-xs font-medium md:text-sm">
              Ver tratamentos <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>

        <div className="relative hidden h-[320px] md:block">
          <div className="absolute inset-x-10 bottom-0 top-0 overflow-hidden rounded-t-[200px] bg-gradient-to-b from-[#efc7b2] via-[#e2a88e] to-[#cf8b70]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgb(255_255_255/0.5),transparent_55%)]" />
            <div className="absolute left-1/2 top-12 size-28 -translate-x-1/2 rounded-full bg-[#fbe6da]/80" />
            {/* Bancada */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-[#f4dccd] to-[#e9c7b4]" />
            {/* Frasco conta-gotas */}
            <div className="absolute bottom-12 left-[30%] flex flex-col items-center">
              <span className="h-5 w-4 rounded-t-full bg-[#2b211e]" />
              <span className="h-7 w-7 rounded-t-md bg-[#3a2d29]" />
              <span className="relative flex h-32 w-[4.5rem] items-end justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#fff8f3] via-[#f7e2d6] to-[#e7bba4] shadow-[0_18px_30px_-12px_rgb(120_60_40/0.45)]">
                <span className="absolute inset-y-2 left-2 w-2 rounded-full bg-white/70" />
                <span className="mb-5 rounded-sm bg-[#2b211e] px-1.5 py-1 font-serif text-[10px] italic text-[#fbf6f1]">bloom.</span>
              </span>
            </div>
            {/* Pote */}
            <div className="absolute bottom-12 right-[22%] flex flex-col items-center">
              <span className="h-5 w-[5.5rem] rounded-t-lg bg-[#c9826b]" />
              <span className="flex h-14 w-24 items-center justify-center rounded-b-2xl rounded-t-sm bg-gradient-to-br from-white to-[#f1d8c9] shadow-[0_16px_26px_-12px_rgb(120_60_40/0.45)]">
                <span className="font-serif text-[10px] italic text-[#9a5a45]">serum</span>
              </span>
            </div>
            <Leaf className="absolute bottom-10 left-[16%] size-9 -rotate-12 text-[#8a9a6b]" strokeWidth={1.5} />
            <Leaf className="absolute bottom-[3.25rem] right-[12%] size-7 rotate-[24deg] text-[#8a9a6b]" strokeWidth={1.5} />
          </div>
          <div className="absolute -left-1 top-8 flex items-center gap-2.5 rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#c9826b]/15 text-[#c9826b]">
              <CalendarClock className="size-4" />
            </span>
            <span className="text-xs leading-tight">
              <span className="block font-semibold">Próximo horário</span>
              <span className="text-[#2b211e]/60">Hoje, 16:00</span>
            </span>
          </div>
          <div className="absolute -right-1 bottom-24 flex items-center gap-2 rounded-2xl bg-[#2b211e] p-3 text-[#fbf6f1] shadow-xl">
            <Sparkles className="size-4 text-[#e8b49c]" />
            <span className="text-xs font-medium">Avaliação personalizada</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-3 px-5 md:mt-8 md:gap-4 md:px-10">
        {["Harmonização", "Skincare", "Corporal"].map((item) => (
          <div key={item} className="rounded-2xl border border-[#2b211e]/[0.06] bg-white/70 p-3 md:p-5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#c9826b]/12 text-[#c9826b] md:size-9">
              <Star className="size-3.5 md:size-4" />
            </span>
            <p className="mt-3 text-xs font-semibold md:text-sm">{item}</p>
            <p className="mt-1 hidden text-xs text-[#2b211e]/55 md:block">Protocolos sob medida</p>
          </div>
        ))}
      </div>

      <span className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-[#25d366]/30">
        <WhatsAppIcon className="size-6" />
      </span>
    </div>
  );
}
