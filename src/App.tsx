import { Automation } from "@/components/sections/automation";
import { Comparison } from "@/components/sections/comparison";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { FloatingWhatsApp } from "@/components/sections/floating-whatsapp";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { Navbar } from "@/components/sections/navbar";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Showcase } from "@/components/sections/showcase";
import { Stats } from "@/components/sections/stats";

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[100] rounded-full bg-lynx-400 px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Logos />
        <Services />
        <Automation />
        <Comparison />
        <Stats />
        <Showcase />
        <Process />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
