"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";

export function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      setOffset(scrolled * 0.15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90vh] items-center justify-end overflow-hidden bg-[#1E1412] md:min-h-screen"
    >
      {/* Gradiente escuro vertical + soft texture */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0908] via-[#1E1412] to-[#1E1412]" />
      <div className="absolute inset-0 z-0 bg-soft-texture opacity-50" aria-hidden />

      {/* Parallax sutil: imagem de fundo */}
      <div
        className="absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: "url('/lolla.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          transform: `translate3d(0, ${offset}px, 0)`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1E1412] via-[#1E1412]/95 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#1E1412] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-4 py-28 md:px-8 md:py-36 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl lg:max-w-xl">
          <p
            className="animate-fade-up text-sm font-medium uppercase tracking-[0.25em] text-[#C98A48]"
            style={{ animationFillMode: "forwards" }}
          >
            Mega Hair Premium
          </p>
          <h1 className="relative mt-6 font-playfair text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="animate-fade-up block text-[#E2B07E]" style={{ animationDelay: "0.08s", animationFillMode: "forwards" }}>
              Lolla Toledo
            </span>
            <span className="animate-fade-up block text-[#C98A48]" style={{ animationDelay: "0.12s", animationFillMode: "forwards" }}>
              Mega Hair
            </span>
          </h1>
          <p
            className="mt-6 text-lg font-medium text-[#E2B07E] md:text-xl opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Excelência e sofisticação em Mega Hair premium.
          </p>
          <p
            className="mt-3 text-base text-[#DCC7B2]/90 md:text-lg opacity-0 animate-fade-up"
            style={{ animationDelay: "0.28s", animationFillMode: "forwards" }}
          >
            Transforme seu visual com autoridade, glamour e a qualidade que você merece.
          </p>
          <div
            className="mt-12 flex flex-wrap gap-5 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.36s", animationFillMode: "forwards" }}
          >
            <Button size="lg" className="btn-premium" asChild>
              <Link href="/catalogo">Comprar Cabelos</Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-premium" asChild>
              <a href={whatsappUrl("Gostaria de agendar uma avaliação.")} target="_blank" rel="noopener noreferrer">
                Agendar Avaliação
              </a>
            </Button>
          </div>
        </div>

        {/* Imagem da lead: /lolla.png — moldura Vinho Luxo, glow Caramelo Gold, zoom-in */}
        <div className="mt-16 hidden w-full max-w-md flex-shrink-0 lg:mt-0 lg:block xl:max-w-lg animate-fade-right" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lead-frame transition-transform duration-700 hover:scale-[1.02]">
            <Image
              src="/lolla.png"
              alt="Lolla Toledo - Especialista em Mega Hair"
              fill
              sizes="(max-width: 1024px) 0, 480px"
              className="object-cover object-top"
              priority
            />
            {/* Moldura Vinho Luxo + glow Caramelo Gold */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-[#7B2433]"
              style={{
                boxShadow: "inset 0 0 60px rgba(201, 138, 72, 0.08), 0 0 40px rgba(201, 138, 72, 0.15)",
              }}
            />
            {/* Fade-bottom para integrar com fundo escuro */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-2xl bg-gradient-to-t from-[#1E1412] to-transparent pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-[#A55B35]/60" aria-hidden />
    </section>
  );
}
