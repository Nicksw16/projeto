import { useId } from "react";

import { cn } from "@/lib/utils";

// Marca da Lynx: cabeça de lince geométrica. Troque este SVG pela logo oficial se tiver.
export function LynxMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={cn("size-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e1f99a" />
          <stop offset="0.55" stopColor="#bdee36" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <path d="M8 4.5 15 13h10l7-8.5 2 14.5 2.5 8.5L29 31l-9 5-9-5-7.5-3.5L6 19z" fill="white" />
          <path d="M10.5 21.2q4-4.2 8 0-4 2.6-8 0zM21.5 21.2q4-4.2 8 0-4 2.6-8 0z" fill="black" />
          <path d="M18.4 26.6h3.2L20 28.8z" fill="black" />
        </mask>
      </defs>
      <path d="M8 4.5 7 .8M32 4.5 33 .8" stroke={`url(#${id}-g)`} strokeWidth="1.6" strokeLinecap="round" />
      <rect width="40" height="40" fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
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
