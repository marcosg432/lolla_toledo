import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function HomeAbout() {
  return (
    <section className="relative overflow-hidden bg-[#1E1412] py-32 md:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0908]/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-soft-texture opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2 lg:gap-24">
          <RevealOnScroll className="order-2 lg:order-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Sobre a Especialista</p>
            <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl lg:text-5xl">
              Lolla Toledo
            </h2>
            <p className="mt-10 text-base leading-relaxed text-[#E2B07E]/95 md:text-lg">
              Especialista em Mega Hair com anos de experiência em transformações que unem beleza,
              elegância e alto padrão. Cada cliente recebe um atendimento único, focado em realçar
              sua beleza natural com sofisticação e profissionalismo.
            </p>
            <p className="mt-8 text-base leading-relaxed text-[#DCC7B2]/90 md:text-lg">
              Trabalho com os melhores fios e técnicas para garantir resultado impecável,
              duradouro e com aquele toque de glamour que faz toda a diferença.
            </p>
            <Button variant="outline" size="lg" className="mt-12 btn-premium" asChild>
              <Link href="/sobre">Conhecer mais</Link>
            </Button>
          </RevealOnScroll>
          <RevealOnScroll delay={100} className="relative order-1 aspect-[4/5] overflow-hidden rounded-2xl lg:order-2">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#7B2433] shadow-[0_20px_60px_rgba(11,9,8,0.5)]">
              <Image
                src="/lolla.png"
                alt="Lolla Toledo - Especialista em Mega Hair"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
