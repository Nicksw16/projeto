// Cena 3D "o celular das 23h47" — carregada sob demanda (import dinâmico) pela seção Scroll3D.
// three.js desenha; anime.js 4 dirige tudo com UMA timeline amarrada à rolagem (onScroll + sync):
// rotação do celular, tela acendendo, reflexo no vidro, brilho, conversa e cartão que salta da tela.
// Renderiza só quando algo muda e só com a seção visível.
import { createAnimatable, createTimeline, onScroll, stagger, type Timeline } from "animejs";
import "animejs/adapters/three";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  EquirectangularReflectionMapping,
  Euler,
  Float32BufferAttribute,
  DirectionalLight,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  ShapeGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  Shape,
} from "three";

import { STEPS } from "./chat-script";
import { CHAT_END, createChatScreen } from "./chat-screen";
import { createPhone, PHONE, SCREEN } from "./phone-model";

export type PhoneSceneOptions = {
  /** Onde o canvas entra (absolute inset-0, pointer-events: none). */
  host: HTMLElement;
  /** Seção alta que define o progresso da rolagem. */
  section: HTMLElement;
  /** Palco sticky (100svh) — medido para enquadrar o celular. */
  stage: HTMLElement;
  /** Coluna de texto (computador) e linha da legenda (celular): o celular ocupa o espaço que sobra. */
  textBox: HTMLElement;
  anchor: HTMLElement;
  steps: HTMLElement[];
  caption: HTMLElement | null;
  rail: HTMLElement | null;
  glow: HTMLElement | null;
  signal: AbortSignal;
  onReady: () => void;
  onFail: () => void;
};

const FOV = 30;
const TOTAL = 1000;
// Momento (na timeline de 0–1000) em que cada etapa do texto acende.
const STEP_AT = [190, 352, 405, 545, 650];
const BUZZ_AT = 168;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

// Ambiente procedural (equiretangular) para os reflexos: céu claro em cima, faixa lima de um lado,
// faixa branca do outro, painel suave na frente e verde fraco atrás. Sem HDR externo (CSP).
function envTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, 0, 256);
  bg.addColorStop(0, "#3a403b");
  bg.addColorStop(0.18, "#151915");
  bg.addColorStop(0.5, "#070907");
  bg.addColorStop(1, "#020302");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);
  ctx.globalCompositeOperation = "lighter";
  const strip = (x0: number, x1: number, y0: number, y1: number, color: string) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  };
  strip(0, 512, 0, 26, "rgba(255,255,255,0.75)");
  strip(214, 298, 56, 196, "rgba(189,238,54,0.95)");
  strip(470, 512, 64, 176, "rgba(232,240,233,0.85)");
  strip(0, 40, 64, 176, "rgba(232,240,233,0.85)");
  strip(344, 424, 70, 118, "rgba(255,255,255,0.45)");
  strip(96, 160, 80, 156, "rgba(37,211,102,0.35)");
  const t = new CanvasTexture(c);
  t.mapping = EquirectangularReflectionMapping;
  t.colorSpace = SRGBColorSpace;
  return t;
}

// Cartão "Horário confirmado" que salta da conversa para fora da tela.
function cardTexture() {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 352;
  const ctx = c.getContext("2d")!;
  const font = (w: number, s: number) => `${w} ${s}px "Geist Variable", system-ui, sans-serif`;
  ctx.fillStyle = "#0e110f";
  ctx.beginPath();
  ctx.roundRect(4, 4, 632, 344, 40);
  ctx.fill();
  ctx.strokeStyle = "rgba(189,238,54,0.6)";
  ctx.lineWidth = 3;
  ctx.stroke();
  const hl = ctx.createLinearGradient(0, 0, 0, 180);
  hl.addColorStop(0, "rgba(189,238,54,0.10)");
  hl.addColorStop(1, "rgba(189,238,54,0)");
  ctx.fillStyle = hl;
  ctx.beginPath();
  ctx.roundRect(6, 6, 628, 200, 38);
  ctx.fill();
  // selo lima com check escuro (nunca texto branco sobre lima)
  ctx.fillStyle = "#bdee36";
  ctx.beginPath();
  ctx.arc(104, 150, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#050605";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(80, 152);
  ctx.lineTo(98, 170);
  ctx.lineTo(130, 134);
  ctx.stroke();
  ctx.fillStyle = "#a3a3a3";
  ctx.font = font(500, 26);
  ctx.fillText("Horário confirmado", 186, 118);
  ctx.fillStyle = "#e1f99a";
  ctx.font = font(600, 56);
  ctx.fillText("Amanhã, 14:00", 184, 182);
  ctx.fillStyle = "#d4d4d4";
  ctx.font = font(400, 25);
  ctx.fillText("Lembrete enviado 1h antes", 186, 224);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(40, 266, 560, 2);
  ctx.fillStyle = "#d0f565";
  ctx.font = font(600, 23);
  ctx.fillText("✦  Agendado pela IA da Lynx · 23:48", 44, 310);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function outline(grow: number, thickness: number) {
  const make = (w: number, h: number, r: number) => {
    const s = new Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  };
  const outer = make(PHONE.w + grow + thickness, PHONE.h + grow + thickness, PHONE.r + (grow + thickness) / 2);
  outer.holes.push(make(PHONE.w + grow, PHONE.h + grow, PHONE.r + grow / 2));
  return new ShapeGeometry(outer, 16);
}

export async function mountPhoneScene(o: PhoneSceneOptions): Promise<() => void> {
  // A tela usa a fonte do site; espera ela carregar (com limite) para o canvas não sair com fonte de sistema.
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('400 32px "Geist Variable"'),
        document.fonts.load('600 32px "Geist Variable"'),
        document.fonts.load('300 64px "Geist Variable"'),
      ]),
      sleep(1500),
    ]);
  } catch {
    /* segue com a fonte de sistema */
  }
  if (o.signal.aborted) return () => {};

  const mobile = matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    o.onFail();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  const envTex = envTexture();
  scene.environment = envTex;

  // ---------- Objetos ----------
  const chat = createChatScreen(mobile ? 640 : 720, SCREEN.w / SCREEN.h);
  const screenTex = new CanvasTexture(chat.canvas);
  screenTex.colorSpace = SRGBColorSpace;
  screenTex.generateMipmaps = false;
  screenTex.minFilter = LinearFilter;
  chat.draw(0);

  const phone = createPhone(screenTex);
  const glowTex = glowTexture();

  // Recorte lima por trás (desenha a silhueta quando o celular está de costas) + chave branca suave.
  const rim = new DirectionalLight(0xbdee36, 0);
  rim.position.set(-2.5, 1.2, -2.2);
  const key = new DirectionalLight(0xffffff, 0.55);
  key.position.set(2, 2.5, 3);
  scene.add(rim, key);

  const rig = new Group(); // posição na tela (layout)
  const tilt = new Group(); // inclinação pelo mouse (createAnimatable)
  const turn = new Group(); // coreografia da rolagem (timeline)
  const buzz = new Group(); // vibração quando a mensagem chega
  scene.add(rig);
  rig.add(tilt);
  tilt.add(turn);
  turn.add(buzz);
  buzz.add(phone.group);

  const glowGeo = new PlaneGeometry(3.4, 3.4);
  const glowMat = new MeshBasicMaterial({ map: glowTex, color: 0x9fd316, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const glow = new Mesh(glowGeo, glowMat);
  glow.position.z = -0.6;
  rig.add(glow);

  // Ondas de notificação (contorno do celular que cresce e some).
  const rippleGeo = outline(0.02, 0.018);
  const rippleMats: MeshBasicMaterial[] = [];
  const ripples = [0, 1].map(() => {
    const m = new MeshBasicMaterial({ color: 0xbdee36, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    rippleMats.push(m);
    const mesh = new Mesh(rippleGeo, m);
    mesh.visible = false;
    buzz.add(mesh);
    return mesh;
  });

  // Cartão de confirmação.
  const CW = 0.62;
  const CH = (CW * 352) / 640;
  const cardTex = cardTexture();
  const cardGeo = new PlaneGeometry(CW, CH);
  const cardMat = new MeshBasicMaterial({ map: cardTex, transparent: true, opacity: 0, depthWrite: false });
  const card = new Mesh(cardGeo, cardMat);
  card.visible = false;
  card.renderOrder = 3;
  const cardGlowMat = new MeshBasicMaterial({ map: glowTex, color: 0xbdee36, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const cardGlow = new Mesh(cardGeo, cardGlowMat);
  cardGlow.scale.set(1.9, 2.3, 1);
  cardGlow.position.z = -0.02;
  card.add(cardGlow);
  tilt.add(card);

  // Céu de 23h47: poucas estrelas ao fundo.
  const starCount = mobile ? 110 : 220;
  const starPos = new Float32Array(starCount * 3);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (rnd() - 0.5) * 16;
    starPos[i * 3 + 1] = (rnd() - 0.5) * 10;
    starPos[i * 3 + 2] = -6 - rnd() * 10;
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute("position", new Float32BufferAttribute(starPos, 3));
  const starMat = new PointsMaterial({ size: 0.07, map: glowTex, color: 0xe1f99a, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
  const stars = new Points(starGeo, starMat);
  scene.add(stars);

  // ---------- Estado abstrato (animado pela timeline, combinado no frame com o layout) ----------
  const S = { zoom: 0, chat: 0, card: 0, drift: 0 };

  // Enquadramento: o celular ocupa o espaço livre ao lado (computador) ou abaixo (celular) do texto.
  const L = { near: 4, far: 8.5, nx0: 0, ny0: 0, nx1: 0, ny1: 0, stacked: false, w: 1, h: 1 };
  const cardEnd = new Vector3();
  const cardEndQ = new Quaternion();
  const cardEndScale = new Vector3(1, 1, 1);
  const tanH = Math.tan((FOV * Math.PI) / 360);

  const measure = () => {
    const r = o.stage.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    L.w = w;
    L.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    L.stacked = w < 1024 || w / h < 1.05;
    let region: { l: number; r: number; t: number; b: number };
    if (L.stacked) {
      const a = o.anchor.getBoundingClientRect();
      region = { l: 14, r: w - 14, t: a.bottom - r.top + 14, b: h * 1.02 };
    } else {
      const tb = o.textBox.getBoundingClientRect();
      region = { l: tb.right - r.left + 40, r: w - 40, t: 92, b: h - 32 };
    }
    const rw = Math.max(80, region.r - region.l);
    const rh = Math.max(120, region.b - region.t);
    const pxH = Math.min(rh, rw * (PHONE.h / PHONE.w) * (L.stacked ? 0.94 : 0.66));
    L.near = (PHONE.h * h) / (pxH * 2 * tanH);
    L.far = L.near * 2.15;
    const cx = (region.l + region.r) / 2;
    const cy = (region.t + region.b) / 2;
    L.nx1 = (cx / w) * 2 - 1;
    L.ny1 = -((cy / h) * 2 - 1);
    L.nx0 = L.nx1 * 0.92;
    L.ny0 = L.ny1 - 0.06;
    if (L.stacked) {
      cardEnd.set(0, -0.36, 0.62);
      cardEndQ.setFromEuler(new Euler(-0.14, 0.05, -0.05));
      cardEndScale.setScalar(1);
    } else {
      cardEnd.set(-0.58, -0.36, 0.5);
      cardEndQ.setFromEuler(new Euler(-0.12, 0.36, 0.04));
      cardEndScale.setScalar(1.12);
    }
  };

  // Pose inicial do cartão = exatamente sobre o cartão desenhado na conversa.
  const cr = chat.cardRect;
  const cardAnchor = new Vector3((cr.x + cr.w / 2 - 0.5) * SCREEN.w, (0.5 - (cr.y + cr.h / 2)) * SCREEN.h, PHONE.d / 2 + 0.004);
  const cardStartScale = new Vector3((cr.w * SCREEN.w) / CW, (cr.h * SCREEN.h) / CH, 1);
  const tmpV = new Vector3();
  const tmpQ = new Quaternion();
  const tmpS = new Vector3();

  // ---------- Render sob demanda ----------
  let visible = false;
  let dirty = true;
  let queued = false;
  let disposed = false;
  let lastStep = -2;
  let prevTime = 0;

  const frame = () => {
    queued = false;
    if (disposed) return;
    if (!visible) {
      dirty = true;
      return;
    }
    dirty = false;
    // câmera fixa na origem; o "rig" vai até a distância/posição de tela pedidas
    const d = L.far + (L.near - L.far) * S.zoom;
    const nx = L.nx0 + (L.nx1 - L.nx0) * Math.min(1, S.zoom * 1.4);
    const ny = L.ny0 + (L.ny1 - L.ny0) * Math.min(1, S.zoom * 1.4);
    rig.position.set(nx * d * tanH * camera.aspect, ny * d * tanH, -d);
    stars.position.z = S.zoom * 1.6;
    stars.rotation.z = S.chat * 0.02;

    // cartão: da conversa (preso ao celular) até a frente da cena
    const k = S.card;
    card.visible = k > 0.002;
    if (card.visible) {
      turn.updateMatrix();
      tmpV.copy(cardAnchor).applyMatrix4(turn.matrix);
      const end = tmpS.copy(cardEnd);
      end.y += S.drift * 0.1;
      end.z += S.drift * 0.08;
      card.position.lerpVectors(tmpV, end, k);
      tmpQ.copy(cardEndQ);
      card.quaternion.slerpQuaternions(turn.quaternion, tmpQ, k);
      card.rotateY(S.drift * 0.14);
      card.scale.lerpVectors(cardStartScale, cardEndScale, k);
      const a = Math.min(1, k / 0.22);
      cardMat.opacity = a;
      cardGlowMat.opacity = a * 0.32;
    }

    const uploaded = chat.draw(S.chat);
    if (uploaded) screenTex.needsUpdate = true;
    renderer.render(scene, camera);
  };

  const invalidate = () => {
    if (queued || disposed) return;
    queued = true;
    queueMicrotask(frame);
  };

  // ---------- Vibração + ondas quando a mensagem chega (efeito de tempo, toca uma vez ao passar) ----------
  let buzzTl: Timeline | null = null;
  const playBuzz = () => {
    buzzTl?.revert();
    ripples.forEach((m) => (m.visible = true));
    buzzTl = createTimeline({ onUpdate: invalidate, onComplete: invalidate })
      .add(buzz, { rotateZ: [0, 2.4, -2.4, 2, -2, 1.2, -0.8, 0], x: [0, 0.006, -0.006, 0.005, -0.004, 0], duration: 620, ease: "linear" }, 0)
      .add(ripples, { scale: [1, 1.32], opacity: [0.75, 0], duration: 1100, ease: "outQuad", delay: stagger(260) }, 0);
  };

  // ---------- Etapas do texto ----------
  const updateDom = (time: number) => {
    let step = -1;
    for (let i = 0; i < STEP_AT.length; i++) if (time >= STEP_AT[i]) step = i;
    if (step !== lastStep) {
      lastStep = step;
      o.steps.forEach((el, i) => el.setAttribute("data-state", i < step ? "done" : i === step ? "active" : "todo"));
      if (o.caption && step >= 0) o.caption.textContent = `${STEPS[step].time} · ${STEPS[step].label}`;
    }
    if (prevTime < BUZZ_AT && time >= BUZZ_AT && time < BUZZ_AT + 80) playBuzz();
    prevTime = time;
  };

  // ---------- Valores iniciais ----------
  turn.rotation.set((16 * Math.PI) / 180, (236 * Math.PI) / 180, (-10 * Math.PI) / 180);
  turn.position.y = -0.3;
  measure();

  // ---------- A timeline da rolagem (0–1000 = seção entrando por baixo até sair por cima) ----------
  const screenMat = phone.screenMesh;
  // A timeline não toca sozinha: quem define o tempo dela é a rolagem (ver "Rolagem → timeline" abaixo).
  const tl = createTimeline({
    autoplay: false,
    defaults: { ease: "inOutSine" },
    onUpdate: (self) => {
      updateDom(self.currentTime);
      invalidate();
    },
  })
    // celular: de costas, girando devagar → vira para você → acompanha a conversa → se afasta
    .add(turn, { rotateY: [236, 196], rotateX: [16, 14], duration: 170, ease: "linear" }, 0)
    .add(turn, { rotateY: -16, rotateX: 4, rotateZ: [-10, 0], y: [-0.3, 0], duration: 175, ease: "inOutCubic" }, 170)
    .add(turn, { rotateY: -7, rotateX: 1.5, duration: 250 }, 350)
    .add(turn, { rotateY: -19, rotateZ: 1.5, duration: 70, ease: "outCubic" }, 600)
    .add(turn, { rotateY: -36, rotateX: -12, rotateZ: 3, y: 0.28, duration: 300, ease: "inSine" }, 700)
    // aproximação (zoom abstrato; o layout converte em distância)
    .add(S, { zoom: [0, 0.6], duration: 170, ease: "outCubic" }, 150)
    .add(S, { zoom: 0.93, duration: 85 }, 325)
    .add(S, { zoom: 1, duration: 200 }, 420)
    .add(S, { zoom: 0.84, duration: 70 }, 630)
    .add(S, { zoom: 0.58, duration: 300, ease: "inSine" }, 700)
    // 23:47 — a tela acende (ainda de costas, a luz vaza pelo brilho atrás)
    .add(screenMat, { emissiveIntensity: [0, 1], duration: 45, ease: "outQuad" }, 160)
    .add(glow, { opacity: [0, 0.5], scale: [0.55, 1], duration: 90, ease: "outQuad" }, 150)
    .add(glow, { opacity: 0.85, scale: 1.12, duration: 60 }, 595)
    .add(glow, { opacity: 0.35, duration: 300 }, 700)
    .add(phone.frameMesh.material[1], { envMapIntensity: [0.5, 1.3], duration: 200 }, 140)
    .add(rim, { intensity: [0.6, 2.4], duration: 90, ease: "outQuad" }, 150)
    .add(rim, { intensity: 1.2, duration: 120 }, 330)
    .add(stars, { opacity: [0, 0.75], duration: 160, ease: "linear" }, 20)
    // reflexo varrendo o vidro quando vira e quando confirma
    .add(phone.glareTexture, { offsetX: [-0.8, 0.8], duration: 150 }, 235)
    .add(phone.glareTexture, { offsetX: [-0.8, 0.8], duration: 90 }, 592)
    // relógio da conversa
    .add(S, { chat: [0, 0.9], duration: 110, ease: "linear" }, 190)
    .add(S, { chat: CHAT_END, duration: 400, ease: "linear" }, 300)
    // cartão salta da tela
    .add(S, { card: [0, 1], duration: 75, ease: "outBack(1.2)" }, 592)
    .add(S, { drift: [0, 1], duration: 300, ease: "linear" }, 700);

  // DOM no mesmo relógio: trilho de progresso, troca frase→legenda (celular) e brilho de fundo.
  if (o.rail) tl.add(o.rail, { scaleY: [0, 1], duration: 510, ease: "linear" }, 190);
  tl.add(o.stage, { "--s3d-chat": [0, 1], duration: 45, ease: "linear" }, 300);
  if (o.glow) tl.add(o.glow, { opacity: [0.25, 1], duration: 90 }, 590);
  // garante duração total = 1000 (progresso da timeline = progresso da rolagem)
  tl.add(S, { drift: 1, duration: 1 }, TOTAL - 1);

  // ---------- Rolagem → timeline ----------
  // onScroll (anime.js) mede o progresso da seção: 0 = topo dela na base da tela, 1 = fim dela no topo.
  // Um laço próprio aproxima o tempo da timeline desse alvo com amortecimento exponencial por tempo real
  // (igual em 30, 60 ou 120 Hz). O `sync: <número>` do anime suaviza por tick e, a ~6 quadros/s, parava
  // no meio do caminho (o wakeTicker de 500 ms expira) — então usamos o progresso cru e suavizamos aqui.
  const SMOOTH = 0.085; // constante de tempo em segundos
  const initial = (() => {
    const r = o.section.getBoundingClientRect();
    return Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight)));
  })();
  let target = initial;
  let shown = initial;
  let raf = 0;
  let lastNow = 0;
  const follow = (now: number) => {
    const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 1 / 60;
    lastNow = now;
    shown += (target - shown) * (1 - Math.exp(-dt / SMOOTH));
    if (Math.abs(target - shown) < 0.0003) shown = target;
    tl.seek(shown * TOTAL);
    if (shown === target) {
      raf = 0;
      lastNow = 0;
    } else raf = requestAnimationFrame(follow);
  };
  const scroller = onScroll({
    target: o.section,
    enter: "bottom top",
    leave: "top bottom",
    onUpdate: (self) => {
      target = self.progress;
      if (!raf && !disposed) raf = requestAnimationFrame(follow);
    },
  });
  tl.seek(shown * TOTAL);

  // ---------- Mouse (só computador): inclinação suave com createAnimatable ----------
  const finePointer = matchMedia("(pointer: fine)").matches;
  const tiltA = finePointer ? createAnimatable(tilt, { rotateX: 900, rotateY: 900, ease: "out(3)", onUpdate: invalidate }) : null;
  const onPointer = (e: PointerEvent) => {
    if (!tiltA || !visible || L.stacked) return;
    tiltA.rotateY((e.clientX / window.innerWidth - 0.5) * 9);
    tiltA.rotateX((e.clientY / window.innerHeight - 0.5) * 6);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // ---------- Visibilidade e tamanho ----------
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && dirty) invalidate();
    },
    { rootMargin: "80px 0px" },
  );
  io.observe(o.section);
  const ro = new ResizeObserver(() => {
    measure();
    dirty = true;
    invalidate();
  });
  ro.observe(o.stage);

  const onLost = (e: Event) => {
    e.preventDefault();
    if (!disposed) o.onFail();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  // Compila shaders (e gera o PMREM do ambiente) antes de mostrar, para não engasgar na primeira rolagem.
  o.host.appendChild(canvas);
  if (renderer.extensions.has("KHR_parallel_shader_compile")) {
    try {
      await renderer.compileAsync(scene, camera);
    } catch {
      /* compila no primeiro render */
    }
  }

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    scroller.revert();
    tl.revert();
    buzzTl?.revert();
    tiltA?.revert();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    canvas.removeEventListener("webglcontextlost", onLost);
    phone.dispose();
    [glowGeo, rippleGeo, cardGeo, starGeo].forEach((g) => g.dispose());
    [glowMat, cardMat, cardGlowMat, starMat, ...rippleMats].forEach((m) => m.dispose());
    [screenTex, envTex, glowTex, cardTex].forEach((t) => t.dispose());
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  if (o.signal.aborted) {
    dispose();
    return () => {};
  }
  // primeiro quadro já com o estado da rolagem atual
  updateDom(tl.currentTime);
  visible = true;
  frame();
  visible = o.section.getBoundingClientRect().top < window.innerHeight + 80 && o.section.getBoundingClientRect().bottom > -80;
  o.onReady();
  return dispose;
}
