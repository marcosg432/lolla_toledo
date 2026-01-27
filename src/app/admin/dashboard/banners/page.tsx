"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Banner } from "@/lib/db";

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/banners", { credentials: "include" });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este banner?")) return;
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Banners</h1>
      <p className="mt-1 text-zinc-400">Banners da home e destaques</p>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center text-zinc-400">
              Nenhum banner cadastrado.
            </CardContent>
          </Card>
        ) : (
          items.map((b) => (
            <Card key={b.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{b.title}</p>
                  {b.subtitle && <p className="text-sm text-zinc-400">{b.subtitle}</p>}
                </div>
                <Button variant="destructive" size="sm" onClick={() => remove(b.id)}>
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
