"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [length, setLength] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          price: price ? Number(price) : 0,
          image,
          length: length || undefined,
          color: color || undefined,
          type: type || undefined,
          featured,
          order: 0,
        }),
      });
      if (res.ok) router.push("/admin/dashboard/produtos");
      else alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/produtos" className="text-sm text-gold hover:underline">
          ← Voltar aos produtos
        </Link>
      </div>
      <h1 className="font-playfair text-2xl font-semibold text-white">Novo produto</h1>
      <Card className="mt-6 border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <p className="text-zinc-400">Preencha os dados do produto (cabelo) para o catálogo.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preço (0 = sob consulta)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="space-y-2">
                <Label>URL da imagem</Label>
                <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="bg-zinc-800 border-zinc-700" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Comprimento</Label>
                <Input value={length} onChange={(e) => setLength(e.target.value)} placeholder="ex: 40cm" className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="ex: 1B" className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="ex: Mega Hair" className="bg-zinc-800 border-zinc-700" />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-zinc-600" />
              <span className="text-sm text-zinc-300">Destaque na home</span>
            </label>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
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
