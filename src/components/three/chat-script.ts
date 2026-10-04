// Roteiro da simulação "o celular das 23h47" — usado pelo texto da seção (HTML), pelo visual estático
// e pela tela 3D (CanvasTexture). Ponto de vista: o celular do dono do negócio, à noite.

export type ChatLine = {
  from: "contato" | "ia";
  text: string;
  time: string;
};

export const SLOTS = ["09:30", "14:00", "16:30"] as const;
export const PICKED_SLOT = "14:00";

export const CHAT: ChatLine[] = [
  { from: "contato", text: "Oi! Vocês atendem amanhã?", time: "23:47" },
  { from: "ia", text: "Oi! Atendemos sim. Para amanhã tenho estes horários:", time: "23:47" },
  { from: "contato", text: "14h, por favor!", time: "23:48" },
  { from: "ia", text: "Prontinho! Seu horário está confirmado.", time: "23:48" },
  { from: "contato", text: "Perfeito, obrigada!", time: "23:48" },
];

export const CONFIRM = { title: "Amanhã, 14:00", detail: "Lembrete 1h antes" } as const;

export const SUMMARY = {
  title: "Horário marcado: amanhã, 14:00.",
  detail: "Nada pendente para você.",
} as const;

// Etapas que acendem ao lado do celular conforme a rolagem.
export const STEPS = [
  { time: "23:47", label: "Chega uma mensagem" },
  { time: "23:47", label: "A IA responde na hora" },
  { time: "23:48", label: "Entende e oferece horários" },
  { time: "23:48", label: "Marca e confirma" },
  { time: "Você", label: "Só é chamado se precisar" },
] as const;
