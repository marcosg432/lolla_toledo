"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import type { Product } from "@/lib/db";

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ [key: string]: { estoque: number; ativo: boolean } }>({});

  const load = async () => {
    const res = await fetch("/api/admin/products", { credentials: "include", cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      // Se a resposta for um objeto com 'products', usar products, senão usar data diretamente
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsArray);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const iniciarEdicao = (product: Product) => {
    setEditing({
      ...editing,
      [product.id]: {
        estoque: product.estoque || 0,
        ativo: product.ativo !== false,
      },
    });
  };

  const cancelarEdicao = (productId: string) => {
    const newEditing = { ...editing };
    delete newEditing[productId];
    setEditing(newEditing);
  };

  const atualizarEstoque = async (product: Product) => {
    const edit = editing[product.id];
    if (!edit) return;

    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: product.id,
        estoque: edit.estoque,
        ativo: edit.ativo,
      }),
    });

    if (res.ok) {
      cancelarEdicao(product.id);
      // Recarregar produtos
      await load();
      // Forçar reload da página do catálogo se estiver aberta
      if (typeof window !== "undefined") {
        // Invalidar cache do Next.js
        await fetch("/catalogo", { cache: "no-store" });
      }
    } else {
      alert("Erro ao atualizar estoque");
    }
  };

  const toggleAtivo = (productId: string) => {
    setEditing({
      ...editing,
      [productId]: {
        ...editing[productId],
        ativo: !editing[productId].ativo,
      },
    });
  };

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <div>
        <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Controle de Estoque</h1>
        <p className="mt-1 text-zinc-400">Gerencie o estoque e disponibilidade dos produtos</p>
      </div>
      <div className="mt-8">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <p className="text-zinc-400">Clique em "Atualizar estoque" para editar a quantidade e status de cada produto.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-4 py-3 font-medium text-zinc-400">Produto</th>
                    <th className="px-4 py-3 font-medium text-zinc-400">Estoque Atual</th>
                    <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                    <th className="px-4 py-3 font-medium text-zinc-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                        Nenhum produto cadastrado.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const isEditing = editing[product.id] !== undefined;
                      const edit = editing[product.id];
                      const estoque = isEditing ? edit.estoque : product.estoque || 0;
                      const ativo = isEditing ? edit.ativo : product.ativo !== false;

                      return (
                        <tr key={product.id} className="hover:bg-zinc-900/50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-white">{product.name}</p>
                            {product.length && (
                              <p className="text-xs text-zinc-400">{product.length}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                value={edit.estoque}
                                onChange={(e) =>
                                  setEditing({
                                    ...editing,
                                    [product.id]: {
                                      ...edit,
                                      estoque: Number(e.target.value),
                                    },
                                  })
                                }
                                className="w-24 bg-zinc-800 border-zinc-700"
                              />
                            ) : (
                              <p className={`text-white ${estoque === 0 ? "text-red-400" : ""}`}>
                                {estoque} {estoque === 1 ? "unidade" : "unidades"}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={edit.ativo}
                                  onChange={() => toggleAtivo(product.id)}
                                  className="rounded border-zinc-600"
                                />
                                <span className="text-sm text-zinc-300">
                                  {edit.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </label>
                            ) : (
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  ativo && estoque > 0
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {ativo && estoque > 0 ? "Disponível" : "Indisponível"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => atualizarEstoque(product)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cancelarEdicao(product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => iniciarEdicao(product)}
                              >
                                Atualizar estoque
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
