# Lynx — site institucional

Site da **Lynx**: automação de WhatsApp com IA e criação de sites.

Feito com React 19, TypeScript, Vite, Tailwind CSS v4 e Motion. Vários componentes vêm do
[21st.dev](https://21st.dev) (Animated Beam, Glowing Effect, Container Scroll, Timeline, Border Beam,
Infinite Slider, Progressive Blur, Number Ticker, Spotlight, Text Cycle, Accordion e o mockup de WhatsApp),
adaptados para a identidade da Lynx.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve o dist/ localmente
```

## O que editar antes de publicar

Tudo que é dado da empresa fica em **`src/config/site.ts`**:

| Campo | O que é |
| --- | --- |
| `whatsapp` | Número no formato `55` + DDD + número, só dígitos (ex.: `5511987654321`). **Hoje está um número fictício.** |
| `email` | E-mail de contato |
| `instagram` / `instagramHandle` | Link e @ do Instagram |

Outros pontos:

- **Logo** — `src/components/logo.tsx` (e `public/favicon.svg`) tem uma marca provisória de lince. Troque pelo SVG oficial.
- **Imagem de compartilhamento** — `public/og.png`. Quando o domínio estiver no ar, troque `content="/og.png"` em
  `index.html` pela URL completa (ex.: `https://seudominio.com.br/og.png`) para a prévia aparecer no WhatsApp.
- **Textos** — cada seção fica em `src/components/sections/`. Revise principalmente o FAQ (`faq.tsx`) e os
  planos (`pricing.tsx`) para refletir exatamente como a Lynx trabalha.

## Estrutura

```
src/
  config/site.ts          # dados da empresa e links de WhatsApp
  components/
    sections/             # uma seção da página por arquivo
    ui/                   # componentes do 21st.dev adaptados
  index.css               # tema (cores, fontes, animações)
public/logos/             # logos das integrações (svgl.app)
```

## Publicando

É um site estático: qualquer hospedagem serve. Na **Vercel** ou **Netlify**, importe o repositório —
o comando de build (`npm run build`) e a pasta (`dist`) são detectados automaticamente.
