import { useEffect, useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

// Base: Status Badge (serafimcloud via 21st.dev). Urgência honesta: só diz "online" no horário real de atendimento.
function isOpenNow() {
  const { days, open, close, timeZone } = site.hours;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  return days.includes(weekday) && hour >= open && hour < close;
}

export function StatusBadge({ className }: { className?: string }) {
  const [open, setOpen] = useState(isOpenNow);

  useEffect(() => {
    const timer = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-xs backdrop-blur",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 font-medium text-white">
        <span className="relative flex size-2">
          {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
          <span className={cn("relative inline-flex size-2 rounded-full", open ? "bg-emerald-400" : "bg-neutral-500")} />
        </span>
        {open ? "Online agora" : "Fora do horário"}
      </span>
      <span className="h-3.5 w-px bg-white/15" />
      <span className="text-neutral-400">{open ? `Seg a sex, ${site.hours.open}h–${site.hours.close}h` : `Respondemos a partir das ${site.hours.open}h`}</span>
    </span>
  );
}
