import Link from "next/link";
import { Package, Scissors, MessageSquare, Calendar, Image, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { DashboardStats } from "@/components/admin/DashboardStats";

export default function DashboardPage() {
  const products = db.products();
  const services = db.services();
  const testimonials = db.testimonials();
  const appointments = db.appointments();
  const beforeAfter = db.beforeAfter();
  const banners = db.banners();

  const cards = [
    { title: "Produtos", value: products.length, href: "/admin/dashboard/produtos", icon: Package },
    { title: "Serviços", value: services.length, href: "/admin/dashboard/servicos", icon: Scissors },
    { title: "Depoimentos", value: testimonials.length, href: "/admin/dashboard/depoimentos", icon: MessageSquare },
    { title: "Antes e Depois", value: beforeAfter.length, href: "/admin/dashboard/antese-depois", icon: Image },
    { title: "Banners", value: banners.length, href: "/admin/dashboard/banners", icon: Image },
    { title: "Agendamentos", value: appointments.length, href: "/admin/dashboard/agenda", icon: Calendar },
  ];

  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-zinc-400">Visão geral do painel</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-gold/30 hover:bg-zinc-900"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">{title}</p>
                <p className="text-2xl font-semibold text-gold">{value}</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-500" />
          </Link>
        ))}
      </div>

      {/* Estatísticas e gráficos */}
      <DashboardStats />
    </div>
  );
}
