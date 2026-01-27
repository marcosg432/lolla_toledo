import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeTypes } from "@/components/home/HomeTypes";
import { HomeBeforeAfter } from "@/components/home/HomeBeforeAfter";
import { HomeCatalogPreview } from "@/components/home/HomeCatalogPreview";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { RevealOnScroll } from "@/components/RevealOnScroll";

function HomeFallback({ className }: { className?: string }) {
  return <section className={className} aria-hidden />;
}

export default async function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeTypes />
      <Suspense fallback={<HomeFallback className="min-h-[50vh] bg-[#1E1412]" />}>
        <HomeBeforeAfter />
      </Suspense>
      <Suspense fallback={<HomeFallback className="min-h-[50vh] bg-[#1E1412]" />}>
        <HomeCatalogPreview />
      </Suspense>
      <Suspense fallback={<HomeFallback className="min-h-[40vh] bg-[#1E1412]" />}>
        <HomeTestimonials />
      </Suspense>
      <section className="relative overflow-hidden bg-[#1E1412] py-32 md:py-44">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
        <RevealOnScroll className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="font-playfair text-3xl font-semibold tracking-tight text-[#E2B07E] md:text-4xl lg:text-5xl">
            Pronta para transformar seu visual?
          </p>
          <p className="mt-6 text-base text-[#E2B07E]/90 md:text-lg">
            Agende sua avaliação gratuita e descubra o Mega Hair ideal para você.
          </p>
          <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button size="xl" className="btn-premium group" asChild>
              <a href={whatsappUrl("Gostaria de agendar uma avaliação.")} target="_blank" rel="noopener noreferrer">
                Agendar avaliação
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="xl" className="btn-premium" asChild>
              <Link href="/catalogo">
                Ver catálogo de cabelos
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-[#C98A48]">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Atendimento personalizado</span>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
