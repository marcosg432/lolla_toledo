import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export async function HomeCatalogPreview() {
  const products = db.catalogProducts();
  const featured = products.filter((p) => p?.featured).slice(0, 3);
  const fallback = products.slice(0, 3);
  const list = featured.length > 0 ? featured : fallback;

  return (
    <section className="relative overflow-hidden bg-[#1E1412] py-32 md:py-44">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <RevealOnScroll>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Catálogo</p>
            <h2 className="mt-6 font-playfair text-3xl font-semibold text-[#C98A48] md:text-4xl lg:text-5xl">
              Cabelos premium à sua escolha
            </h2>
            <p className="mt-6 max-w-xl text-base text-[#E2B07E]/90 md:text-lg">
              Fios selecionados, 100% humano e de alta qualidade para o seu Mega Hair.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <Button variant="outline" size="lg" className="btn-premium" asChild>
              <Link href="/catalogo">
                Ver todo o catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </RevealOnScroll>
        </div>

        <div className="mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.length > 0 ? (
            list.map((product, i) => (
              <RevealOnScroll key={product.id} delay={i * 100}>
                <Link
                  href={`/catalogo/${product.id}`}
                  className="group relative block overflow-hidden rounded-2xl border-2 border-[#7B2433]/60 bg-[#3B1F1A] shadow-dark-warm transition-all duration-300 hover:border-[#7B2433] hover:shadow-dark-warm-lg"
                >
                  <div className="relative aspect-[3/4] bg-[#3B1F1A]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1412]/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl border-t border-[#7B2433]/40 bg-[#3B1F1A]/95 p-6 backdrop-blur-sm">
                    <h3 className="font-playfair text-xl font-semibold text-[#C98A48]">{product.name}</h3>
                    <p className="mt-1 text-[#E2B07E]/90">
                      {product.price > 0 ? `R$ ${product.price.toLocaleString("pt-BR")}` : "Sob consulta"}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl border-2 border-[#7B2433]/50 bg-[#3B1F1A] shadow-dark-warm"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
