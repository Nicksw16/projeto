import { Link } from "react-router";

import { cn } from "@/lib/utils";

type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

export function ButtonLink({ variant = "primary", size = "md", className, children, href = "", ...props }: ButtonProps) {
  // Rotas internas ("/planos") navegam sem recarregar; links externos abrem em nova aba; "#secao" rola na própria página.
  const external = /^(https?:|mailto:|tel:|#)/.test(href);
  const Tag = (external ? "a" : Link) as React.ElementType;
  const linkProps = !external
    ? { to: href }
    : href.startsWith("http")
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : { href };
  return (
    <Tag
      {...linkProps}
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 active:scale-[0.98]",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-13 px-7 text-[15px]",
        variant === "primary" &&
          "bg-lynx-400 text-ink-950 shadow-[0_0_0_1px_rgb(189_238_54/0.4),0_8px_32px_-8px_rgb(189_238_54/0.6),inset_0_1px_0_rgb(255_255_255/0.5)] hover:bg-lynx-300 hover:shadow-[0_0_0_1px_rgb(208_245_101/0.6),0_12px_40px_-8px_rgb(189_238_54/0.8),inset_0_1px_0_rgb(255_255_255/0.5)]",
        variant === "secondary" &&
          "border border-white/12 bg-white/[0.04] text-white backdrop-blur hover:border-white/25 hover:bg-white/[0.08]",
        variant === "ghost" && "text-neutral-300 hover:text-white",
        className,
      )}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Tag>
  );
}
