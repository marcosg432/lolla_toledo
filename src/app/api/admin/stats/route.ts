import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sqliteDb } from "@/lib/sqlite";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const totalPedidos = sqliteDb.totalPedidos();
    const pedidosPorMes = sqliteDb.pedidosPorMes();
    const produtosMaisVendidos = sqliteDb.produtosMaisVendidos(5);
    const faturamentoTotal = sqliteDb.faturamentoTotal();
    const ultimosPedidos = sqliteDb.obterPedidos(10);

    return NextResponse.json({
      totalPedidos,
      faturamentoTotal,
      pedidosPorMes,
      produtosMaisVendidos,
      ultimosPedidos,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      {
        totalPedidos: 0,
        faturamentoTotal: 0,
        pedidosPorMes: [],
        produtosMaisVendidos: [],
        ultimosPedidos: [],
      },
      { status: 200 }
    );
  }
}
