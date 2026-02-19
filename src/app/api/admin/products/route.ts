import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, type Product } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  
  // Forçar leitura direta do JSON, sem cache
  const products = db.products().sort((a, b) => a.order - b.order);
  
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const product: Product = {
      id: crypto.randomUUID(),
      name: body.name ?? "",
      description: body.description ?? "",
      price: Number(body.price) || 0,
      image: body.image ?? "",
      length: body.length,
      color: body.color,
      type: body.type,
      featured: !!body.featured,
      order: body.order ?? 0,
      estoque: body.estoque !== undefined ? Number(body.estoque) : 0,
      ativo: body.ativo !== undefined ? !!body.ativo : true,
      createdAt: new Date().toISOString(),
    };
    const list = db.products();
    list.push(product);
    db.setProducts(list);
    
    // Invalidar cache
    invalidateJsonCache("products");
    
    // Revalidar páginas do catálogo
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/catalogo");
      revalidatePath("/");
    } catch {
      // Ignorar erros
    }
    
    // Atualizar também no SQLite
    try {
      const { sqliteDb } = await import("@/lib/sqlite");
      sqliteDb.atualizarEstoqueProduto(product.id, product.estoque || 0, product.ativo);
    } catch {
      // Ignorar erros do SQLite
    }
    
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    console.log("[API PUT] Recebido body:", body);
    
    const list = db.products();
    console.log("[API PUT] Total produtos no JSON:", list.length);
    
    const i = list.findIndex((p) => p.id === body.id);
    console.log("[API PUT] Índice encontrado:", i);
    
    if (i < 0) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    
    const updatedProduct = {
      ...list[i],
      ...body,
      id: list[i].id,
      createdAt: list[i].createdAt,
      // Garantir que estoque e ativo sejam sempre números/booleanos
      estoque: body.estoque !== undefined ? Number(body.estoque) : (list[i].estoque !== undefined ? Number(list[i].estoque) : 0),
      ativo: body.ativo !== undefined ? !!body.ativo : (list[i].ativo !== undefined ? !!list[i].ativo : true),
    };
    
    console.log("[API PUT] Produto atualizado:", updatedProduct);
    
    list[i] = updatedProduct;
    console.log("[API PUT] Salvando lista de produtos...");
    try {
      db.setProducts(list);
      console.log("[API PUT] Produtos salvos com sucesso!");
    } catch (writeError) {
      console.error("[API PUT] Erro ao escrever arquivo:", writeError);
      throw writeError; // Re-lançar para ser capturado pelo catch externo
    }
    
    // CRÍTICO: Invalidar cache e revalidar páginas do Next.js
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/catalogo");
      revalidatePath("/");
      revalidatePath("/catalogo/[id]", "page");
    } catch (e) {
      console.error("[API PUT] Erro ao revalidar cache:", e);
    }
    
    // Atualizar também no SQLite
    try {
      const { sqliteDb } = await import("@/lib/sqlite");
      sqliteDb.atualizarEstoqueProduto(updatedProduct.id, updatedProduct.estoque || 0, updatedProduct.ativo);
    } catch (sqliteError) {
      console.error("[API PUT] Erro ao atualizar SQLite (ignorado):", sqliteError);
      // Ignorar erros do SQLite - não é crítico
    }
    
    return NextResponse.json(list[i]);
  } catch (error) {
    console.error("[API PUT /admin/products] Erro ao atualizar produto:", error);
    return NextResponse.json({ 
      error: "Erro ao atualizar produto", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const list = db.products().filter((p) => p.id !== id);
  db.setProducts(list);
  return NextResponse.json({ success: true });
}
