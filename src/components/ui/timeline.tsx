import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Base: Timeline (Aceternity UI via 21st.dev)
export interface TimelineEntry {
  step: string;
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => setHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-7xl pb-10">
        {data.map((item) => (
          <div key={item.step} className="flex justify-start pt-10 md:gap-10 md:pt-24">
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-950">
                <div className="h-4 w-4 rounded-full border border-lynx-400/40 bg-lynx-400/20 shadow-[0_0_16px_rgb(189_238_54/0.6)]" />
              </div>
              <div className="hidden md:block md:pl-20">
                <span className="font-mono text-sm text-lynx-400">{item.step}</span>
                <h3 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-200 lg:text-5xl">{item.title}</h3>
              </div>
            </div>

            <div className="relative w-full pl-20 pr-2 md:pl-4">
              <div className="mb-4 md:hidden">
                <span className="font-mono text-xs text-lynx-400">{item.step}</span>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-200">{item.title}</h3>
              </div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/10 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-lynx-300 from-[0%] via-emerald-400 via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
