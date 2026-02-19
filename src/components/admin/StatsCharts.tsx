"use client";

import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StatsChartsProps {
  pedidosPorMes: Array<{ mes: string; total: number }>;
  produtosMaisVendidos: Array<{ produtoId: string; produtoNome: string; total: number }>;
  hasData: boolean;
}

const COLORS = {
  linha: "#A55B35",
  barras: "#611726",
};

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function StatsCharts({ pedidosPorMes, produtosMaisVendidos, hasData }: StatsChartsProps) {
  if (!hasData) {
    return (
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
        <p className="text-zinc-400">
          Ainda não há dados suficientes para gerar gráficos.
          <br />
          Assim que os pedidos forem registrados, os gráficos serão exibidos automaticamente.
        </p>
      </div>
    );
  }

  // Preparar dados para gráfico de linha (meses)
  const lineData = pedidosPorMes.map((item) => ({
    mes: meses[parseInt(item.mes) - 1] || item.mes,
    total: item.total,
  }));

  // Preparar dados para gráfico de barras (produtos)
  const barData = produtosMaisVendidos.map((item) => ({
    nome: item.produtoNome || `Produto ${item.produtoId}`,
    total: item.total,
  }));

  return (
    <div className="mt-8 space-y-8">
      {/* Gráfico 1: Pizza - Atacado x Varejo */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Distribuição: Atacado x Varejo</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-zinc-400">Sem dados de tipo de pedido</p>
        )}
      </div>

      {/* Gráfico 2: Linha - Vendas por mês */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Vendas por Mês</h3>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke={COLORS.linha} strokeWidth={2} name="Pedidos" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-zinc-400">Sem dados de vendas por mês</p>
        )}
      </div>

      {/* Gráfico 2: Barras - Produtos mais vendidos */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Produtos Mais Vendidos</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="nome" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              <Bar dataKey="total" fill={COLORS.barras} name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-zinc-400">Sem dados de produtos vendidos</p>
        )}
      </div>
    </div>
  );
}
