import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const products = db.catalogProducts();
  const product = products.find((p) => p.id === id);
  if (!product)
    return {
      title: "Produto não encontrado | Lolla Toledo Mega Hair",
    };
  return {
    title: `${product.name} | Catálogo Lolla Toledo Mega Hair`,
    description: product.description || `Cabelo premium ${product.name}. Mega Hair de alta qualidade.`,
  };
}

export default async function CatalogoProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const products = db.catalogProducts();
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  const specs = [
    product.type && { label: "Tipo / Textura", value: product.type },
    product.length && { label: "Comprimento", value: product.length },
    product.peso && { label: "Peso", value: product.peso },
    product.color && { label: "Cor", value: product.color },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen bg-[#1E1412]">
      <div className="absolute inset-0 bg-soft-texture opacity-10" aria-hidden />

      {/* Header da página — Preto Quente + linha Cobre */}
      <header className="relative border-b-2 border-[#A55B35] bg-[#0B0908] py-4 md:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          <Button variant="ghost" size="sm" className="text-[#E2B07E] hover:bg-[#3B1F1A] hover:text-[#C98A48]" asChild>
            <Link href="/catalogo" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao catálogo
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Foto grande do cabelo — esquerda */}
          <RevealOnScroll className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-[#7B2433] bg-[#3B1F1A] shadow-[0_0_0_1px_rgba(123,36,51,0.5),0_16px_48px_rgba(11,9,8,0.5)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 rounded-2xl border-2 border-[#7B2433]/40 shadow-inner" aria-hidden />
          </RevealOnScroll>

          {/* Informações — direita */}
          <RevealOnScroll delay={100}>
            <div className="flex flex-col">
              {/* Nome — Borgonha Profundo */}
              <h1 className="font-playfair text-3xl font-semibold leading-tight text-[#4A0E1F] md:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Descrição completa — Âmbar Suave */}
              {product.description && (
                <p className="mt-6 text-base leading-relaxed text-[#E2B07E]/95 md:text-lg">
                  {product.description}
                </p>
              )}

              {/* Tabela de especificações — Chocolate Premium */}
              {specs.length > 0 && (
                <div className="mt-10 overflow-hidden rounded-2xl border-2 border-[#7B2433] bg-[#3B1F1A] shadow-[0_8px_32px_rgba(11,9,8,0.4)]">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-[#7B2433]/40">
                      {specs.map(({ label, value }) => (
                        <tr key={label}>
                          <th className="px-6 py-4 font-medium text-[#C98A48]">{label}</th>
                          <td className="px-6 py-4 text-[#E2B07E]/95">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Preço destacado — Caramelo Gold Burned */}
              <p className="mt-10 text-2xl font-semibold text-[#C98A48] md:text-3xl">
                {product.price > 0
                  ? `R$ ${product.price.toLocaleString("pt-BR")}`
                  : "Sob consulta"}
              </p>

              {/* Botão Comprar pelo WhatsApp — Cobre Escuro, ícone Âmbar */}
              <a
                href={whatsappUrl(`Olá! Tenho interesse no produto: ${product.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#A55B35] px-6 py-4 text-base font-medium text-[#0B0908] transition-all duration-300 hover:bg-[#C98A48] hover:shadow-[0_0_24px_rgba(201,138,72,0.35)] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 text-[#E2B07E]" />
                Comprar pelo WhatsApp
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
}
