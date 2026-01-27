"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/lib/db";

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/services", { credentials: "include" });
    if (res.ok) setServices(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este serviço?")) return;
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Serviços</h1>
          <p className="mt-1 text-zinc-400">Mega Hair, manutenção, avaliação, etc.</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/servicos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo serviço
          </Link>
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {services.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center text-zinc-400">
              Nenhum serviço cadastrado.
            </CardContent>
          </Card>
        ) : (
          services.map((s) => (
            <Card key={s.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{s.name}</p>
                  <p className="text-sm text-zinc-400">{s.duration} • {s.price > 0 ? `R$ ${s.price.toLocaleString("pt-BR")}` : "Sob consulta"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/dashboard/servicos/${s.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
