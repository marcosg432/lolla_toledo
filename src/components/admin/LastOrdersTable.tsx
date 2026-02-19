"use client";

interface PedidoItem {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoAplicado: number;
  subtotal: number;
}

interface Pedido {
  id: number;
  cliente: string | null;
  telefone: string | null;
  items: PedidoItem[] | string;
  total: number;
  data: string;
  status: string;
  pagamento: string | null;
  observacao: string | null;
  // Campos legados
  produtoId?: string | null;
  produtoNome?: string | null;
  quantidade?: number;
  tipo?: string | null;
  precoAplicado?: number;
}

interface LastOrdersTableProps {
  pedidos: Pedido[];
}

export function LastOrdersTable({ pedidos }: LastOrdersTableProps) {
  if (pedidos.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
        <p className="text-zinc-400">Nenhum pedido registrado ainda.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmado":
        return "text-green-400";
      case "pendente":
        return "text-yellow-400";
      case "cancelado":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Últimos Pedidos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 font-medium text-zinc-400">ID</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Cliente</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Itens</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Quantidade</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Preço</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Data</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {pedidos.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-zinc-900/50">
              <td className="px-4 py-3 text-white">{pedido.id}</td>
              <td className="px-4 py-3 text-zinc-300">{pedido.cliente || "-"}</td>
              <td className="px-4 py-3 text-zinc-300">
                {(() => {
                  const items = Array.isArray(pedido.items)
                    ? pedido.items
                    : typeof pedido.items === "string"
                    ? JSON.parse(pedido.items || "[]")
                    : [];
                  if (items.length > 0) {
                    return `${items.length} item${items.length > 1 ? "s" : ""}`;
                  }
                  return pedido.produtoNome || pedido.produtoId || "-";
                })()}
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {(() => {
                  const items = Array.isArray(pedido.items)
                    ? pedido.items
                    : typeof pedido.items === "string"
                    ? JSON.parse(pedido.items || "[]")
                    : [];
                  if (items.length > 0) {
                    return items.reduce((sum: number, item: PedidoItem) => sum + (item.quantidade || 0), 0);
                  }
                  return pedido.quantidade || 0;
                })()}
              </td>
              <td className="px-4 py-3">
                <span className="text-zinc-400">-</span>
              </td>
              <td className="px-4 py-3 text-zinc-300">
                R$ {pedido.total?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 
                     pedido.precoAplicado?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 
                     "0,00"}
              </td>
              <td className="px-4 py-3 text-zinc-300">{formatDate(pedido.data)}</td>
              <td className={`px-4 py-3 ${getStatusColor(pedido.status)}`}>
                {pedido.status || "pendente"}
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
