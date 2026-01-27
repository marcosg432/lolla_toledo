"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function NovoServicoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          price: price ? Number(price) : 0,
          duration,
          image: image || undefined,
          order: 0,
        }),
      });
      if (res.ok) router.push("/admin/dashboard/servicos");
      else alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/servicos" className="text-sm text-gold hover:underline">
          ← Voltar aos serviços
        </Link>
      </div>
      <h1 className="font-playfair text-2xl font-semibold text-white">Novo serviço</h1>
      <Card className="mt-6 border-zinc-800 bg-zinc-900/50">
        <CardContent className="pt-6">
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
                <Label>Duração</Label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="ex: 4h" className="bg-zinc-800 border-zinc-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL da imagem (opcional)</Label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/servicos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
