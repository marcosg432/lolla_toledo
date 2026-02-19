import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sqliteDb } from "@/lib/sqlite";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const pedido = sqliteDb.obterPedidoPorId(Number(params.id));
    if (!pedido) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json({ error: "Erro ao buscar pedido" }, { status: 500 });
  }
}
