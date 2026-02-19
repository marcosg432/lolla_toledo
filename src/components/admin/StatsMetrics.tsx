"use client";

interface StatsMetricsProps {
  totalPedidos: number;
  faturamentoTotal: number;
}

export function StatsMetrics({ totalPedidos, faturamentoTotal }: StatsMetricsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-sm text-zinc-400">Total de Pedidos</p>
        <p className="mt-2 text-3xl font-semibold text-gold">{totalPedidos}</p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-sm text-zinc-400">Faturamento Total</p>
        <p className="mt-2 text-3xl font-semibold text-gold">
          R$ {faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
