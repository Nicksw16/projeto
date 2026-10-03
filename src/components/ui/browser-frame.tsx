import { Lock, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

// Base: Safari (Magic UI via 21st.dev) — a moldura de navegador em HTML para mostrar um site de verdade (não uma imagem).
export function BrowserFrame({ url, children, className }: { url: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden rounded-[inherit] border border-white/10 bg-[#262626]", className)}>
      <div className="relative flex h-11 shrink-0 items-center gap-2 border-b border-black/30 bg-[#2b2b2b] px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <div className="absolute left-1/2 flex h-7 w-[min(55%,28rem)] -translate-x-1/2 items-center justify-center gap-1.5 rounded-md bg-[#404040] text-xs text-neutral-300">
          <Lock className="size-3" />
          {url}
          <RotateCw className="absolute right-2.5 size-3 text-neutral-400" />
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
