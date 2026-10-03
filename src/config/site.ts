// Dados da empresa — edite aqui e o site inteiro é atualizado.
export const site = {
  name: "Lynx",
  tagline: "Automação de WhatsApp e criação de sites",
  description:
    "A Lynx cria sites de alta conversão e automações de WhatsApp com IA que atendem, qualificam e vendem pelo seu negócio 24 horas por dia.",
  // Número no formato internacional, só dígitos: 55 + DDD + número.
  whatsapp: "5500000000000",
  email: "contato@lynx.com.br",
  instagram: "https://instagram.com/lynx",
  instagramHandle: "@lynx",
  city: "Brasil",
  // Horário em que alguém da Lynx responde. Usado no selo "Online agora / Respondemos às 9h".
  hours: { days: [1, 2, 3, 4, 5], open: 9, close: 18, timeZone: "America/Sao_Paulo" },
};

export function whatsappLink(message = "Olá, Lynx! Quero saber mais sobre os serviços.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { label: "Serviços", href: "/servicos" },
  { label: "Automação", href: "/automacao" },
  { label: "Processo", href: "/processo" },
  { label: "Planos", href: "/planos" },
  { label: "FAQ", href: "/faq" },
];
