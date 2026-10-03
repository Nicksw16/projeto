import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Accordion (ddoemonn via 21st.dev) — reestilizado para a Lynx
const DISCLOSE = { type: "spring", stiffness: 480, damping: 40, mass: 0.6 } as const;
const ICON = { type: "spring", stiffness: 700, damping: 46, mass: 0.5 } as const;

function useAutoHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const next = el.getBoundingClientRect().height;
      setHeight((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };
    read();
    setReady(true);
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, height, ready };
}

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({
  items,
  defaultOpen = [],
  className,
}: {
  items: readonly AccordionItem[];
  defaultOpen?: string[];
  className?: string;
}) {
  const base = useId();
  const reduced = Boolean(useReducedMotion());
  const [open, setOpen] = useState<string[]>(defaultOpen.slice(0, 1));
  const headers = useRef(new Map<string, HTMLButtonElement>());

  const toggle = useCallback((id: string) => setOpen((prev) => (prev.includes(id) ? [] : [id])), []);

  const move = useCallback(
    (id: string, delta: number) => {
      const order = items.map((item) => item.id);
      const at = order.indexOf(id);
      const next = (at + delta + order.length) % order.length;
      headers.current.get(order[next])?.focus();
    },
    [items],
  );

  return (
    <div className={cn("divide-y divide-white/[0.07] rounded-3xl border border-white/[0.08] bg-ink-900/60", className)}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={open.includes(item.id)}
          reduced={reduced}
          headerId={`${base}-h-${item.id}`}
          panelId={`${base}-p-${item.id}`}
          onToggle={() => toggle(item.id)}
          onMove={(delta) => move(item.id, delta)}
          bindHeader={(node) => {
            if (node) headers.current.set(item.id, node);
            else headers.current.delete(item.id);
          }}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  open,
  reduced,
  headerId,
  panelId,
  onToggle,
  onMove,
  bindHeader,
}: {
  item: AccordionItem;
  open: boolean;
  reduced: boolean;
  headerId: string;
  panelId: string;
  onToggle: () => void;
  onMove: (delta: number) => void;
  bindHeader: (node: HTMLButtonElement | null) => void;
}) {
  const { ref, height, ready } = useAutoHeight();

  useEffect(() => {
    const el = ref.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (!el) return;
    el.inert = !open;
  }, [ref, open]);

  return (
    <div>
      <h3>
        <button
          ref={bindHeader}
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              onMove(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              onMove(-1);
            }
          }}
          className="group flex w-full items-center gap-4 px-5 py-5 text-left outline-none transition-colors first:rounded-t-3xl hover:bg-white/[0.02] focus-visible:bg-white/[0.03] sm:px-7 sm:py-6"
        >
          <span
            className={cn(
              "min-w-0 flex-1 text-base font-medium transition-colors sm:text-lg",
              open ? "text-white" : "text-neutral-300 group-hover:text-white",
            )}
          >
            {item.title}
          </span>
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
              open ? "border-lynx-400/40 bg-lynx-400 text-ink-950" : "border-white/10 text-neutral-400",
            )}
          >
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              initial={false}
              animate={{ rotate: open ? 45 : 0 }}
              transition={reduced ? { duration: 0 } : ICON}
            >
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </motion.svg>
          </span>
        </button>
      </h3>
      <motion.div
        initial={false}
        animate={ready ? { height: open ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{ overflow: "hidden", height: ready ? undefined : open ? "auto" : 0 }}
      >
        <div ref={ref} id={panelId} role="region" aria-labelledby={headerId} aria-hidden={open ? undefined : true}>
          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: open ? 0.2 : 0.12 }}
            className="max-w-3xl px-5 pb-6 text-[15px] leading-relaxed text-neutral-400 sm:px-7"
          >
            {item.content}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
