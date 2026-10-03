import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

// Base: Services Stack (ivarunchaudhary via 21st.dev) — painéis fixos que se empilham no scroll, cada um com um
// desenho em linha que encena o serviço. Adaptado para o tema escuro da Lynx, em português, com 2 cenas:
// "automacao" (a IA atendendo) e "sites" (o site sendo construído).

type Pt = [number, number];
type Step = [from: number, to: number, capability: string];
type Scene = { loop: number; still: number; steps: Step[]; Draw: (props: { t: number }) => React.ReactNode };

const W = 1280;
const H = 536;
const INK = "#e6ebe4";
const CARD = "#111511";
const ACCENT = "#bdee36";
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const out = (p: number) => 1 - (1 - p) ** 3;
const back = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mix = (a: Pt, b: Pt, p: number): Pt => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
const quad = (a: Pt, c: Pt, b: Pt, p: number): Pt => mix(mix(a, c, p), mix(c, b, p), p);
const cubic = (a: Pt, c1: Pt, c2: Pt, b: Pt, p: number): Pt => quad(mix(a, c1, p), mix(c1, c2, p), mix(c2, b, p), p);
const pt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const fade = (t: number, loop: number) => prog(t, 0, 0.25) * (1 - prog(t, loop - 0.7, loop));

const draw = (p: number) =>
  ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - p, visibility: p > 0 ? "visible" : "hidden" }) as const;

const line = { fill: "none", stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const hair = { ...line, strokeWidth: 2, strokeOpacity: 0.22 } as const;
const mono = { fontFamily: MONO, letterSpacing: 1 } as const;

/* ---------------------------------- Sites ---------------------------------- */

const T_WIRES: [Pt, Pt, Pt, Pt][] = [
  [[470, 60], [520, 10], [960, 10], [1000, 100]],
  [[790, 240], [840, 240], [850, 222], [900, 222]],
  [[540, 380], [620, 470], [840, 430], [900, 312]],
];
const T_SPARK = [240, 232, 236, 220, 224, 205, 210, 190, 184, 170].map((y, i): Pt => [140 + i * (350 / 9), y]);

function Sites({ t }: { t: number }) {
  const auto = t >= 8.8 ? Math.floor((t - 8.8) * 2) % 3 : -1;
  const sparkEnd = prog(t, 8.3, 8.6);

  return (
    <g opacity={fade(t, 12)}>
      {/* Site institucional */}
      <rect x={90} y={60} width={450} height={350} rx={14} {...line} {...draw(inOut(prog(t, 0.2, 1.2)))} />
      <line x1={90} y1={100} x2={540} y2={100} {...hair} {...draw(prog(t, 0.9, 1.3))} />
      {[116, 136, 156].map((x, i) => (
        <circle key={x} cx={x} cy={80} r={5} fill={INK} opacity={0.3 * prog(t, 1 + i * 0.08, 1.2 + i * 0.08)} />
      ))}
      <path d="M120 126H200M400 126H430M445 126H475M490 126H510" {...line} strokeWidth={2} strokeOpacity={0.5} {...draw(prog(t, 1.1, 1.6))} />
      <rect x={120} y={150} width={390} height={120} rx={8} {...hair} {...draw(inOut(prog(t, 1.2, 1.8)))} />
      {[120, 256, 392].map((x, i) => (
        <rect key={x} x={x} y={290} width={118} height={90} rx={8} {...hair} {...draw(inOut(prog(t, 1.6 + i * 0.2, 2.2 + i * 0.2)))} />
      ))}

      {/* Versão para celular */}
      <rect x={620} y={70} width={170} height={340} rx={26} {...line} {...draw(inOut(prog(t, 2.2, 3.2)))} />
      <line x1={680} y1={90} x2={730} y2={90} {...line} strokeOpacity={0.5} {...draw(prog(t, 3, 3.3))} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 128 + i * 52;
        const p = out(prog(t, 2.8 + i * 0.22, 3.3 + i * 0.22));
        return (
          <g key={i} opacity={p} transform={`translate(${(1 - p) * 12} 0)`}>
            <circle cx={650} cy={y} r={11} {...hair} />
            <path d={`M672 ${y - 5}H745M672 ${y + 8}H720`} {...line} strokeWidth={2} strokeOpacity={0.35} />
            <path d={`M757 ${y}l5 5l10 -10`} {...line} stroke={ACCENT} {...draw(prog(t, 9 + i * 0.3, 9.25 + i * 0.3))} />
          </g>
        );
      })}

      {/* Hospedagem, domínio e SSL */}
      {[100, 190, 280].map((y, i) => {
        const p = out(prog(t, 4 + i * 0.35, 4.6 + i * 0.35));
        return (
          <g key={y} opacity={p} transform={`translate(0 ${-(1 - p) * 50})`}>
            <rect x={900} y={y} width={290} height={64} rx={12} {...line} fill={CARD} />
            <circle cx={926} cy={y + 32} r={7} fill={auto === i ? ACCENT : INK} fillOpacity={auto === i ? 1 : 0.3} />
            <path d={`M950 ${y + 26}H1080M950 ${y + 40}H1030`} {...line} strokeWidth={2} strokeOpacity={0.35} />
          </g>
        );
      })}

      {/* Integrações */}
      {T_WIRES.map((c, i) => (
        <path key={i} d={`M${pt(c[0])}C${pt(c[1])} ${pt(c[2])} ${pt(c[3])}`} {...hair} strokeOpacity={0.35} {...draw(inOut(prog(t, 5.4 + i * 0.2, 6.2 + i * 0.2)))} />
      ))}
      {t > 6.2 &&
        T_WIRES.flatMap((c, i) =>
          [0, 1, 2].map((k) => {
            let u = ((t - 6.2) * 0.4 + k / 3 + i * 0.11) % 1;
            if (i === 1) u = 1 - u;
            const [x, y] = cubic(c[0], c[1], c[2], c[3], u);
            return <circle key={`${i}${k}`} cx={x} cy={y} r={6} fill={ACCENT} opacity={prog(t, 6.2, 6.6) * Math.sin(Math.PI * u)} />;
          }),
        )}

      {/* Métricas e Google */}
      <line x1={140} y1={252} x2={490} y2={252} {...hair} strokeDasharray="4 8" opacity={prog(t, 6.8, 7.2)} />
      <polyline points={T_SPARK.map(pt).join(" ")} {...line} {...draw(inOut(prog(t, 7, 8.4)))} />
      {sparkEnd > 0 && (
        <>
          <circle cx={T_SPARK[9][0]} cy={T_SPARK[9][1]} r={7 * back(sparkEnd)} fill={ACCENT} />
          <circle
            cx={T_SPARK[9][0]}
            cy={T_SPARK[9][1]}
            r={7 + ((t * 18) % 22)}
            {...line}
            stroke={ACCENT}
            strokeWidth={2}
            strokeOpacity={0.5 * (1 - ((t * 18) % 22) / 22)}
          />
        </>
      )}

      {/* WhatsApp no site */}
      <circle cx={1045} cy={430} r={26} {...line} strokeWidth={2} strokeDasharray="12 9" opacity={prog(t, 8.8, 9.2)} transform={`rotate(${t * 90} 1045 430)`} />
      <circle cx={1045} cy={430} r={6} fill={ACCENT} opacity={prog(t, 8.8, 9.2)} />
    </g>
  );
}

/* ------------------------------- Automação -------------------------------- */

const A_AGENT: Pt = [600, 270];
const A_FEED: Pt = [410, 323];
const A_TOOLS: Pt[] = [
  [850, 120],
  [850, 270],
  [850, 420],
];
const A_DONE: Pt = [1110, 330];
const A_TEAM: Pt = [1110, 110];
const A_SEG = 0.5;
const A_PROMPT = "> atender novos clientes";
const A_DATA = Array.from({ length: 16 }, (_, i) => ({
  from: [100 + ((i * 97) % 280), 210 + ((i * 53) % 240)] as Pt,
  to: [130 + (i % 4) * 80, 230 + Math.floor(i / 4) * 62] as Pt,
}));
const A_TOKENS = Array.from({ length: 14 }, (_, k) => {
  const rare = k % 5 === 3;
  const b = [1, 0, 2, 1, 2, 0][k % 6];
  const next = b === 2 ? 1 : b + 1;
  const path = rare
    ? [A_FEED, A_AGENT, A_TOOLS[0], A_TEAM]
    : k % 4 === 1
      ? [A_FEED, A_AGENT, A_TOOLS[b], A_TOOLS[next], A_DONE]
      : [A_FEED, A_AGENT, A_TOOLS[b], A_DONE];
  const start = 4.8 + k * 0.4;
  return { rare, path, start, end: start + (path.length - 1) * A_SEG };
});

function Automacao({ t }: { t: number }) {
  const typed = Math.floor(prog(t, 0.4, 2) * A_PROMPT.length);
  const cursor = t < 2.8 && (t * 2) % 1 < 0.5 ? "_" : "";
  const handled = A_TOKENS.filter((k) => !k.rare && k.end <= t).length;
  const lastDone = Math.max(-1, ...A_TOKENS.filter((k) => !k.rare && k.end <= t).map((k) => k.end));
  const lastUp = Math.max(-1, ...A_TOKENS.filter((k) => k.rare && k.end <= t).map((k) => k.end));
  const doneFlash = prog(t, lastDone, lastDone + 0.5);
  const upFlash = prog(t, lastUp, lastUp + 0.7);
  const edges = inOut(prog(t, 3.6, 4.4));
  const exits = inOut(prog(t, 4.1, 4.8));

  return (
    <g opacity={fade(t, 12)}>
      {/* Treinada com o seu negócio */}
      <rect x={80} y={80} width={356} height={76} rx={12} {...line} {...draw(inOut(prog(t, 0.1, 0.7)))} />
      <text x={102} y={126} fontSize={21} fill={INK} style={mono}>
        {A_PROMPT.slice(0, typed)}
        {cursor}
      </text>

      {/* Suas informações organizadas */}
      {A_DATA.map(({ from, to }, i) => {
        const [x, y] = mix(from, to, inOut(prog(t, 1.8 + i * 0.04, 2.8 + i * 0.04)));
        return <circle key={i} cx={x} cy={y} r={6} fill={INK} opacity={0.5 * prog(t, 1.1 + i * 0.03, 1.5 + i * 0.03)} />;
      })}

      <path d={`M436 118L${pt(A_AGENT)}M${pt(A_FEED)}L${pt(A_AGENT)}`} {...hair} {...draw(prog(t, 2.8, 3.5))} />
      {A_TOOLS.map((p, i) => (
        <g key={i}>
          <line x1={A_AGENT[0]} y1={A_AGENT[1]} x2={p[0]} y2={p[1]} {...hair} {...draw(edges)} />
          <line x1={p[0]} y1={p[1]} x2={A_DONE[0]} y2={A_DONE[1]} {...hair} {...draw(exits)} />
        </g>
      ))}
      <line x1={850} y1={120} x2={850} y2={420} {...hair} strokeDasharray="3 9" opacity={exits} />
      <line x1={A_TOOLS[0][0]} y1={A_TOOLS[0][1]} x2={A_TEAM[0] - 36} y2={A_TEAM[1]} {...hair} {...draw(exits)} />

      {/* A IA pensando */}
      <circle cx={A_AGENT[0]} cy={A_AGENT[1]} r={38} {...line} fill={CARD} {...draw(inOut(prog(t, 2.6, 3.2)))} />
      <circle
        cx={A_AGENT[0]}
        cy={A_AGENT[1]}
        r={54}
        {...line}
        strokeWidth={2}
        strokeDasharray="4 12"
        opacity={0.5 * prog(t, 3, 3.4)}
        transform={`rotate(${t * 40} ${pt(A_AGENT)})`}
      />
      <circle cx={A_AGENT[0]} cy={A_AGENT[1]} r={8 * back(prog(t, 3, 3.3))} fill={ACCENT} />

      {/* Tarefas: qualificar, responder, agendar */}
      {A_TOOLS.map(([x, y], i) => {
        const p = back(prog(t, 3.9 + i * 0.15, 4.3 + i * 0.15));
        const shape = [
          <rect key="s" x={-20} y={-20} width={40} height={40} rx={6} />,
          <rect key="d" x={-17} y={-17} width={34} height={34} rx={4} transform="rotate(45)" />,
          <circle key="c" r={22} />,
        ][i];
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g transform={`scale(${p})`} {...line} fill={CARD}>
              {shape}
            </g>
            <text x={40} y={7} fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 4.2, 4.6)} style={mono}>
              {["qualificar", "responder", "agendar"][i]}
            </text>
          </g>
        );
      })}

      {/* Resolvido — ou passa para a sua equipe */}
      <g opacity={prog(t, 4.4, 4.8)}>
        <circle cx={A_DONE[0]} cy={A_DONE[1]} r={26} {...line} />
        <circle cx={A_DONE[0]} cy={A_DONE[1]} r={12} fill={ACCENT} />
        {doneFlash > 0 && doneFlash < 1 && (
          <circle cx={A_DONE[0]} cy={A_DONE[1]} r={26 + 20 * out(doneFlash)} {...line} strokeWidth={2} strokeOpacity={1 - doneFlash} />
        )}
        <text x={A_DONE[0]} y={A_DONE[1] + 62} fontSize={19} textAnchor="middle" fill={INK} fillOpacity={0.55} style={mono}>
          {handled} resolvidos
        </text>
        <circle cx={A_TEAM[0]} cy={A_TEAM[1] - 20} r={14} {...line} />
        <path d={`M${A_TEAM[0] - 26} ${A_TEAM[1] + 24}Q${A_TEAM[0]} ${A_TEAM[1] - 14} ${A_TEAM[0] + 26} ${A_TEAM[1] + 24}`} {...line} />
        {upFlash > 0 && upFlash < 1 && (
          <circle cx={A_TEAM[0]} cy={A_TEAM[1]} r={40 + 24 * out(upFlash)} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={1 - upFlash} />
        )}
        <text x={A_TEAM[0] + 44} y={A_TEAM[1] + 7} fontSize={19} fill={INK} fillOpacity={0.55} style={mono}>
          sua equipe
        </text>
      </g>

      {/* As conversas passando pelo fluxo */}
      {A_TOKENS.map(({ rare, path, start, end }, k) => {
        if (t < start || t > end + 0.15) return null;
        const e = Math.min((t - start) / A_SEG, path.length - 1.0001);
        const i = Math.floor(e);
        const [x, y] = mix(path[i], path[i + 1], inOut(e - i));
        return rare ? (
          <g key={k}>
            <circle cx={x} cy={y} r={12} {...line} stroke={ACCENT} strokeWidth={2} />
            <circle cx={x} cy={y} r={6} fill={ACCENT} />
          </g>
        ) : (
          <circle key={k} cx={x} cy={y} r={7} fill={INK} />
        );
      })}
    </g>
  );
}

const scenes: Record<string, Scene> = {
  automacao: {
    loop: 12,
    still: 10.2,
    Draw: Automacao,
    steps: [
      [0, 2, "Treinada com o seu negócio"],
      [2, 3.6, "Suas informações organizadas"],
      [3.6, 5, "Tarefas sob medida"],
      [5, 7, "Atendimento automático"],
      [7, 8.8, "Vendas e suporte com IA"],
      [8.8, 12, "Equipe só quando precisa"],
    ],
  },
  sites: {
    loop: 12,
    still: 10.6,
    Draw: Sites,
    steps: [
      [0, 2.4, "Site institucional"],
      [2.4, 4.2, "Perfeito no celular"],
      [4.2, 5.6, "Domínio, hospedagem e SSL"],
      [5.6, 7.1, "Integrações"],
      [7.1, 8.8, "Pronto para o Google"],
      [8.8, 12, "WhatsApp no site"],
    ],
  },
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function ServiceAnimation({ id, title, onStep }: { id: string; title: string; onStep?: (c: string | undefined) => void }) {
  const scene = scenes[id];
  const svg = useRef<SVGSVGElement>(null);
  const [clock, setClock] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const loop = scene?.loop ?? 1;

  // O relógio só anda enquanto o desenho está visível.
  useEffect(() => {
    const el = svg.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      if (last) elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      setClock(elapsed % loop);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, loop]);

  const t = reduced ? (scene?.still ?? 0) : clock;
  const step = scene?.steps.find(([a, b]) => t >= a && t < b)?.[2];

  useEffect(() => {
    onStep?.(step);
  }, [step, onStep]);

  if (!scene) return null;
  const { Draw, steps } = scene;

  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title}>
      <Draw t={t} />
      {steps.map(([a, b, name]) => {
        const o = prog(t, a, a + 0.3) * (1 - prog(t, b - 0.3, b));
        return o > 0 ? (
          <text key={name} x={90} y={514 + (1 - o) * 8} fontSize={22} fill={ACCENT} fillOpacity={0.8} opacity={o} style={mono}>
            {name}
          </text>
        ) : null;
      })}
    </svg>
  );
}

export type Service = { id: "automacao" | "sites"; title: string; text: string };

function ServiceCard({ service: s }: { service: Service }) {
  const [step, setStep] = useState<string>();
  const capabilities = scenes[s.id].steps.map(([, , c]) => c);
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-ink-700 to-ink-850 px-4 pt-5 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)] lg:pt-8">
      <div className="px-2 lg:px-8">
        <ServiceAnimation id={s.id} title={`${s.title}: ${capabilities.join(", ")}`} onStep={setStep} />
      </div>
      <div className="p-5 pt-7 lg:px-12 lg:py-10">
        <p className="text-lg leading-snug text-neutral-200">{s.text}</p>
        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">O que está incluído</p>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 text-[14px] leading-tight">
          {capabilities.map((c) => (
            <li
              key={c}
              className={cn(
                "relative flex items-baseline gap-2 rounded-lg px-2.5 pb-2 pt-1.5 transition-colors duration-500 before:size-1.5 before:shrink-0 before:-translate-y-[20%] before:rounded-full",
                c === step
                  ? "bg-lynx-400/15 text-lynx-100 before:bg-lynx-400"
                  : "bg-white/[0.04] text-neutral-300 before:bg-neutral-500",
              )}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const panelClass =
  "sticky top-0 mx-auto grid min-h-screen w-full max-w-7xl origin-top content-center items-center px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-10";

export function ServicesStack({ services, eyebrow }: { services: Service[]; eyebrow: string }) {
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    let raf = 0;
    // Painel mais alto que a tela gruda pela base, para o cartão inteiro continuar alcançável.
    const fit = () => {
      const vh = window.innerHeight;
      panels.forEach((panel) => {
        panel.style.top = `${Math.min(0, vh - panel.offsetHeight)}px`;
      });
    };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = 0;
      panels.forEach((panel, i) => {
        if (panel.getBoundingClientRect().top <= vh * 0.5) idx = i;
        const next = panels[i + 1];
        const card = cards.current[i];
        if (!card) return;
        const covered = next ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
        card.style.opacity = String(Math.max(0, 1 - covered * 1.4));
        card.style.transform = `scale(${1 - covered * 0.06}) translateY(${-covered * 40}px)`;
      });
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      fit();
      schedule();
    };
    fit();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [services.length]);

  return (
    <section ref={root} className="relative isolate w-full">
      {services.map((s, i) => (
        <div key={s.id} data-panel className={panelClass}>
          <div
            className="mx-auto w-full max-w-[38rem] lg:col-start-2 lg:mx-0 lg:max-w-none"
            ref={(el) => {
              cards.current[i] = el;
            }}
            style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
          >
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white lg:sr-only">
              <span className="block text-base font-normal text-neutral-500">{eyebrow}</span>
              {s.title}
            </h2>
            <ServiceCard service={s} />
          </div>
        </div>
      ))}

      {/* Fundo fixo: título à esquerda + brilho que muda de cor por serviço */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="sticky top-0 grid h-screen w-full overflow-hidden">
          <div className="mx-auto hidden w-full max-w-7xl grid-cols-2 px-8 lg:grid">
            <div className="flex h-full flex-col">
              <div className="flex h-1/2 flex-col justify-end pb-4">
                <p className="text-xl font-medium text-neutral-500">{eyebrow}</p>
              </div>
              <div className="relative h-1/2">
                {services.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "absolute inset-x-0 top-0 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white transition duration-500 xl:text-6xl",
                      i !== active && "translate-y-10 opacity-0",
                    )}
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {services.map((s, i) => (
            <div
              key={s.id}
              className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", i !== active && "opacity-0")}
              style={{
                background:
                  i % 2 === 0
                    ? "radial-gradient(60% 50% at 75% 50%, rgb(189 238 54 / 0.10), transparent 70%)"
                    : "radial-gradient(60% 50% at 75% 50%, rgb(52 211 153 / 0.12), transparent 70%)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
