// Celular 3D procedural: corpo extrudado com bisel (borda fina metálica), vidro frontal, tela emissiva
// (CanvasTexture), botões laterais, módulo de câmera no verso e um reflexo que varre o vidro.
import {
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  AdditiveBlending,
  BoxGeometry,
  type BufferGeometry,
  type Material,
  type Texture,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
} from "three";

export const PHONE = { w: 0.74, h: 1.52, d: 0.085, r: 0.12, bevel: 0.018, bezel: 0.016 } as const;
export const SCREEN = {
  w: PHONE.w - PHONE.bevel * 2 - PHONE.bezel * 2,
  h: PHONE.h - PHONE.bevel * 2 - PHONE.bezel * 2,
} as const;

function roundedRect(w: number, h: number, r: number) {
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
}

// ShapeGeometry usa as coordenadas da forma como UV; normalizamos para 0..1 para a textura cobrir a tela.
function flatRounded(w: number, h: number, r: number, segments = 14) {
  const g = new ShapeGeometry(roundedRect(w, h, r), segments);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return g;
}

function glareTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  // faixa diagonal; colunas das bordas ficam transparentes (ClampToEdge não "borra" o brilho)
  const g = ctx.createLinearGradient(40, 0, 216, 256);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.42, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.9)");
  g.addColorStop(0.56, "rgba(255,255,255,0.25)");
  g.addColorStop(0.62, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export type PhoneModel = {
  group: Group;
  screenMesh: Mesh<BufferGeometry, MeshStandardMaterial>;
  frameMesh: Mesh<BufferGeometry, MeshStandardMaterial[]>;
  glareMesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  glareTexture: Texture;
  dispose: () => void;
};

export function createPhone(screenTexture: Texture): PhoneModel {
  const { w, h, d, r, bevel, bezel } = PHONE;
  const group = new Group();
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const track = <G extends BufferGeometry>(g: G) => (geometries.push(g), g);
  const mat = <M extends Material>(m: M) => (materials.push(m), m);

  // Corpo: forma = face plana; o bisel cresce para fora até a largura total.
  const depth = d - bevel * 2;
  const body = track(
    new ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, r - bevel), {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 6,
      curveSegments: 18,
    }),
  );
  body.translate(0, 0, -depth / 2);
  const backMat = mat(new MeshStandardMaterial({ color: 0x2c332e, metalness: 0.55, roughness: 0.3 }));
  const frameMat = mat(new MeshStandardMaterial({ color: 0x737c75, metalness: 1, roughness: 0.24, envMapIntensity: 1.2 }));
  const frameMesh = new Mesh(body, [backMat, frameMat]);
  group.add(frameMesh);

  // Vidro frontal (preto brilhante) e tela emissiva logo acima.
  const front = d / 2;
  const glassMat = mat(new MeshStandardMaterial({ color: 0x030403, metalness: 0.1, roughness: 0.08 }));
  const glass = new Mesh(track(flatRounded(w - bevel * 2, h - bevel * 2, r - bevel)), glassMat);
  glass.position.z = front + 0.0004;
  group.add(glass);

  const screenMat = mat(
    new MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0,
      roughness: 0.14,
      metalness: 0,
    }),
  );
  const screenMesh = new Mesh(track(flatRounded(SCREEN.w, SCREEN.h, r - bevel - bezel * 0.6)), screenMat);
  screenMesh.position.z = front + 0.0012;
  group.add(screenMesh);

  // Reflexo que varre o vidro (offset da textura animado pelo anime.js).
  const glareTex = glareTexture();
  const glareMat = mat(
    new MeshBasicMaterial({ map: glareTex, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false }),
  );
  const glareMesh = new Mesh(track(flatRounded(w - bevel * 2, h - bevel * 2, r - bevel)), glareMat);
  glareMesh.position.z = front + 0.002;
  glareTex.offset.x = -0.8;
  group.add(glareMesh);

  // Botões laterais.
  const btnGeo = track(new BoxGeometry(0.014, 1, 0.03));
  const buttons: [number, number, number][] = [
    [w / 2 + 0.002, 0.3, 0.2],
    [-w / 2 - 0.002, 0.38, 0.1],
    [-w / 2 - 0.002, 0.22, 0.14],
  ];
  for (const [x, y, len] of buttons) {
    const b = new Mesh(btnGeo, frameMat);
    b.position.set(x, y, 0);
    b.scale.y = len;
    group.add(b);
  }

  // Módulo de câmera no verso.
  const camShape = roundedRect(0.27, 0.27, 0.075);
  const camGeo = track(new ExtrudeGeometry(camShape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 12 }));
  const camBump = new Mesh(camGeo, frameMat);
  camBump.position.set(w / 2 - 0.2, h / 2 - 0.2, -d / 2 - 0.004);
  camBump.rotation.y = Math.PI;
  group.add(camBump);
  const lensRing = track(new CylinderGeometry(0.048, 0.048, 0.022, 28));
  const lensGlass = track(new CircleGeometry(0.036, 28));
  const lensMat = mat(new MeshStandardMaterial({ color: 0x05080a, metalness: 0.6, roughness: 0.05 }));
  const lenses: [number, number][] = [
    [-0.055, 0.055],
    [-0.055, -0.055],
    [0.06, 0],
  ];
  for (const [lx, ly] of lenses) {
    const ring = new Mesh(lensRing, frameMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(camBump.position.x - lx, camBump.position.y + ly, -d / 2 - 0.022);
    group.add(ring);
    const lens = new Mesh(lensGlass, lensMat);
    lens.rotation.y = Math.PI;
    lens.position.set(ring.position.x, ring.position.y, -d / 2 - 0.0335);
    group.add(lens);
  }

  return {
    group,
    screenMesh,
    frameMesh,
    glareMesh,
    glareTexture: glareTex,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      glareTex.dispose();
    },
  };
}
