import { cn } from "@/lib/utils";

// Base: Flip Links (vaib215 via 21st.dev) — as letras sobem e uma cópia entra por baixo no hover. Só CSS.
export function FlipText({ children, className }: { children: string; className?: string }) {
  const letters = Array.from(children);
  return (
    <span className={cn("relative block overflow-hidden whitespace-nowrap", className)} style={{ lineHeight: 1.2 }}>
      <span className="flex" aria-hidden="true">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-[110%]"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex text-lynx-300" aria-hidden="true">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
