// Dados da empresa — edite aqui e o site inteiro é atualizado.
export const site = {
  // Endereço público do site, sem barra no final. Troque quando o domínio próprio estiver no ar
  // (e atualize também index.html, public/sitemap.xml, public/robots.txt e public/llms.txt).
  url: "https://site-lynx.vercel.app",
  name: "Lynx",
  tagline: "Automação de WhatsApp e criação de sites",
  description:
    "A Lynx cria sites de alta conversão e automações de WhatsApp com IA que atendem, qualificam e vendem pelo seu negócio 24 horas por dia.",
  // Número no formato internacional, só dígitos: 55 + DDD + número.
  whatsapp: "5500000000000",
  // Deixe vazio ("") para esconder do site. Não use contatos que não sejam da Lynx:
  // @lynx no Instagram e o domínio lynx.com.br pertencem a outras pessoas.
  email: "",
  instagram: "https://www.instagram.com/lynx.automation/",
  instagramHandle: "@lynx.automation",
  city: "Brasil",
  // CNPJ ou CPF do responsável. Aparece na política de privacidade se preenchido.
  cnpj: "",
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

const DAY_NAMES = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

// "seg a sex, 9h–18h" a partir de site.hours (usado no selo de horário e no FAQ).
export function hoursLabel() {
  const { days, open, close } = site.hours;
  const sorted = [...days].sort((a, b) => a - b);
  const consecutive = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  const range =
    sorted.length === 7
      ? "todos os dias"
      : consecutive && sorted.length > 2
        ? `${DAY_NAMES[sorted[0]]} a ${DAY_NAMES[sorted[sorted.length - 1]]}`
        : sorted.map((d) => DAY_NAMES[d]).join(", ");
  return `${range}, ${open}h–${close}h`;
}
