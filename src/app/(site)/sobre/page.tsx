import Image from "next/image";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = {
  title: "Sobre Lolla Toledo | Mega Hair Premium",
  description: "Conheça a história e a especialização em Mega Hair da Lolla Toledo.",
};

export default function SobrePage() {
  const testimonials = db.testimonials().sort((a, b) => a.order - b.order).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#1E1412]">
      <section className="relative overflow-hidden border-b border-[#7B2433]/40 bg-[#1E1412] py-32 md:py-40">
        <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-2 lg:gap-24">
            <RevealOnScroll className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/lolla.png"
                alt="Lolla Toledo - Especialista em Mega Hair"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-[#7B2433] shadow-lead-frame" />
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Sobre</p>
              <h1 className="mt-6 font-playfair text-4xl font-semibold text-[#4A0E1F] md:text-5xl lg:text-6xl">
                Lolla Toledo
              </h1>
              <p className="mt-10 text-base leading-relaxed text-[#E2B07E]/95 md:text-lg">
                Especialista em Mega Hair com trajetória dedicada à excelência e à estética de alto padrão.
                Cada cliente é tratada com singularidade, em um atendimento que une técnica, qualidade dos fios
                e o olhar preciso para realçar beleza e elegância.
              </p>
              <p className="mt-8 text-base leading-relaxed text-[#DCC7B2]/90 md:text-lg">
                Trabalho com as melhores marcas e técnicas do mercado para garantir transformações
                duradouras, naturais e com aquele toque de glamour que faz a diferença.
              </p>
              <div className="mt-14 flex flex-wrap gap-12 text-[#E2B07E]/90">
                <div>
                  <p className="text-2xl font-semibold text-[#C98A48]">+</p>
                  <p className="text-sm">Anos de experiência</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#C98A48]">Mega Hair</p>
                  <p className="text-sm">Especialização</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="border-t border-[#7B2433]/40 bg-[#1E1412] py-32 md:py-40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <RevealOnScroll>
              <h2 className="font-playfair text-3xl font-semibold text-[#4A0E1F] md:text-4xl">
                Depoimentos de clientes
              </h2>
            </RevealOnScroll>
            <div className="mt-16 grid gap-12 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <RevealOnScroll key={t.id} delay={i * 80}>
                  <blockquote className="rounded-2xl border-2 border-[#7B2433]/60 bg-[#3B1F1A] p-8 shadow-dark-warm">
                    <p className="text-[#E2B07E]/95 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <footer className="mt-6 font-medium text-[#C98A48]">{t.name}</footer>
                    {t.role && <p className="text-sm text-[#E2B07E]/70">{t.role}</p>}
                  </blockquote>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
