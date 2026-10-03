import { ArrowUp } from "lucide-react";
import { Link } from "react-router";

import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { nav, site, whatsappLink } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="container-lynx">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400">{site.description}</p>
            <div className="mt-6 flex gap-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Lynx"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition-colors hover:border-lynx-400/40 hover:text-lynx-300"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Lynx"
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition-colors hover:border-lynx-400/40 hover:text-lynx-300"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-white">Navegação</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-white">Serviços</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              {[
                ["Automação de WhatsApp", "/automacao"],
                ["Chatbots com IA", "/automacao"],
                ["Criação de sites", "/servicos"],
                ["Landing pages", "/servicos"],
                ["Lojas virtuais", "/servicos"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-medium text-white">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mt-16 select-none" aria-hidden="true">
        <p className="bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[28vw] font-semibold leading-[0.78] tracking-[-0.055em] text-transparent">
          lynx
        </p>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="container-lynx flex flex-col items-center justify-between gap-4 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            Voltar ao topo <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
