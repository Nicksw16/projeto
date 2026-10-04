// Tela do celular desenhada em canvas 2D (vira CanvasTexture na cena 3D).
// Tudo é função de um único número `t` (o "relógio" da conversa, dirigido pela rolagem):
//   0–1  tela de bloqueio às 23:47 + notificação   ·   1–1.5  desbloqueio
//   1.5–6  conversa: IA responde, oferece horários, confirma e manda o resumo para o dono.
// O estado é quantizado: só redesenha (e reenvia a textura) quando algo visível muda.

import { CHAT, CONFIRM, PICKED_SLOT, SLOTS, SUMMARY } from "./chat-script";

const FONT = '"Geist Variable", "Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const C = {
  bg: "#0b141a",
  header: "#1f2c34",
  inBubble: "#202c33",
  outBubble: "#005c4b",
  text: "#e9edef",
  meta: "rgba(233,237,239,0.62)",
  muted: "#8696a0",
  tick: "#53bdeb",
  lime: "#bdee36",
  lime300: "#d0f565",
  lime200: "#e1f99a",
  ink: "#050605",
  wa: "#25d366",
};

// Janelas da conversa (em unidades de `t`).
export const CHAT_END = 6;
const MSG_WIN: [number, number][] = [
  [1.15, 1.45],
  [2.2, 2.55],
  [3.0, 3.3],
  [4.1, 4.45],
  [4.75, 5.05],
];
const TYPING_WIN: [number, number, number][] = [
  // [início, fim, índice da mensagem que vai chegar]
  [1.6, 2.2, 1],
  [3.5, 4.1, 3],
];
const CONTACT_TYPING: [number, number][] = [
  [2.65, 3.0],
  [4.5, 4.75],
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const q = (v: number, n = 40) => Math.round(clamp01(v) * n) / n;
const easeOut = (v: number) => 1 - (1 - v) ** 3;
const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2);
const easeOutBack = (v: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * (v - 1) ** 3 + c1 * (v - 1) ** 2;
};

type Line = { text: string; w: number };
type Item = {
  from: "contato" | "ia";
  lines: Line[];
  x: number;
  y: number;
  w: number;
  h: number;
  options: boolean;
  card: boolean;
  time: string;
};

// Marca da Lynx (mesmo desenho de src/components/logo.tsx, viewBox 40).
const LYNX_HEAD = "M8 4.5 15 13h10l7-8.5 2 14.5 2.5 8.5L29 31l-9 5-9-5-7.5-3.5L6 19z";
const LYNX_CUTS = "M10.5 21.2q4-4.2 8 0-4 2.6-8 0zM21.5 21.2q4-4.2 8 0-4 2.6-8 0zM18.4 26.6h3.2L20 28.8z";

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export type ChatScreen = {
  canvas: HTMLCanvasElement;
  /** Redesenha se o estado visível mudou. Retorna true quando a textura precisa ser reenviada. */
  draw: (t: number) => boolean;
  /** Retângulo (0–1, origem no topo-esquerda) do cartão de confirmação dentro da tela. */
  cardRect: { x: number; y: number; w: number; h: number };
};

export function createChatScreen(width: number, aspect: number): ChatScreen {
  const W = Math.round(width);
  const H = Math.round(width / aspect);
  const U = W / 360; // desenhamos em "pontos" de um celular de 360 de largura
  const PH = H / U; // altura em pontos

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const main = canvas.getContext("2d")!;
  // Os helpers desenham em `ctx`; drawWith() aponta temporariamente para uma camada pré-renderizada.
  let ctx = main;
  const drawWith = (layer: CanvasRenderingContext2D, fn: () => void) => {
    ctx = layer;
    fn();
    ctx = main;
  };

  const font = (weight: number, size: number) => `${weight} ${size * U}px ${FONT}`;
  const text = (s: string, x: number, y: number, weight: number, size: number, color: string, align: CanvasTextAlign = "left") => {
    ctx.font = font(weight, size);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(s, x * U, y * U);
  };
  const measure = (s: string, weight: number, size: number) => {
    ctx.font = font(weight, size);
    return ctx.measureText(s).width / U;
  };
  const wrap = (s: string, max: number, weight: number, size: number): Line[] => {
    const words = s.split(" ");
    const lines: Line[] = [];
    let cur = "";
    for (const word of words) {
      const next = cur ? `${cur} ${word}` : word;
      if (measure(next, weight, size) > max && cur) {
        lines.push({ text: cur, w: measure(cur, weight, size) });
        cur = word;
      } else cur = next;
    }
    if (cur) lines.push({ text: cur, w: measure(cur, weight, size) });
    return lines;
  };

  // ---------- Layout da conversa (fixo: as mensagens descem de cima, nada se desloca) ----------
  const TOP = 46; // barra de status
  const HEADER_H = 64;
  const FS = 16.5; // corpo das mensagens — maior que o WhatsApp real para ler no 3D
  const LH = 22;
  const PAD = 10;
  const MAX_IN = 250;
  const MAX_OUT = 268;
  const items: Item[] = [];
  let y = TOP + HEADER_H + 82; // depois do chip "Hoje" e do aviso de fora do horário
  CHAT.forEach((m, i) => {
    const out = m.from === "ia";
    const options = i === 1;
    const card = i === 3;
    const lines = wrap(m.text, (out ? MAX_OUT : MAX_IN) - PAD * 2, 400, FS);
    const textW = Math.max(...lines.map((l) => l.w));
    let w = Math.max(textW + PAD * 2, out ? 120 : 70);
    if (options || card) w = MAX_OUT;
    let h = 7 + lines.length * LH + 18; // texto + linha da hora
    if (out) h += 18; // etiqueta "IA da Lynx"
    if (options) h += 40;
    if (card) h += 62;
    const x = out ? 360 - 10 - w : 10;
    const prev = items[items.length - 1];
    if (prev) y += prev.from === m.from ? 6 : 12;
    items.push({ from: m.from, lines, x, y, w, h, options, card, time: m.time });
    y += h;
  });

  const cardItem = items[3];
  const cardBox = { x: cardItem.x + PAD, y: cardItem.y + 7 + 18 + cardItem.lines.length * LH + 6, w: cardItem.w - PAD * 2, h: 54 };
  const cardRect = { x: cardBox.x / 360, y: cardBox.y / PH, w: cardBox.w / 360, h: cardBox.h / PH };

  // ---------- Ícones simples ----------
  const sparkle = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx * U, (cy - r) * U);
    ctx.quadraticCurveTo(cx * U, cy * U, (cx + r) * U, cy * U);
    ctx.quadraticCurveTo(cx * U, cy * U, cx * U, (cy + r) * U);
    ctx.quadraticCurveTo(cx * U, cy * U, (cx - r) * U, cy * U);
    ctx.quadraticCurveTo(cx * U, cy * U, cx * U, (cy - r) * U);
    ctx.fill();
  };
  const moon = (cx: number, cy: number, r: number, color: string, cut: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx * U, cy * U, r * U, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cut;
    ctx.beginPath();
    ctx.arc((cx + r * 0.45) * U, (cy - r * 0.35) * U, r * 0.85 * U, 0, Math.PI * 2);
    ctx.fill();
  };
  const lynxMark = (x: number, y0: number, size: number, bg: string) => {
    const s = (size * U) / 40;
    ctx.save();
    ctx.translate(x * U, y0 * U);
    ctx.scale(s, s);
    const g = ctx.createLinearGradient(4, 2, 36, 38);
    g.addColorStop(0, C.lime200);
    g.addColorStop(0.55, C.lime);
    g.addColorStop(1, "#34d399");
    ctx.fillStyle = g;
    ctx.fill(new Path2D(LYNX_HEAD));
    ctx.fillStyle = bg;
    ctx.fill(new Path2D(LYNX_CUTS));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.stroke(new Path2D("M8 4.5 7 .8M32 4.5 33 .8"));
    ctx.restore();
  };
  const chatGlyph = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx * U, cy * U, r * U, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo((cx - r * 0.75) * U, (cy + r * 0.45) * U);
    ctx.lineTo((cx - r * 1.05) * U, (cy + r * 1.1) * U);
    ctx.lineTo((cx - r * 0.2) * U, (cy + r * 0.92) * U);
    ctx.fill();
  };
  const doubleTick = (x: number, yy: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 * U;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x * U, (yy - 3) * U);
    ctx.lineTo((x + 3) * U, yy * U);
    ctx.lineTo((x + 8.5) * U, (yy - 6.5) * U);
    ctx.moveTo((x + 5.5) * U, (yy - 0.5) * U);
    ctx.lineTo((x + 6.5) * U, yy * U);
    ctx.lineTo((x + 12) * U, (yy - 6.5) * U);
    ctx.stroke();
  };
  const statusIcons = () => {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 4; i++) {
      rr(ctx, (262 + i * 5) * U, (27 - 3 - i * 2.4) * U, 3.2 * U, (3 + i * 2.4) * U, 0.8 * U);
      ctx.fill();
    }
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.7 * U;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(295 * U, 28 * U, (3 + i * 3.6) * U, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();
    }
    ctx.lineWidth = 1.2 * U;
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    rr(ctx, 312 * U, 18.5 * U, 25 * U, 12 * U, 3.5 * U);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    rr(ctx, 314 * U, 20.5 * U, 15 * U, 8 * U, 2 * U);
    ctx.fill();
    rr(ctx, 338.5 * U, 22.5 * U, 1.8 * U, 4 * U, 1 * U);
    ctx.fill();
  };

  // ---------- Bases estáticas pré-renderizadas (desenhadas uma vez) ----------
  const makeLayer = () => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  };

  const lockBase = makeLayer();
  const chatBase = makeLayer();

  const paintLockBase = () => {
    const l = lockBase.getContext("2d")!;
    const g = l.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#050a07");
    g.addColorStop(0.55, "#08130d");
    g.addColorStop(1, "#0c1d12");
    l.fillStyle = g;
    l.fillRect(0, 0, W, H);
    const glow = (x: number, yy: number, r: number, color: string) => {
      const rg = l.createRadialGradient(x * U, yy * U, 0, x * U, yy * U, r * U);
      rg.addColorStop(0, color);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      l.fillStyle = rg;
      l.fillRect(0, 0, W, H);
    };
    glow(300, PH - 90, 330, "rgba(189,238,54,0.20)");
    glow(40, PH - 30, 260, "rgba(37,211,102,0.16)");
    // estrelas (determinísticas)
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 46; i++) {
      const sx = rnd() * 360;
      const sy = 50 + rnd() * 300;
      l.fillStyle = `rgba(255,255,255,${0.15 + rnd() * 0.45})`;
      l.beginPath();
      l.arc(sx * U, sy * U, (0.5 + rnd() * 0.9) * U, 0, Math.PI * 2);
      l.fill();
    }
    drawWith(l, () => {
      moon(306, 92, 10, "rgba(239,252,201,0.9)", "#060c08");
      text("quinta-feira", 180, 132, 500, 17, "rgba(255,255,255,0.78)", "center");
      text("23:47", 180, 222, 300, 92, "#ffffff", "center");
      // atalhos da tela de bloqueio
      for (const cx of [54, 306]) {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.arc(cx * U, (PH - 62) * U, 23 * U, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.8 * U;
      rr(ctx, 50 * U, (PH - 72) * U, 8 * U, 20 * U, 2.5 * U);
      ctx.stroke();
      rr(ctx, 295 * U, (PH - 69) * U, 22 * U, 15 * U, 3.5 * U);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(306 * U, (PH - 61.5) * U, 4.2 * U, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      rr(ctx, 113 * U, (PH - 13) * U, 134 * U, 5 * U, 3 * U);
      ctx.fill();
    });
  };

  const paintChatBase = () => {
    const l = chatBase.getContext("2d")!;
    drawWith(l, () => {
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      // padrão discreto de fundo
      ctx.fillStyle = "rgba(255,255,255,0.028)";
      for (let yy = TOP + HEADER_H + 8; yy < PH - 60; yy += 22) {
        for (let xx = (yy / 22) % 2 ? 6 : 17; xx < 360; xx += 22) {
          ctx.beginPath();
          ctx.arc(xx * U, yy * U, 1.3 * U, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // cabeçalho
      ctx.fillStyle = C.header;
      ctx.fillRect(0, 0, W, (TOP + HEADER_H) * U);
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 2.2 * U;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(20 * U, (TOP + 23) * U);
      ctx.lineTo(13 * U, (TOP + 32) * U);
      ctx.lineTo(20 * U, (TOP + 41) * U);
      ctx.stroke();
      ctx.fillStyle = "#53656f";
      ctx.beginPath();
      ctx.arc(48 * U, (TOP + 32) * U, 19 * U, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(48 * U, (TOP + 32) * U, 19 * U, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#c9d3d8";
      ctx.beginPath();
      ctx.arc(48 * U, (TOP + 27) * U, 7 * U, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(48 * U, (TOP + 48) * U, 13 * U, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      text("Novo contato", 76, TOP + 29, 600, 17, C.text);
      // ícones de vídeo e ligação
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 1.9 * U;
      rr(ctx, 280 * U, (TOP + 25) * U, 16 * U, 13 * U, 3 * U);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(297 * U, (TOP + 30) * U);
      ctx.lineTo(303 * U, (TOP + 26) * U);
      ctx.lineTo(303 * U, (TOP + 37) * U);
      ctx.lineTo(297 * U, (TOP + 33) * U);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(322 * U, (TOP + 24) * U);
      ctx.quadraticCurveTo(320 * U, (TOP + 36) * U, 336 * U, (TOP + 40) * U);
      ctx.lineTo(338 * U, (TOP + 35) * U);
      ctx.lineTo(333 * U, (TOP + 32) * U);
      ctx.lineTo(330 * U, (TOP + 34) * U);
      ctx.quadraticCurveTo(326 * U, (TOP + 31) * U, 326 * U, (TOP + 28) * U);
      ctx.lineTo(328 * U, (TOP + 25) * U);
      ctx.lineTo(325 * U, (TOP + 21) * U);
      ctx.closePath();
      ctx.stroke();
      // chip "Hoje"
      const dy = TOP + HEADER_H + 12;
      ctx.fillStyle = "#182229";
      rr(ctx, 152 * U, dy * U, 56 * U, 22 * U, 7 * U);
      ctx.fill();
      text("Hoje", 180, dy + 15.5, 500, 12.5, C.muted, "center");
      // aviso: fora do horário, a IA atende
      const notice = "Fora do horário · a IA da Lynx responde por você";
      const nw = measure(notice, 500, 12) + 40;
      const nx = 180 - nw / 2;
      const ny = dy + 32;
      ctx.fillStyle = "rgba(189,238,54,0.09)";
      rr(ctx, nx * U, ny * U, nw * U, 26 * U, 9 * U);
      ctx.fill();
      ctx.strokeStyle = "rgba(189,238,54,0.28)";
      ctx.lineWidth = 1 * U;
      ctx.stroke();
      moon(nx + 15, ny + 13, 5.5, C.lime300, "#0f1a14");
      text(notice, nx + 26, ny + 17.5, 500, 12, C.lime300);
      // barra de digitação
      ctx.fillStyle = C.header;
      rr(ctx, 8 * U, (PH - 60) * U, 290 * U, 44 * U, 22 * U);
      ctx.fill();
      text("Mensagem", 46, PH - 32.5, 400, 16, C.muted);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1.7 * U;
      ctx.beginPath();
      ctx.arc(26 * U, (PH - 38) * U, 8.5 * U, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#00a884";
      ctx.beginPath();
      ctx.arc(328 * U, (PH - 38) * U, 22 * U, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      rr(ctx, 324.5 * U, (PH - 48) * U, 7 * U, 13 * U, 3.5 * U);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.6 * U;
      ctx.beginPath();
      ctx.arc(328 * U, (PH - 40) * U, 6 * U, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "rgba(233,237,239,0.85)";
      rr(ctx, 113 * U, (PH - 11) * U, 134 * U, 5 * U, 3 * U);
      ctx.fill();
    });
  };

  // ---------- Peças dinâmicas ----------
  const bubble = (it: Item, a: number, picked: number) => {
    if (a <= 0) return;
    const out = it.from === "ia";
    const s = 0.94 + 0.06 * easeOutBack(a);
    const dy = (1 - easeOut(a)) * 14;
    const ax = out ? it.x + it.w : it.x;
    ctx.save();
    ctx.globalAlpha = Math.min(1, a * 2.2);
    ctx.translate(ax * U, (it.y + dy) * U);
    ctx.scale(s, s);
    ctx.translate(-ax * U, -it.y * U);
    // corpo + rabinho
    ctx.fillStyle = out ? C.outBubble : C.inBubble;
    rr(ctx, it.x * U, it.y * U, it.w * U, it.h * U, 9 * U);
    ctx.fill();
    ctx.beginPath();
    if (out) {
      ctx.moveTo((it.x + it.w - 10) * U, it.y * U);
      ctx.lineTo((it.x + it.w + 8) * U, it.y * U);
      ctx.lineTo((it.x + it.w) * U, (it.y + 10) * U);
    } else {
      ctx.moveTo((it.x + 10) * U, it.y * U);
      ctx.lineTo((it.x - 8) * U, it.y * U);
      ctx.lineTo(it.x * U, (it.y + 10) * U);
    }
    ctx.fill();
    let yy = it.y + 7;
    if (out) {
      sparkle(it.x + PAD + 5, yy + 8, 5, C.lime300);
      text("IA da Lynx", it.x + PAD + 14, yy + 12.5, 600, 12.5, C.lime300);
      yy += 18;
    }
    for (const line of it.lines) {
      text(line.text, it.x + PAD, yy + 16, 400, FS, C.text);
      yy += LH;
    }
    if (it.options) {
      yy += 6;
      const gap = 6;
      const bw = (it.w - PAD * 2 - gap * 2) / 3;
      SLOTS.forEach((slot, i) => {
        const bx = it.x + PAD + i * (bw + gap);
        const on = slot === PICKED_SLOT ? picked : 0;
        ctx.fillStyle = on > 0 ? `rgba(189,238,54,${0.15 + 0.85 * on})` : "rgba(255,255,255,0.09)";
        rr(ctx, bx * U, yy * U, bw * U, 30 * U, 15 * U);
        ctx.fill();
        text(slot, bx + bw / 2, yy + 20, 600, 14.5, on > 0.5 ? C.ink : "#d9fdd3", "center");
      });
      yy += 34;
    }
    if (it.card) {
      yy += 6;
      const bx = it.x + PAD;
      const bw = it.w - PAD * 2;
      ctx.fillStyle = "rgba(5,6,5,0.38)";
      rr(ctx, bx * U, yy * U, bw * U, 54 * U, 10 * U);
      ctx.fill();
      ctx.strokeStyle = "rgba(189,238,54,0.35)";
      ctx.lineWidth = 1 * U;
      ctx.stroke();
      ctx.fillStyle = C.lime;
      rr(ctx, (bx + 9) * U, (yy + 10) * U, 34 * U, 34 * U, 9 * U);
      ctx.fill();
      // calendário com check (traço escuro sobre lima)
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 2 * U;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      rr(ctx, (bx + 17) * U, (yy + 19) * U, 18 * U, 17 * U, 3 * U);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo((bx + 21) * U, (yy + 16) * U);
      ctx.lineTo((bx + 21) * U, (yy + 21) * U);
      ctx.moveTo((bx + 31) * U, (yy + 16) * U);
      ctx.lineTo((bx + 31) * U, (yy + 21) * U);
      ctx.moveTo((bx + 21.5) * U, (yy + 28.5) * U);
      ctx.lineTo((bx + 25) * U, (yy + 32) * U);
      ctx.lineTo((bx + 31) * U, (yy + 25.5) * U);
      ctx.stroke();
      text(CONFIRM.title, bx + 52, yy + 24, 600, 15.5, C.lime200);
      text(CONFIRM.detail, bx + 52, yy + 42, 400, 13, "rgba(233,237,239,0.72)");
      yy += 58;
    }
    // hora (+ dois tiques azuis nas mensagens enviadas)
    const metaY = it.y + it.h - 6;
    text(it.time, it.x + it.w - (out ? 26 : 9), metaY, 400, 11.5, C.meta, "right");
    if (out) doubleTick(it.x + it.w - 22, metaY - 1.5, C.tick);
    ctx.restore();
  };

  const typingBubble = (next: Item, vis: number, phase: number) => {
    if (vis <= 0) return;
    const w = 72;
    const x = 360 - 10 - w;
    const y0 = next.y;
    ctx.save();
    ctx.globalAlpha = vis;
    ctx.fillStyle = C.outBubble;
    rr(ctx, x * U, y0 * U, w * U, 36 * U, 18 * U);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const p = (phase + 1 - i * 0.18) % 1;
      const lift = Math.max(0, Math.sin(p * Math.PI * 2)) * 4;
      ctx.fillStyle = `rgba(233,237,239,${0.45 + lift / 8})`;
      ctx.beginPath();
      ctx.arc((x + 22 + i * 14) * U, (y0 + 19 - lift) * U, 3.6 * U, 0, Math.PI * 2);
      ctx.fill();
    }
    sparkle(350 - measure("IA da Lynx digitando…", 500, 12) - 8, y0 + 51, 4.5, C.lime300);
    text("IA da Lynx digitando…", 350, y0 + 55, 500, 12, C.lime300, "right");
    ctx.restore();
  };

  const notification = (a: number) => {
    if (a <= 0) return;
    const e = easeOut(a);
    const x = 12;
    const y0 = 292 + (1 - e) * 36;
    ctx.save();
    ctx.globalAlpha = Math.min(1, a * 1.6);
    ctx.fillStyle = "rgba(34,41,37,0.86)";
    rr(ctx, x * U, y0 * U, 336 * U, 92 * U, 24 * U);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1 * U;
    ctx.stroke();
    ctx.fillStyle = C.wa;
    rr(ctx, (x + 14) * U, (y0 + 18) * U, 42 * U, 42 * U, 11 * U);
    ctx.fill();
    chatGlyph(x + 35, y0 + 38, 11, "#ffffff");
    ctx.fillStyle = C.wa;
    ctx.beginPath();
    ctx.arc((x + 35) * U, (y0 + 38) * U, 7.5 * U, 0, Math.PI * 2);
    ctx.fill();
    text("WhatsApp", x + 68, y0 + 28, 600, 13, "rgba(255,255,255,0.6)");
    text("agora", x + 322, y0 + 28, 400, 13, "rgba(255,255,255,0.5)", "right");
    text("Novo contato", x + 68, y0 + 52, 600, 16, "#ffffff");
    text(CHAT[0].text, x + 68, y0 + 75, 400, 16, "rgba(255,255,255,0.88)");
    ctx.restore();
  };

  const summary = (a: number) => {
    if (a <= 0) return;
    const e = easeOut(a);
    const x = 10;
    const y0 = -100 + e * 152;
    ctx.save();
    ctx.globalAlpha = Math.min(1, a * 1.8);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 24 * U;
    ctx.fillStyle = "rgba(22,28,24,0.97)";
    rr(ctx, x * U, y0 * U, 340 * U, 96 * U, 24 * U);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(189,238,54,0.38)";
    ctx.lineWidth = 1.2 * U;
    ctx.stroke();
    ctx.fillStyle = "#0e110f";
    rr(ctx, (x + 14) * U, (y0 + 18) * U, 44 * U, 44 * U, 12 * U);
    ctx.fill();
    lynxMark(x + 18, y0 + 22, 36, "#0e110f");
    text("Lynx · resumo", x + 70, y0 + 29, 600, 13, C.lime300);
    text("agora", x + 326, y0 + 29, 400, 13, "rgba(255,255,255,0.5)", "right");
    text(SUMMARY.title, x + 70, y0 + 54, 600, 15.5, "#ffffff");
    text(SUMMARY.detail, x + 70, y0 + 77, 400, 14.5, "rgba(255,255,255,0.74)");
    ctx.restore();
  };

  const statusBar = (clock: string, onLock: number) => {
    ctx.fillStyle = "#000";
    rr(ctx, 128 * U, 11 * U, 104 * U, 30 * U, 15 * U);
    ctx.fill();
    if (onLock < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - onLock;
      text(clock, 34, 32, 600, 16, "#ffffff");
      ctx.restore();
    }
    statusIcons();
  };

  // ---------- Estado quantizado ----------
  let lastKey = "";
  let painted = false;

  const draw = (t: number) => {
    const notif = q(win(t, 0.15, 0.75), 20);
    const unlock = q(easeInOut(win(t, 1.0, 1.5)), 20);
    const msgs = MSG_WIN.map(([a, b]) => q(win(t, a, b), 18));
    const typing = TYPING_WIN.map(([a, b]) => {
      const v = Math.min(win(t, a, a + 0.08), 1 - win(t, b - 0.06, b));
      return q(v, 10);
    });
    const phase = q((t * 5) % 1, 8);
    const picked = q(win(t, 3.0, 3.2), 10);
    const contactTyping = CONTACT_TYPING.some(([a, b]) => t >= a && t < b) ? 1 : 0;
    const sum = q(win(t, 5.4, 5.9), 20);
    const clock = t >= 2.9 ? "23:48" : "23:47";
    const anyTyping = typing.some((v) => v > 0);
    const key = [notif, unlock, ...msgs, ...typing, anyTyping ? phase : 0, picked, contactTyping, sum, clock].join("|");
    if (key === lastKey && painted) return false;
    lastKey = key;
    painted = true;

    if (unlock > 0) {
      ctx.drawImage(chatBase, 0, 0);
      text(contactTyping ? "digitando…" : "online", 76, TOP + 47, 400, 13, contactTyping ? C.wa : C.muted);
      items.forEach((it, i) => bubble(it, msgs[i], picked));
      TYPING_WIN.forEach(([, , next], i) => typingBubble(items[next], typing[i], phase));
    }
    if (unlock < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - unlock;
      ctx.translate(0, -unlock * H * 0.35);
      ctx.drawImage(lockBase, 0, 0);
      notification(notif);
      ctx.restore();
    }
    statusBar(clock, 0);
    summary(sum);
    return true;
  };

  paintLockBase();
  paintChatBase();

  return { canvas, draw, cardRect };
}
