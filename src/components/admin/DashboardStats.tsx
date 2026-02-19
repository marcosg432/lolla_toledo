"use client";

import { useEffect, useState } from "react";
import { StatsMetrics } from "./StatsMetrics";
import { StatsCharts } from "./StatsCharts";
import { LastOrdersTable } from "./LastOrdersTable";

interface StatsData {
  totalPedidos: number;
  faturamentoTotal: number;
  pedidosPorMes: Array<{ mes: string; total: number }>;
  produtosMaisVendidos: Array<{ produtoId: string; produtoNome: string; total: number }>;
  ultimosPedidos: Array<{
    id: number;
    cliente: string | null;
    produtoId: string | null;
    produtoNome: string | null;
    quantidade: number;
    precoAplicado: number;
    data: string;
    status: string;
  }>;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 text-center text-zinc-400">
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
        <p className="text-zinc-400">Erro ao carregar estatísticas.</p>
      </div>
    );
  }

  const hasData = stats.totalPedidos > 0;

  return (
    <>
      <StatsMetrics
        totalPedidos={stats.totalPedidos}
        faturamentoTotal={stats.faturamentoTotal}
      />
      <StatsCharts
        pedidosPorMes={stats.pedidosPorMes}
        produtosMaisVendidos={stats.produtosMaisVendidos}
        hasData={hasData}
      />
      <LastOrdersTable pedidos={stats.ultimosPedidos} />
    </>
  );
}
