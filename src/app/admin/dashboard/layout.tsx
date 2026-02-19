import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  Scissors,
  MessageSquare,
  Image,
  Calendar,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/dashboard/pedidos", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/dashboard/produtos", label: "Produtos", icon: Package },
    { href: "/admin/dashboard/estoque", label: "Estoque", icon: Warehouse },
    { href: "/admin/dashboard/servicos", label: "Serviços", icon: Scissors },
    { href: "/admin/dashboard/depoimentos", label: "Depoimentos", icon: MessageSquare },
    { href: "/admin/dashboard/antese-depois", label: "Antes e Depois", icon: Image },
    { href: "/admin/dashboard/banners", label: "Banners", icon: Image },
    { href: "/admin/dashboard/agenda", label: "Agenda", icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 p-4">
          <Link href="/admin/dashboard" className="font-playfair text-lg font-semibold text-white">
            Lolla <span className="text-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-2">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
