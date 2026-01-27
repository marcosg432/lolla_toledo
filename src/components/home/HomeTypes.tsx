import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Scissors, Layers, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const types = [
  {
    icon: Scissors,
    title: "Mega Hair em Fita",
    description: "Técnica que oferece leveza e naturalidade. Ideal para quem busca volume e comprimento com aplicação discreta e confortável.",
  },
  {
    icon: Layers,
    title: "Mega Hair em Corda",
    description: "Versátil e durável, perfeito para transformações intensas. Resultado com movimento e brilho de cabelo natural premium.",
  },
  {
    icon: Sparkles,
    title: "Mega Hair em Tip",
    description: "Ponta a ponta com fios de alta qualidade. Ideal para mechas, volume pontual ou alongamento com acabamento impecável.",
  },
];

export function HomeTypes() {
  return (
    <section className="relative bg-[#1E1412] py-32 md:py-44">
      <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Tipos de Mega Hair</p>
          <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl lg:text-5xl">
            Técnicas premium para cada necessidade
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#E2B07E]/90 md:text-lg">
            Trabalhamos com as melhores técnicas e materiais para garantir o resultado dos seus sonhos.
          </p>
        </RevealOnScroll>
        <div className="mt-24 grid gap-10 md:grid-cols-3">
          {types.map(({ icon: Icon, title, description }, i) => (
            <RevealOnScroll key={title} delay={i * 80}>
              <Card className="group h-full transition-all duration-300 hover:shadow-dark-warm-lg">
                <CardHeader>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#7B2433]/50 bg-[#3B1F1A]/80 text-[#C98A48] transition-colors group-hover:border-[#A55B35] group-hover:text-[#E2B07E]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-[#C98A48]">{title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-[#E2B07E]/85 leading-relaxed text-[15px]">{description}</p>
                </CardContent>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
