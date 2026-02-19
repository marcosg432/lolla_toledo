import { unstable_noStore } from "next/cache";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = {
  title: "Catálogo de Cabelos Premium | Lolla Toledo Mega Hair",
  description: "Vitrine de cabelos premium para Mega Hair. Fios selecionados, 100% humano e alta qualidade.",
};

// Forçar revalidação a cada requisição - CONFIGURAÇÕES MÁXIMAS PARA DESABILITAR CACHE
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

export default function CatalogoPage() {
  // Forçar Next.js a não fazer cache
  unstable_noStore();
  
  const productsRaw = db.catalogProducts();
  
  // Garantir que os dados sejam serializáveis corretamente para o componente cliente
  // Isso garante que estoque e ativo sejam sempre números e booleanos válidos
  const products = productsRaw.map((p) => ({
    ...p,
    estoque: typeof p.estoque === "number" ? p.estoque : (p.estoque !== undefined && p.estoque !== null ? Number(p.estoque) : 0),
    ativo: typeof p.ativo === "boolean" ? p.ativo : (p.ativo !== undefined && p.ativo !== null ? Boolean(p.ativo) : (p.estoque && Number(p.estoque) > 0)),
  }));

  return (
    <div className="min-h-screen bg-[#1E1412]">
      {/* Header da página — Preto Quente + linha Cobre Escuro */}
      <header className="relative border-b-2 border-[#A55B35] bg-[#0B0908]">
        <div className="absolute inset-0 bg-soft-texture opacity-10" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <RevealOnScroll className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#C98A48]">
              Loja de cabelos premium
            </p>
            <h1 className="mt-4 font-playfair text-4xl font-semibold leading-tight text-[#4A0E1F] md:text-5xl lg:text-6xl xl:text-7xl">
              Catálogo de Cabelos Premium
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[#E2B07E]/90 md:text-lg">
              Experiência estilo loja de luxo. Fios selecionados, 100% humano e alta qualidade.
            </p>
          </RevealOnScroll>
        </div>
      </header>

      {/* Grid dos produtos — Café Intenso, 3/2/1 colunas, espaçamento amplo */}
      <section className="relative bg-[#1E1412] py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-soft-texture opacity-10" aria-hidden />
        <CatalogGrid products={products} />
      </section>
    </div>
  );
}
