import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sqliteDb } from "@/lib/sqlite";

export async function POST(req: NextRequest) {
  // Permitir criação de pedidos sem autenticação (para compras do site)
  // Mas manter GET protegido para admin
  try {
    const body = await req.json();
    
    // Se tiver items (novo formato), usar items
    if (body.items && Array.isArray(body.items)) {
      const total = body.items.reduce((sum: number, item: { subtotal?: number }) => sum + (item.subtotal || 0), 0);
      const pedido = sqliteDb.criarPedido({
        cliente: body.cliente || null,
        telefone: body.telefone || null,
        items: body.items,
        total,
        data: body.data || new Date().toISOString(),
        status: body.status || "pendente",
        pagamento: body.pagamento || null,
        observacao: body.observacao || null,
      });
      
      // Reduzir estoque para cada item
      for (const item of body.items) {
        if (item.produtoId && item.quantidade) {
          sqliteDb.reduzirEstoque(item.produtoId, item.quantidade);
          // Atualizar também no JSON
          const { db } = await import("@/lib/db");
          const products = db.products();
          const productIndex = products.findIndex((p) => p.id === item.produtoId);
          if (productIndex >= 0) {
            const novoEstoque = Math.max(0, (products[productIndex].estoque || 0) - item.quantidade);
            products[productIndex].estoque = novoEstoque;
            products[productIndex].ativo = novoEstoque > 0;
            db.setProducts(products);
          }
        }
      }
      
      return NextResponse.json({ success: true, id: pedido.lastInsertRowid });
    }
    
    // Formato antigo (compatibilidade)
    const pedido = sqliteDb.criarPedido({
      cliente: body.cliente || null,
      telefone: body.telefone || null,
      produtoId: body.produtoId || null,
      produtoNome: body.produtoNome || null,
      quantidade: body.quantidade || 1,
      tipo: body.tipo || null,
      precoAplicado: body.precoAplicado || 0,
      data: body.data || new Date().toISOString(),
      status: body.status || "pendente",
      pagamento: body.pagamento || null,
      observacao: body.observacao || null,
    });
    
    // Reduzir estoque (formato antigo)
    if (body.produtoId && body.quantidade) {
      sqliteDb.reduzirEstoque(body.produtoId, body.quantidade);
      // Atualizar também no JSON
      const { db } = await import("@/lib/db");
      const products = db.products();
      const productIndex = products.findIndex((p) => p.id === body.produtoId);
      if (productIndex >= 0) {
        const novoEstoque = Math.max(0, (products[productIndex].estoque || 0) - body.quantidade);
        products[productIndex].estoque = novoEstoque;
        products[productIndex].ativo = novoEstoque > 0;
        db.setProducts(products);
      }
    }
    
    return NextResponse.json({ success: true, id: pedido.lastInsertRowid });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const pedidos = sqliteDb.obterPedidos();
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    
    // Buscar pedido antigo para repor estoque
    const pedidoAntigo = sqliteDb.obterPedidoPorId(id);
    if (pedidoAntigo) {
      const itemsAntigos = Array.isArray(pedidoAntigo.items) ? pedidoAntigo.items : [];
      // Repor estoque dos items antigos
      for (const item of itemsAntigos) {
        if (item.produtoId && item.quantidade) {
          sqliteDb.reporEstoque(item.produtoId, item.quantidade);
          const { db } = await import("@/lib/db");
          const products = db.products();
          const productIndex = products.findIndex((p) => p.id === item.produtoId);
          if (productIndex >= 0) {
            const novoEstoque = (products[productIndex].estoque || 0) + item.quantidade;
            products[productIndex].estoque = novoEstoque;
            products[productIndex].ativo = novoEstoque > 0;
            db.setProducts(products);
          }
        }
      }
    }
    
    sqliteDb.atualizarPedido(id, updates);
    
    // Reduzir estoque dos novos items se houver
    if (updates.items && Array.isArray(updates.items)) {
      for (const item of updates.items) {
        if (item.produtoId && item.quantidade) {
          sqliteDb.reduzirEstoque(item.produtoId, item.quantidade);
          const { db } = await import("@/lib/db");
          const products = db.products();
          const productIndex = products.findIndex((p) => p.id === item.produtoId);
          if (productIndex >= 0) {
            const novoEstoque = Math.max(0, (products[productIndex].estoque || 0) - item.quantidade);
            products[productIndex].estoque = novoEstoque;
            products[productIndex].ativo = novoEstoque > 0;
            db.setProducts(products);
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    
    // Buscar pedido antes de excluir para repor estoque
    const pedido = sqliteDb.obterPedidoPorId(Number(id));
    if (pedido) {
      const items = Array.isArray(pedido.items) ? pedido.items : [];
      // Repor estoque de cada item
      for (const item of items) {
        if (item.produtoId && item.quantidade) {
          sqliteDb.reporEstoque(item.produtoId, item.quantidade);
          // Atualizar também no JSON
          const { db } = await import("@/lib/db");
          const products = db.products();
          const productIndex = products.findIndex((p) => p.id === item.produtoId);
          if (productIndex >= 0) {
            const novoEstoque = (products[productIndex].estoque || 0) + item.quantidade;
            products[productIndex].estoque = novoEstoque;
            products[productIndex].ativo = novoEstoque > 0;
            db.setProducts(products);
          }
        }
      }
      
      // Compatibilidade com formato antigo
      if (pedido.produtoId && pedido.quantidade) {
        sqliteDb.reporEstoque(pedido.produtoId, pedido.quantidade);
        const { db } = await import("@/lib/db");
        const products = db.products();
        const productIndex = products.findIndex((p) => p.id === pedido.produtoId);
        if (productIndex >= 0) {
          const novoEstoque = (products[productIndex].estoque || 0) + pedido.quantidade;
          products[productIndex].estoque = novoEstoque;
          products[productIndex].ativo = novoEstoque > 0;
          db.setProducts(products);
        }
      }
    }
    
    sqliteDb.excluirPedido(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    return NextResponse.json({ error: "Erro ao excluir pedido" }, { status: 500 });
  }
}
