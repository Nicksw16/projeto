import type { LucideIcon } from "lucide-react";
import { Scissors, ShoppingBag, Stethoscope, UtensilsCrossed } from "lucide-react";

import type { ChatScript } from "@/components/ui/whatsapp-phone";

// Exemplos por tipo de negócio usados nas demos (simulações — não são clientes reais).
export type Niche = {
  id: string;
  label: string;
  icon: LucideIcon;
  headline: string;
  does: string[];
  script: ChatScript;
};

export const niches: Niche[] = [
  {
    id: "clinica",
    label: "Clínica",
    icon: Stethoscope,
    headline: "Agenda cheia sem a recepção parar para responder.",
    does: ["Marca, remarca e confirma consultas", "Envia lembrete antes do horário", "Tira dúvidas sobre convênios e preparo", "Passa casos delicados para a equipe"],
    script: {
      business: "Sua clínica",
      steps: [
        { wait: 700, message: { id: 1, from: "client", text: "Oi! Vocês têm horário pra limpeza essa semana?", time: "23:47" } },
        { wait: 1500, message: { id: 2, from: "bot", text: "Olá! 👋 Sou a assistente virtual da clínica. Tenho estes horários para limpeza:", options: ["Qui 10h", "Qui 15h", "Sex 9h"], time: "23:47" } },
        { wait: 1900, message: { id: 3, from: "client", text: "Quinta 15h, por favor", pick: "Qui 15h", time: "23:48" } },
        { wait: 1500, message: { id: 4, from: "bot", text: "Prontinho! ✅ Sua consulta está marcada.", card: { title: "Consulta confirmada", detail: "Quinta, 15:00 · lembrete 1 dia antes" }, time: "23:48" } },
        { wait: 1800, message: { id: 5, from: "client", text: "Obrigada! 😊", time: "23:48" } },
        { wait: 1400, message: { id: 6, from: "bot", text: "Até quinta! Qualquer dúvida é só chamar 💚", time: "23:48" } },
      ],
    },
  },
  {
    id: "salao",
    label: "Salão",
    icon: Scissors,
    headline: "Horários preenchidos enquanto você atende na cadeira.",
    does: ["Mostra horários livres e reserva", "Confirma e lembra o cliente", "Envia tabela de serviços e valores", "Reorganiza quando alguém desmarca"],
    script: {
      business: "Seu salão",
      steps: [
        { wait: 700, message: { id: 1, from: "client", text: "Oi, tem horário pra escova no sábado?", time: "22:15" } },
        { wait: 1500, message: { id: 2, from: "bot", text: "Oi! 💇‍♀️ Tenho estes horários livres no sábado:", options: ["Sáb 9h", "Sáb 11h", "Sáb 14h"], time: "22:15" } },
        { wait: 1900, message: { id: 3, from: "client", text: "11h!", pick: "Sáb 11h", time: "22:16" } },
        { wait: 1500, message: { id: 4, from: "bot", text: "Reservado! ✨", card: { title: "Horário reservado", detail: "Sábado, 11:00 · Escova" }, time: "22:16" } },
        { wait: 1800, message: { id: 5, from: "client", text: "Perfeito 😍", time: "22:16" } },
        { wait: 1400, message: { id: 6, from: "bot", text: "Te esperamos no sábado! 💚", time: "22:16" } },
      ],
    },
  },
  {
    id: "loja",
    label: "Loja",
    icon: ShoppingBag,
    headline: "Vende no WhatsApp até de madrugada.",
    does: ["Responde sobre estoque, tamanho e cor", "Envia fotos e link de pagamento", "Acompanha o pedido até a entrega", "Recupera quem parou de responder"],
    script: {
      business: "Sua loja",
      steps: [
        { wait: 700, message: { id: 1, from: "client", text: "Oi! Ainda tem o tênis branco no 38?", time: "00:12" } },
        { wait: 1500, message: { id: 2, from: "bot", text: "Tem sim! 🙌 Como você prefere?", options: ["Retirar", "Receber", "Ver fotos"], time: "00:12" } },
        { wait: 1900, message: { id: 3, from: "client", text: "Quero receber em casa", pick: "Receber", time: "00:13" } },
        { wait: 1500, message: { id: 4, from: "bot", text: "Perfeito! Te mandei o link de pagamento 📦", card: { title: "Pedido separado", detail: "Tênis branco · nº 38", kind: "pedido" }, time: "00:13" } },
        { wait: 1800, message: { id: 5, from: "client", text: "Já paguei!", time: "00:14" } },
        { wait: 1400, message: { id: 6, from: "bot", text: "Pagamento confirmado ✅ Obrigado pela compra!", time: "00:14" } },
      ],
    },
  },
  {
    id: "restaurante",
    label: "Restaurante",
    icon: UtensilsCrossed,
    headline: "Pedido anotado certinho, mesmo no horário de pico.",
    does: ["Envia o cardápio na hora", "Anota pedidos e endereço", "Informa taxa e tempo de entrega", "Avisa a cozinha automaticamente"],
    script: {
      business: "Seu restaurante",
      steps: [
        { wait: 700, message: { id: 1, from: "client", text: "Boa noite! Vocês entregam no Centro?", time: "20:31" } },
        { wait: 1500, message: { id: 2, from: "bot", text: "Entregamos sim! 🛵 O que você prefere?", options: ["Cardápio", "Prato do dia", "Atendente"], time: "20:31" } },
        { wait: 1900, message: { id: 3, from: "client", text: "Manda o prato do dia", pick: "Prato do dia", time: "20:32" } },
        { wait: 1500, message: { id: 4, from: "bot", text: "Hoje é feijoada 😋 Anotei para o Centro.", card: { title: "Pedido confirmado", detail: "1 feijoada · entrega no Centro", kind: "pedido" }, time: "20:32" } },
        { wait: 1800, message: { id: 5, from: "client", text: "Show!", time: "20:32" } },
        { wait: 1400, message: { id: 6, from: "bot", text: "Já está sendo preparado! 💚", time: "20:33" } },
      ],
    },
  },
];
