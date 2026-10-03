import { hoursLabel, site } from "@/config/site";

// Perguntas do FAQ. Respostas em texto puro: também viram dados estruturados (FAQPage) para o Google.
export const faqCategories = ["Automação", "Sites", "Preço e prazo", "Suporte"] as const;
export type FaqCategory = (typeof faqCategories)[number];

export const faqs: { id: string; category: FaqCategory; q: string; a: string }[] = [
  {
    id: "fala-como-gente",
    category: "Automação",
    q: "A IA fala como gente mesmo?",
    a: "Fala. Ela é treinada com as informações do seu negócio e escreve no tom que você escolher, do mais formal ao mais descontraído. O cliente escreve normal, sem menu de números, e recebe uma resposta que faz sentido.",
  },
  {
    id: "substitui-humano",
    category: "Automação",
    q: "O robô vai substituir meu atendimento humano?",
    a: "Não. Ele trabalha junto com a sua equipe: resolve o que é repetitivo (dúvidas frequentes, horários, orçamentos) e passa a conversa para uma pessoa sempre que o cliente precisar ou pedir.",
  },
  {
    id: "nao-sabe",
    category: "Automação",
    q: "E se a IA não souber responder?",
    a: "Ela é configurada para não inventar. Quando a pergunta foge do que ela sabe, avisa o cliente e passa a conversa para você ou sua equipe, com o resumo do que já foi falado.",
  },
  {
    id: "numero",
    category: "Automação",
    q: "Posso usar o número de WhatsApp que já tenho?",
    a: "Na maioria dos casos, sim. A gente avalia o seu cenário e indica a forma de conexão mais estável e segura para o seu número, incluindo a API oficial do WhatsApp Business quando faz sentido.",
  },
  {
    id: "fora-horario",
    category: "Automação",
    q: "Funciona fora do horário comercial?",
    a: "Funciona 24 horas por dia, inclusive fins de semana e feriados. É justamente aí que ela faz mais diferença: a mensagem das 23h47 não fica sem resposta.",
  },
  {
    id: "ver-conversas",
    category: "Automação",
    q: "Consigo acompanhar as conversas?",
    a: "Sim. Você acompanha o que a IA está respondendo e pode assumir qualquer conversa quando quiser. Na conversa inicial a gente mostra como isso fica no seu caso.",
  },
  {
    id: "google",
    category: "Sites",
    q: "Meu site vai aparecer no Google?",
    a: "Todo site sai com a base técnica certa para isso: carregamento rápido, estrutura correta, títulos e descrições para cada página e versão perfeita no celular. Isso dá ao seu site a base para ser bem posicionado nas buscas.",
  },
  {
    id: "tecnico",
    category: "Sites",
    q: "Preciso entender de tecnologia?",
    a: "Nada. A gente cuida de domínio, hospedagem, configuração, integrações e treinamento da IA. Você acompanha, aprova e começa a receber clientes.",
  },
  {
    id: "dominio",
    category: "Sites",
    q: "Vocês cuidam do domínio e da hospedagem?",
    a: "Sim. Registramos ou conectamos o seu domínio (o endereço .com.br), configuramos a hospedagem e o certificado de segurança, aquele cadeado ao lado do endereço no navegador.",
  },
  {
    id: "alteracoes",
    category: "Sites",
    q: "Posso pedir alterações depois que o site estiver no ar?",
    a: "Pode. Como funcionam os ajustes depois da entrega fica combinado por escrito na proposta, para não ter surpresa nem de um lado nem do outro.",
  },
  {
    id: "preco",
    category: "Preço e prazo",
    q: "Quanto custa?",
    a: "Depende do que o seu negócio precisa. Você conta no WhatsApp, a gente faz as perguntas certas e manda uma proposta por escrito com escopo, prazo e valor. Na página de planos explicamos por que não existe tabela fixa.",
  },
  {
    id: "prazo",
    category: "Preço e prazo",
    q: "Quanto tempo leva para ficar pronto?",
    a: "Depende do escopo. Landing pages e automações mais diretas ficam prontas mais rápido; sites completos e fluxos com várias integrações levam um pouco mais. O prazo vem escrito na proposta, antes de qualquer compromisso.",
  },
  {
    id: "mensalidade",
    category: "Preço e prazo",
    q: "Tem custo mensal?",
    a: "A proposta separa o que é pago uma vez (a criação) do que é recorrente, quando existe, como hospedagem, a API oficial do WhatsApp ou suporte. Você vê tudo antes de decidir, sem taxa escondida.",
  },
  {
    id: "suporte",
    category: "Suporte",
    q: "E depois da entrega, vocês continuam por perto?",
    a: "Sim. A gente acompanha as primeiras semanas, ajusta o que for preciso e segue disponível para melhorias e novas funcionalidades conforme o seu negócio cresce.",
  },
  {
    id: "contato",
    category: "Suporte",
    q: "Como falo com vocês?",
    a: `Pelo WhatsApp, pelo e-mail ${site.email} ou pelo Instagram ${site.instagramHandle}. Atendimento humano de ${hoursLabel()}.`,
  },
];
