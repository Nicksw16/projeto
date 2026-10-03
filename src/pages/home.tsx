import { Automation } from "@/components/sections/automation";
import { Comparison } from "@/components/sections/comparison";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { Services } from "@/components/sections/services";
import { Showcase } from "@/components/sections/showcase";
import { Stats } from "@/components/sections/stats";
import { usePageMeta } from "@/lib/use-page-meta";

export default function HomePage() {
  usePageMeta(null);
  return (
    <>
      <Hero />
      <Logos />
      <Services />
      <Automation />
      <Comparison />
      <Stats />
      <Showcase />
      <Cta />
    </>
  );
}
