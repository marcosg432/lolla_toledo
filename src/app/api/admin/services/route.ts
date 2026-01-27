import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, type Service } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return NextResponse.json(db.services().sort((a, b) => a.order - b.order));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const service: Service = {
      id: crypto.randomUUID(),
      name: body.name ?? "",
      description: body.description ?? "",
      price: Number(body.price) || 0,
      duration: body.duration ?? "",
      image: body.image,
      order: body.order ?? 0,
      createdAt: new Date().toISOString(),
    };
    const list = db.services();
    list.push(service);
    db.setServices(list);
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Erro ao criar serviço" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const list = db.services();
    const i = list.findIndex((s) => s.id === body.id);
    if (i < 0) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    list[i] = { ...list[i], ...body, id: list[i].id, createdAt: list[i].createdAt };
    db.setServices(list);
    return NextResponse.json(list[i]);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar serviço" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  db.setServices(db.services().filter((s) => s.id !== id));
  return NextResponse.json({ success: true });
}
