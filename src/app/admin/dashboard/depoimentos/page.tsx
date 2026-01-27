"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/db";

export default function DepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/testimonials", { credentials: "include" });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Depoimentos</h1>
      <p className="mt-1 text-zinc-400">Depoimentos de clientes e alunas</p>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center text-zinc-400">
              Nenhum depoimento cadastrado.
            </CardContent>
          </Card>
        ) : (
          items.map((t) => (
            <Card key={t.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-zinc-400 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => remove(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
