import { AgendarForm } from "@/components/agendar/AgendarForm";
import { db } from "@/lib/db";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = {
  title: "Agendar | Lolla Toledo Mega Hair",
  description: "Agende sua avaliação ou serviço de Mega Hair. Horários disponíveis e confirmação rápida.",
};

export default function AgendarPage() {
  const raw = db.services();
  const services = Array.isArray(raw)
    ? [...raw]
        .filter((s) => s && typeof s === "object" && "id" in s && "name" in s)
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
        .map((s) => ({
          id: String(s.id),
          name: String(s.name),
          description: String(s.description ?? ""),
          price: Number(s.price ?? 0),
          duration: String(s.duration ?? ""),
          image: s.image ? String(s.image) : undefined,
          order: Number(s.order ?? 0),
          createdAt: String(s.createdAt ?? ""),
        }))
    : [];

  return (
    <div className="min-h-screen bg-[#1E1412]">
      <section className="relative border-b border-[#7B2433]/40 bg-[#1E1412] py-28 md:py-36">
        <div className="absolute inset-0 bg-soft-texture opacity-20" aria-hidden />
        <RevealOnScroll className="relative mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C98A48]">Agendamento</p>
          <h1 className="mt-6 font-playfair text-4xl font-semibold text-[#4A0E1F] md:text-5xl lg:text-6xl">
            Agende sua avaliação
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[#E2B07E]/90 md:text-lg">
            Preencha os dados e envie. Entraremos em contato para confirmar o melhor horário.
          </p>
        </RevealOnScroll>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <RevealOnScroll>
            <AgendarForm services={services} />
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
