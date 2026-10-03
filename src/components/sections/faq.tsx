import { MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Accordion } from "@/components/ui/accordion";
import { whatsappLink } from "@/config/site";

const faqs = [
  {
    id: "prazo",
    title: "Quanto tempo leva para meu projeto ficar pronto?",
    content:
      "Depende do escopo. Landing pages e automações mais diretas ficam prontas rapidamente; sites completos e fluxos com várias integrações levam um pouco mais. Você recebe um cronograma claro logo no início, antes de qualquer compromisso.",
  },
  {
    id: "numero",
    title: "Posso usar o número de WhatsApp que já tenho?",
    content:
      "Sim, na maioria dos casos. Avaliamos o seu cenário e indicamos a forma de conexão mais estável e segura para o seu número — incluindo a API oficial do WhatsApp Business, quando faz sentido.",
  },
  {
    id: "humano",
    title: "O robô vai substituir meu atendimento humano?",
    content:
      "Não — ele trabalha junto com a sua equipe. A IA resolve o que é repetitivo (dúvidas frequentes, horários, orçamentos) e transfere a conversa para uma pessoa sempre que o cliente precisar ou pedir.",
  },
  {
    id: "tecnico",
    title: "Preciso entender de tecnologia?",
    content:
      "Nada. Cuidamos de tudo: domínio, hospedagem, configuração, integrações e treinamento. Você só acompanha, aprova e começa a receber clientes.",
  },
  {
    id: "google",
    title: "Meu site vai aparecer no Google?",
    content:
      "Todos os sites são construídos com SEO técnico: carregamento rápido, estrutura correta, metadados e versão mobile impecável. Isso dá ao seu site a base certa para ser bem posicionado nas buscas.",
  },
  {
    id: "suporte",
    title: "E depois da entrega, vocês continuam por perto?",
    content:
      "Sim. Acompanhamos os primeiros resultados e oferecemos suporte contínuo para ajustes, melhorias e novas funcionalidades conforme o seu negócio cresce.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container-lynx grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              align="left"
              eyebrow="Dúvidas frequentes"
              title={
                <>
                  Perguntas que <span className="font-serif font-normal italic text-lynx-300">sempre</span> recebemos.
                </>
              }
              description="Não encontrou o que procurava? Chama a gente no WhatsApp — respondemos rapidinho."
            />
            <Reveal delay={0.1} className="mt-8">
              <ButtonLink href={whatsappLink("Olá, Lynx! Tenho uma dúvida.")} variant="secondary">
                <MessageCircle className="size-4" />
                Tirar uma dúvida
              </ButtonLink>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-7" delay={0.1}>
          <Accordion items={faqs} defaultOpen={["prazo"]} />
        </Reveal>
      </div>
    </section>
  );
}
