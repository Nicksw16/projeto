import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const tools = [
  { name: "WhatsApp", file: "whatsapp-icon.svg" },
  { name: "Instagram", file: "instagram-icon.svg" },
  { name: "Meta", file: "meta.svg" },
  { name: "OpenAI", file: "openai_dark.svg" },
  { name: "Google Sheets", file: "google-sheets.svg" },
  { name: "Google Agenda", file: "google-calendar.svg" },
  { name: "Gmail", file: "gmail.svg" },
  { name: "Notion", file: "notion.svg" },
  { name: "n8n", file: "n8n.svg" },
  { name: "Mercado Pago", file: "mercado-pago.svg" },
  { name: "Stripe", file: "stripe.svg" },
  { name: "Shopify", file: "shopify.svg" },
  { name: "WordPress", file: "wordpress.svg" },
  { name: "React", file: "react_dark.svg" },
  { name: "Next.js", file: "nextjs_icon_dark.svg" },
  { name: "Tailwind", file: "tailwindcss.svg" },
  { name: "Figma", file: "figma.svg" },
  { name: "Vercel", file: "vercel_dark.svg" },
];

export function Logos() {
  return (
    <section aria-label="Ferramentas e integrações" className="relative border-y border-white/[0.06] bg-ink-900/40 py-10">
      <p className="container-lynx text-center text-sm text-neutral-500">
        Conectamos seu WhatsApp e seu site às ferramentas que você <span className="text-neutral-300">já usa</span>
      </p>
      <div className="relative mt-8">
        <InfiniteSlider gap={14} duration={45} durationOnHover={90}>
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.02] py-2 pl-2.5 pr-4"
            >
              <img
                src={`/logos/${tool.file}`}
                alt=""
                loading="lazy"
                className="size-5 object-contain"
                width={20}
                height={20}
              />
              <span className="whitespace-nowrap text-sm font-medium text-neutral-300">{tool.name}</span>
            </div>
          ))}
        </InfiniteSlider>
        <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-24 sm:w-48" direction="left" blurIntensity={1} />
        <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-24 sm:w-48" direction="right" blurIntensity={1} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent sm:w-40" />
      </div>
    </section>
  );
}
