"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Product } from "@/lib/db";

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [length, setLength] = useState("");
  const [peso, setPeso] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState(false);
  const [estoque, setEstoque] = useState("0");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      if (res.ok) {
        const products: Product[] = await res.json();
        const p = products.find((p) => p.id === id);
        if (p) {
          setProduct(p);
          setName(p.name);
          setDescription(p.description || "");
          setPrice(String(p.price || ""));
          setImage(p.image || "");
          setLength(p.length || "");
          setPeso(p.peso || "");
          setColor(p.color || "");
          setType(p.type || "");
          setFeatured(p.featured || false);
          setEstoque(String(p.estoque ?? 0));
          setAtivo(p.ativo ?? true);
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EditarProduto] Função save chamada!");
    setSaving(true);
    try {
      const data = {
        id,
        name,
        description,
        price: Number(price) || 0,
        image,
        length,
        peso: peso || undefined,
        color,
        type,
        featured,
        estoque: Number(estoque) || 0,
        ativo,
      };
      
      console.log("[EditarProduto] Enviando dados:", data);
      
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      console.log("[EditarProduto] Resposta da API:", { status: res.status, result });
      
      if (res.ok) {
        router.push("/admin/dashboard/produtos");
        router.refresh();
      } else {
        alert(`Erro ao salvar: ${result.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("[EditarProduto] Erro ao salvar:", error);
      alert("Erro ao salvar produto. Verifique o console para mais detalhes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-zinc-400">Carregando…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-zinc-400">Produto não encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/admin/dashboard/produtos">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">
            Editar Produto
          </h1>
          <p className="mt-1 text-zinc-400">Atualize as informações do produto</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/produtos">Voltar</Link>
        </Button>
      </div>

      <Card className="mt-8 border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Informações do Produto</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/cabelos/cabelo-01.jpeg"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Mega Hair"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento</Label>
                <Input
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="60cm"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="90g"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Preto"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800"
                />
                <span className="text-sm text-zinc-300">Produto ativo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800"
                />
                <span className="text-sm text-zinc-300">Destaque</span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando…" : "Salvar"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/produtos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
