"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";

const nav = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/agendar", label: "Agendar" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[#A55B35] bg-[#0B0908] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-playfair text-xl font-semibold tracking-wide text-[#E2B07E] md:text-2xl"
        >
          Lolla Toledo
          <span className="text-[#C98A48]"> Mega Hair</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[#E2B07E]/90 transition-colors duration-200 hover:text-[#C98A48]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" className="border-[#A55B35]/70 bg-transparent text-[#E2B07E] hover:bg-[#A55B35]/20 hover:text-[#0B0908] hover:border-[#C98A48]" asChild>
            <Link href="/catalogo">Comprar Cabelos</Link>
          </Button>
          <Button size="sm" className="btn-premium" asChild>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Agendar
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-[#E2B07E] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#A55B35]/50 bg-[#0B0908] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="border-[#A55B35]/70 bg-transparent text-[#E2B07E] hover:bg-[#A55B35]/20" asChild>
                <Link href="/catalogo" onClick={() => setOpen(false)}>
                  Comprar Cabelos
                </Link>
              </Button>
              <Button size="sm" className="btn-premium" asChild>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  Agendar
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
