# Lynx — site institucional

Site da **Lynx**: automação de WhatsApp com IA e criação de sites.

Feito com React 19, TypeScript, Vite, Tailwind CSS v4, Motion e React Router. Vários componentes vêm do
[21st.dev](https://21st.dev) e foram adaptados para a identidade da Lynx (Notification Stack, Scroll Word Reveal,
Stacking Cards, Services Stack, Safari + Scroll Reveal, Us vs Them, Trigger to Action, Integrations Orbit,
ROI Calculator, How It Works, Onboarding Checklist, Product Finder Quiz, Feature Comparison Table,
Searchable FAQ, Chat Bubble Thread, Status Badge, Flip Links, Marker Highlight, Bottom Nav e o mockup de WhatsApp).

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve o dist/ localmente
```

## Páginas

Cada item do menu é uma página própria. Todas contam a mesma história: o cliente que chamou às 23h47.

| Rota | Arquivo | O que tem |
| --- | --- | --- |
| `/` | `src/pages/home.tsx` | Gancho das 23h47, comparação, demo por tipo de negócio, os 3 pilares |
| `/servicos` | `src/pages/servicos.tsx` | Site conceito que abre ao rolar, Lynx × jeito comum, serviços, diferenciais |
| `/automacao` | `src/pages/automacao.tsx` | Passo a passo fixo na tela, regras "Quando → Então", integrações, calculadora |
| `/processo` | `src/pages/processo.tsx` | 5 passos (o que a Lynx faz / o que você faz), checklist "sua parte é pequena" |
| `/planos` | `src/pages/planos.tsx` | Planos, quiz "qual é o meu?", tabela comparativa, "por que sob consulta?" |
| `/faq` | `src/pages/faq.tsx` | Busca com filtro por assunto, respostas rápidas para o WhatsApp |

## O que editar antes de publicar

Tudo que é dado da empresa fica em **`src/config/site.ts`**:

| Campo | O que é |
| --- | --- |
| `whatsapp` | Número no formato `55` + DDD + número, só dígitos (ex.: `5511987654321`). **Hoje está um número fictício.** |
| `email` | E-mail de contato. **Hoje está vazio (escondido no site)** — preencha com um e-mail da Lynx. |
| `instagram` / `instagramHandle` | Link e @ do Instagram. **Hoje está vazio (escondido no site)** — o @lynx pertence a outra pessoa. |
| `hours` | Dias e horário de atendimento humano. Controla o selo "Online agora / Respondemos a partir das 9h". |

Outros pontos:

- **Logo** — `src/components/logo.tsx` (e `public/favicon.svg`) tem uma marca provisória de lince. Troque pelo SVG oficial.
- **Imagem de compartilhamento** — `public/og.png`. Quando o domínio estiver no ar, troque `content="/og.png"` em
  `index.html` pela URL completa (ex.: `https://seudominio.com.br/og.png`) para a prévia aparecer no WhatsApp.
- **Textos** — revise principalmente o FAQ (`src/config/faq.ts`), os planos (`src/components/sections/pricing.tsx`
  e `plan-compare.tsx`) e os exemplos por tipo de negócio (`src/config/niches.ts`).
- **Mensagens do WhatsApp** — todo link `wa.me` recebe automaticamente, no fim do texto, a página de onde o visitante
  veio e o tipo de negócio que ele escolheu nas demos (`src/lib/lead.ts`).

## Segurança

O `vercel.json` envia cabeçalhos de proteção em todas as páginas: Content-Security-Policy (só carrega scripts,
fontes e imagens do próprio site), bloqueio de exibição dentro de outros sites (clickjacking), `nosniff`,
Referrer-Policy e Permissions-Policy. Se um dia adicionar um script de fora (Google Analytics, Meta Pixel,
chat etc.), inclua o domínio dele na `Content-Security-Policy`, senão o navegador bloqueia.

## Estrutura

```
src/
  pages/                  # uma página por rota (carregadas sob demanda)
  config/                 # dados da empresa, FAQ e exemplos por nicho
  components/
    layout/               # moldura do site: menu inferior no celular, topo das páginas, "próxima página"
    sections/             # seções das páginas
    ui/                   # componentes do 21st.dev adaptados
  lib/                    # utilidades (movimento, contexto do WhatsApp, título das páginas)
  index.css               # tema (cores, fontes, animações)
public/logos/             # logos das integrações (svgl.app)
public/_headers           # cabeçalhos de segurança e cache na Cloudflare
vercel.json               # rotas e cabeçalhos na Vercel
wrangler.jsonc            # configuração caso a Cloudflare use "Worker" em vez de "Pages"
```

## Publicando

É um site estático (a pasta `dist` gerada por `npm run build`).

**Cloudflare (recomendado, grátis e liberado para uso comercial)** — em *Workers & Pages → Create → Pages →
Connect to Git*, escolha este repositório e use:

| Campo | Valor |
| --- | --- |
| Framework preset | `None` (ou `Vite`) |
| Build command | `npm run build` |
| Build output directory | `dist` |

`public/_headers` aplica os cabeçalhos de segurança e o cache; páginas como `/planos` abrem direto porque o
Pages serve o `index.html` para qualquer endereço sem arquivo. Se o projeto for criado como *Worker* em vez de
*Pages*, o `wrangler.jsonc` já está configurado (nome `lynx`, pasta `dist`).

**Vercel** — importe o repositório; build e pasta são detectados sozinhos e o `vercel.json` cuida das rotas e
dos cabeçalhos. Atenção: o plano grátis (Hobby) da Vercel é só para uso pessoal, não comercial.

Os cabeçalhos de segurança existem em dois lugares (`vercel.json` e `public/_headers`): se mudar um, mude o outro.
