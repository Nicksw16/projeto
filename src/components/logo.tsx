import { cn } from "@/lib/utils";

// Marca da Lynx: o olho do avatar do Instagram, redesenhado em SVG (nítido em qualquer tamanho).
export function LynxMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 576 576" className={cn("size-8", className)} aria-hidden="true">
      <circle cx="288" cy="288" r="288" fill="#0d2d2b"/><path d="M104 322Q205 212 292 208Q398 212 466 288Q392 386 292 390Q190 386 104 322Z" fill="#f4efe5"/><circle cx="295" cy="298" r="78" fill="#e5a745"/><ellipse cx="292" cy="298" rx="14" ry="60" fill="#102c25"/><path d="M322 247V300L336 288L346 309L357 304L347 284L364 281Z" fill="#f4efe5"/><path d="M100 322L126 300M468 290L507 268" stroke="#f4efe5" strokeWidth="11" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LynxMark className="size-7" />
      <span className="text-xl font-semibold tracking-[-0.04em] text-white">lynx</span>
    </span>
  );
}
