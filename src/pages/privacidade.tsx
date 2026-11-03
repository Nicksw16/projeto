import { PageHero } from "@/components/layout/page-hero";
import { site, whatsappLink } from "@/config/site";
import { usePageMeta } from "@/lib/use-page-meta";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Quem somos",
    body: (
      <>
        {site.name} ({site.tagline.toLowerCase()}){site.cnpj ? `, ${site.cnpj}` : ""}. Somos a responsável pelos dados
        tratados neste site. Para falar sobre privacidade, use o{" "}
        <a href={whatsappLink("Olá, Lynx! Quero falar sobre meus dados pessoais.")} className="text-lynx-300 underline">
          WhatsApp
        </a>
        {site.email && (
          <>
            {" "}
            ou o e-mail{" "}
            <a href={`mailto:${site.email}`} className="text-lynx-300 underline">
              {site.email}
            </a>
          </>
        )}
        .
      </>
    ),
  },
  {
    title: "Quais dados coletamos",
    body: "Este site não usa cookies, não tem formulários e não instala rastreadores ou ferramentas de análise. Só tratamos dados quando você clica em um botão de WhatsApp e nos manda uma mensagem: seu número, seu nome de perfil e o que você escrever.",
  },
  {
    title: "Para que usamos",
    body: "Para responder sua mensagem, fazer o orçamento e, se você contratar, prestar o serviço. Base legal: execução de procedimentos preliminares a contrato e legítimo interesse em responder quem nos procura (LGPD, art. 7º, V e IX).",
  },
  {
    title: "Com quem compartilhamos",
    body: "O WhatsApp é operado pela Meta, que trata a conversa conforme a política dela. O site fica hospedado em provedores de infraestrutura que registram o endereço IP de quem acessa por motivos de segurança. Não vendemos dados.",
  },
  {
    title: "Por quanto tempo guardamos",
    body: "Conversas sem contratação são apagadas em até 12 meses. Dados de clientes ficam enquanto durar o contrato e pelo prazo que a lei exigir depois dele.",
  },
  {
    title: "Seus direitos",
    body: "Você pode pedir confirmação de que tratamos seus dados, acesso, correção, anonimização ou exclusão, portabilidade, informação sobre compartilhamento e revogar consentimento (LGPD, art. 18). Respondemos em até 15 dias. Se não ficar satisfeito, pode reclamar à ANPD (gov.br/anpd).",
  },
  {
    title: "Automações feitas para clientes",
    body: "Quando criamos uma automação de WhatsApp para uma empresa, quem decide o que fazer com os dados dos clientes finais é a empresa contratante; a Lynx atua como operadora, só seguindo as instruções dela.",
  },
  {
    title: "Mudanças nesta política",
    body: "Se algo mudar, atualizamos esta página e a data abaixo.",
  },
];

export default function PrivacidadePage() {
  usePageMeta(
    "Política de privacidade",
    "Como a Lynx trata dados pessoais: o que coletamos, para que usamos, com quem compartilhamos e como exercer seus direitos pela LGPD.",
  );
  return (
    <>
      <PageHero
        eyebrow="Privacidade"
        title={
          <>
            Seus dados, <span className="font-serif font-normal italic text-lynx-300">sem pegadinha.</span>
          </>
        }
        description="O que a gente guarda, para que usa e como você pede para apagar."
      />
      <section className="pb-24">
        <div className="container-lynx max-w-3xl space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-medium text-white">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-neutral-400">{s.body}</p>
            </div>
          ))}
          <p className="text-sm text-neutral-500">Última atualização: 3 de novembro de 2026.</p>
        </div>
      </section>
    </>
  );
}
