"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader>
          <h1 className="font-playfair text-2xl font-semibold text-white">
            Lolla Toledo <span className="text-gold">Admin</span>
          </h1>
          <p className="text-sm text-zinc-400">Painel administrativo</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <p className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-400">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lollatoledo.com"
                required
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Primeiro acesso: admin@lollatoledo.com / admin123
          </p>
          <p className="mt-2 text-center">
            <Link href="/" className="text-sm text-gold hover:underline">
              Voltar ao site
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
