"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/lib/db";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/products", { credentials: "include" });
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Produtos</h1>
          <p className="mt-1 text-zinc-400">Catálogo de cabelos premium</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/produtos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Link>
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {products.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center text-zinc-400">
              Nenhum produto cadastrado. Cadastre o primeiro em &quot;Novo produto&quot;.
            </CardContent>
          </Card>
        ) : (
          products.map((p) => (
            <Card key={p.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-zinc-400">
                    {p.price > 0 ? `R$ ${p.price.toLocaleString("pt-BR")}` : "Sob consulta"}
                    {p.length && ` • ${p.length}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/dashboard/produtos/${p.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
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
