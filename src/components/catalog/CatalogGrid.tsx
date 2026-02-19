"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import type { Product } from "@/lib/db";

const cardGlow =
  "0 0 0 1px rgba(123, 36, 51, 0.5), 0 8px 32px rgba(11, 9, 8, 0.4)";

export function CatalogGrid({ products }: { products: Product[] }) {
  // Debug: verificar produtos recebidos
  if (typeof window === "undefined") {
    console.log(`[CatalogGrid] Recebidos ${products.length} produtos`);
    products.slice(0, 3).forEach((p, i) => {
      console.log(`[CatalogGrid] Produto ${i + 1}: ${p.name}, estoque: ${p.estoque}, ativo: ${p.ativo}`);
    });
  }
  
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
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 items-stretch">
        {products.map((product, i) => {
          // Debug: verificar valores do produto - SEMPRE no servidor
          if (typeof window === "undefined" && i < 3) {
            console.log(`[CatalogGrid] Produto ${product.id} (${product.name}): estoque=${product.estoque}, ativo=${product.ativo}, tipo_estoque=${typeof product.estoque}`);
          }
          
          // CRÍTICO: Verificar se estoque existe e é um número válido
          const estoque = (product.estoque !== undefined && product.estoque !== null) ? Number(product.estoque) : 0;
          const ativo = product.ativo !== false && estoque > 0;
          const isIndisponivel = !ativo || estoque === 0;
          
          // Debug adicional no servidor
          if (typeof window === "undefined" && i < 3) {
            console.log(`[CatalogGrid] Produto ${product.id}: estoque_calculado=${estoque}, ativo_calculado=${ativo}, isIndisponivel=${isIndisponivel}`);
          }
          
          return (
            <RevealOnScroll key={product.id} delay={i * 80}>
              <div
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 h-full ${
                  isIndisponivel
                    ? "border-[#7B2433]/30 bg-[#3B1F1A]/50 opacity-60 cursor-not-allowed"
                    : "border-[#7B2433] bg-[#3B1F1A] transition-all duration-500 hover:border-[#A55B35] hover:shadow-[0_0_0_2px_#A55B35,0_0_24px_rgba(201,138,72,0.2),0_16px_48px_rgba(11,9,8,0.5)]"
                }`}
                style={{ boxShadow: cardGlow }}
              >
                {isIndisponivel ? (
                  <div className="relative">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#1E1412]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3B1F1A]/90 via-[#3B1F1A]/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xl font-semibold text-[#E2B07E]/70">❌ Indisponível</p>
                      </div>
                    </div>
                    <div className="border-t border-[#7B2433]/30 p-6">
                      <h3 className="font-playfair text-xl font-semibold leading-tight text-[#4A0E1F]/70 md:text-2xl">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-red-400">Estoque: 0 unidades</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/catalogo/${product.id}`}
                    className="group relative flex flex-col h-full"
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

              <div className="border-t border-[#7B2433]/50 p-6 flex flex-col flex-grow">
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
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#E2B07E]/85 flex-grow">
                    {product.description}
                  </p>
                )}

                {/* Estoque */}
                <div className="mt-3">
                  {estoque > 0 ? (
                    <p className="text-sm text-[#C98A48] font-medium">
                      Estoque: {estoque} {estoque === 1 ? "unidade" : "unidades"}
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 font-medium">❌ Indisponível</p>
                  )}
                </div>

                {/* Preço */}
                <div className="mt-4">
                  {product.price > 0 ? (
                    <p className="text-xl font-semibold text-[#C98A48]">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  ) : (
                    <p className="text-lg text-[#E2B07E]/90">
                      Preços em atualização
                    </p>
                  )}
                </div>

                {/* Botão Ver Detalhes — Cobre Escuro, hover Caramelo + brilho */}
                <span className="mt-auto flex pt-4">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A55B35] px-5 py-3 text-sm font-medium text-[#0B0908] transition-all duration-300 group-hover:bg-[#C98A48] group-hover:shadow-[0_0_20px_rgba(201,138,72,0.35)]">
                    Ver Detalhes
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </div>
                  </Link>
                )}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
