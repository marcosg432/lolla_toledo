import Link from "next/link";
import { MessageCircle, Instagram, MapPin, Phone } from "lucide-react";
import { whatsappUrl, formatPhone, WHATSAPP_NUMBER } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t-2 border-[#A55B35] bg-[#0B0908]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-playfair text-2xl font-semibold text-[#E2B07E]">
              Lolla Toledo
              <span className="text-[#C98A48]"> Mega Hair</span>
            </p>
            <p className="mt-4 text-sm text-[#E2B07E]/90 leading-relaxed">
              Excelência e sofisticação em Mega Hair premium. Transforme seu visual com autoridade e glamour.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-playfair text-lg font-semibold text-[#C98A48]">Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]">Início</Link></li>
              <li><Link href="/catalogo" className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]">Catálogo</Link></li>
              <li><Link href="/sobre" className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]">Sobre</Link></li>
              <li><Link href="/servicos" className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]">Serviços</Link></li>
              <li><Link href="/agendar" className="text-[#E2B07E]/90 transition-colors hover:text-[#C98A48]">Agendar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-playfair text-lg font-semibold text-[#C98A48]">Contato</h4>
            <ul className="space-y-3 text-sm text-[#E2B07E]/90">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-[#C98A48]">
                  <MessageCircle className="h-4 w-4 text-[#C98A48]" /> WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C98A48]" /> {formatPhone(WHATSAPP_NUMBER)}
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-[#C98A48]" /> @lollatoledomegahair
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C98A48]" /> Toledo, PR
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-playfair text-lg font-semibold text-[#C98A48]">Agende</h4>
            <a
              href={whatsappUrl("Gostaria de agendar uma avaliação.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-[#0B0908] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Agendar avaliação
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[#A55B35]/40 pt-8 text-center text-sm text-[#E2B07E]/60">
          © {new Date().getFullYear()} Lolla Toledo Mega Hair. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
