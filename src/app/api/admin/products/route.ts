import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, type Product } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
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
      createdAt: new Date().toISOString(),
    };
    const list = db.products();
    list.push(product);
    db.setProducts(list);
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
    const list = db.products();
    const i = list.findIndex((p) => p.id === body.id);
    if (i < 0) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    list[i] = { ...list[i], ...body, id: list[i].id, createdAt: list[i].createdAt };
    db.setProducts(list);
    return NextResponse.json(list[i]);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
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
