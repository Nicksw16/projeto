import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Base: Text Cycle (wensity via 21st.dev)
export interface TextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
  charClassName?: string;
}

function splitIntoCharacters(value: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), ({ segment }) => segment);
  }
  return Array.from(value);
}

export function TextCycle({ words, interval = 2600, className, charClassName }: TextCycleProps) {
  const [index, setIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const timer = window.setInterval(() => setIndex((prev) => (prev + 1) % words.length), Math.max(400, interval));
    return () => window.clearInterval(timer);
  }, [interval, reduceMotion, words.length]);

  const current = words[index % words.length] ?? "";

  if (reduceMotion) {
    return <span className={cn("inline-flex", className)}>{current}</span>;
  }

  return (
    <span className={cn("inline-flex", className)}>
      {/* Leitores de tela leem só a primeira frase, sem anunciar cada troca */}
      <span className="sr-only">{words[0]}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          className="inline-flex whitespace-pre"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        >
          {splitIntoCharacters(current).map((char, i) => (
            <motion.span
              key={`${index}-${i}`}
              className={cn("inline-block", charClassName)}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ delay: i * 0.025, duration: 0.3 }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
