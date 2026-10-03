import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span className="eyebrow">
        <span className="size-1.5 rounded-full bg-lynx-400 shadow-[0_0_8px_rgb(189_238_54)]" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg", align === "center" && "mx-auto max-w-2xl")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
