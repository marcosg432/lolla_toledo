import Image from "next/image";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export async function HomeBeforeAfter() {
  const raw = db.beforeAfter();
  const items = Array.isArray(raw) ? [...raw].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)) : [];

  if (items.length === 0) {
    return (
      <section className="relative bg-[#1E1412] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealOnScroll className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Antes e Depois</p>
            <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl">
              Transformações reais
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[#E2B07E]/85">
              Em breve você poderá ver aqui os resultados incríveis das nossas clientes.
            </p>
            <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl border-2 border-[#7B2433]/50 bg-[#3B1F1A] shadow-dark-warm"
                />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#1E1412] py-32 md:py-44">
      <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Antes e Depois</p>
          <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl lg:text-5xl">
            Transformações que falam por si
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#E2B07E]/90 md:text-lg">
            Confira resultados reais de clientes que confiam no nosso trabalho.
          </p>
        </RevealOnScroll>
        <div className="mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 4).map((item, i) => (
            <RevealOnScroll key={item.id} delay={i * 80}>
              <div className="group overflow-hidden rounded-2xl border-2 border-[#7B2433]/60 bg-[#3B1F1A] shadow-dark-warm transition-all duration-300 hover:border-[#7B2433] hover:shadow-dark-warm-lg">
                <div className="grid grid-cols-2 gap-px overflow-hidden bg-[#7B2433]/30">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#3B1F1A]">
                    <Image src={item.beforeImage} alt={`Antes - ${item.title}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#3B1F1A]">
                    <Image src={item.afterImage} alt={`Depois - ${item.title}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                </div>
                <p className="border-t border-[#7B2433]/40 bg-[#3B1F1A] px-6 py-4 text-center text-sm font-medium text-[#E2B07E]/95">
                  {item.title}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
