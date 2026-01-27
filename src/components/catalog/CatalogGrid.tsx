"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import type { Product } from "@/lib/db";

const cardGlow =
  "0 0 0 1px rgba(123, 36, 51, 0.5), 0 8px 32px rgba(11, 9, 8, 0.4)";

export function CatalogGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div
          className="rounded-2xl border-2 border-[#7B2433] bg-[#3B1F1A] p-20 text-center"
          style={{ boxShadow: cardGlow }}
        >
          <p className="font-playfair text-2xl font-semibold text-[#4A0E1F]">
            Nenhum produto cadastrado ainda.
          </p>
          <p className="mt-3 text-[#E2B07E]/90">
            Em breve, nosso catálogo premium estará disponível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {products.map((product, i) => (
          <RevealOnScroll key={product.id} delay={i * 80}>
            <Link
              href={`/catalogo/${product.id}`}
              className="group relative block overflow-hidden rounded-2xl border-2 border-[#7B2433] bg-[#3B1F1A] transition-all duration-500 hover:border-[#A55B35] hover:shadow-[0_0_0_2px_#A55B35,0_0_24px_rgba(201,138,72,0.2),0_16px_48px_rgba(11,9,8,0.5)]"
              style={{ boxShadow: cardGlow }}
            >
              {/* Imagem grande do cabelo — zoom suave no hover */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1E1412]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B1F1A]/90 via-[#3B1F1A]/20 to-transparent" />
              </div>

              <div className="border-t border-[#7B2433]/50 p-6">
                {/* Nome — Borgonha Profundo */}
                <h3 className="font-playfair text-xl font-semibold leading-tight text-[#4A0E1F] md:text-2xl">
                  {product.name}
                </h3>

                {/* Tipo, Comprimento, Peso */}
                <div className="mt-3 space-y-1 text-sm text-[#E2B07E]/90">
                  {product.type && (
                    <p>
                      <span className="text-[#C98A48]/90">Tipo:</span>{" "}
                      {product.type}
                    </p>
                  )}
                  {product.length && (
                    <p>
                      <span className="text-[#C98A48]/90">Comprimento:</span>{" "}
                      {product.length}
                    </p>
                  )}
                  {product.peso && (
                    <p>
                      <span className="text-[#C98A48]/90">Peso:</span>{" "}
                      {product.peso}
                    </p>
                  )}
                  {product.color && (
                    <p>
                      <span className="text-[#C98A48]/90">Cor:</span>{" "}
                      {product.color}
                    </p>
                  )}
                </div>

                {/* Descrição curta — Âmbar Suave */}
                {product.description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#E2B07E]/85">
                    {product.description}
                  </p>
                )}

                {/* Preço — Caramelo Gold Burned */}
                <p className="mt-4 text-xl font-semibold text-[#C98A48]">
                  {product.price > 0
                    ? `R$ ${product.price.toLocaleString("pt-BR")}`
                    : "Sob consulta"}
                </p>

                {/* Botão Ver Detalhes — Cobre Escuro, hover Caramelo + brilho */}
                <span className="mt-5 flex">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A55B35] px-5 py-3 text-sm font-medium text-[#0B0908] transition-all duration-300 group-hover:bg-[#C98A48] group-hover:shadow-[0_0_20px_rgba(201,138,72,0.35)]">
                    Ver Detalhes
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
