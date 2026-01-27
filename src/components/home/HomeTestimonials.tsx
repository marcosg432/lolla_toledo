import { Quote } from "lucide-react";
import { db } from "@/lib/db";
import Image from "next/image";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export async function HomeTestimonials() {
  const raw = db.testimonials();
  const testimonials = Array.isArray(raw) ? [...raw].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)).slice(0, 3) : [];

  if (testimonials.length === 0) {
    return (
      <section className="relative bg-[#1E1412] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealOnScroll className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Depoimentos</p>
            <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl">
              O que nossas clientes dizem
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[#E2B07E]/85">
              Depoimentos reais em breve. Sua satisfação é nossa maior recompensa.
            </p>
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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Depoimentos</p>
          <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl lg:text-5xl">
            Quem viveu, recomenda
          </h2>
        </RevealOnScroll>
        <div className="mt-24 grid gap-10 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.id} delay={i * 80}>
              <div className="rounded-2xl border-2 border-[#7B2433]/60 bg-[#3B1F1A] p-8 shadow-dark-warm transition-all hover:border-[#7B2433] hover:shadow-dark-warm-lg">
                <Quote className="h-10 w-10 text-[#C98A48]/60" />
                <p className="mt-6 text-[#E2B07E]/95 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-8 flex items-center gap-4">
                  {t.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#7B2433]/50">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#7B2433]/50 bg-[#3B1F1A] text-[#C98A48] font-semibold">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#C98A48]">{t.name}</p>
                    {t.role && <p className="text-sm text-[#E2B07E]/70">{t.role}</p>}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
