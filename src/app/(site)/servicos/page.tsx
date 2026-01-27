import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, ArrowRight } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = {
  title: "Serviços | Lolla Toledo Mega Hair",
  description: "Mega Hair, manutenção, avaliação e mais. Serviços premium com qualidade de alto padrão.",
};

export default function ServicosPage() {
  const services = db.services().sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#1E1412]">
      <section className="relative border-b border-[#7B2433]/40 bg-[#1E1412] py-28 md:py-36">
        <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
        <RevealOnScroll className="relative mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Serviços</p>
          <h1 className="mt-6 font-playfair text-4xl font-semibold text-[#4A0E1F] md:text-5xl lg:text-6xl">
            Mega Hair e muito mais
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[#E2B07E]/90 md:text-lg">
            Lista de serviços em estilo catálogo premium, com valores dinâmicos e agenda integrada.
          </p>
        </RevealOnScroll>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <RevealOnScroll key={service.id} delay={i * 80}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-dark-warm-lg">
                  {service.image ? (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-[#3B1F1A] text-[#C98A48]/50">
                      <Clock className="h-16 w-16" />
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="font-playfair text-2xl font-semibold text-[#C98A48]">{service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#C98A48]">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#E2B07E]/90 leading-relaxed text-[15px]">{service.description}</p>
                    <p className="mt-6 text-lg font-semibold text-[#C98A48]">
                      {service.price > 0 ? `R$ ${service.price.toLocaleString("pt-BR")}` : "Valor sob consulta"}
                    </p>
                    <Button variant="outline" size="sm" className="mt-6 btn-premium" asChild>
                      <a
                        href={whatsappUrl(`Gostaria de agendar: ${service.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Agendar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll className="mt-24 text-center" delay={200}>
            <Button size="lg" className="btn-premium" asChild>
              <Link href="/agendar">
                Ver disponibilidade e agendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
