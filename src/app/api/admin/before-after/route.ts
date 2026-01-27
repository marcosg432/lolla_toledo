import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, type BeforeAfter } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return NextResponse.json(db.beforeAfter().sort((a, b) => a.order - b.order));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const b: BeforeAfter = {
      id: crypto.randomUUID(),
      title: body.title ?? "",
      beforeImage: body.beforeImage ?? "",
      afterImage: body.afterImage ?? "",
      order: body.order ?? 0,
      createdAt: new Date().toISOString(),
    };
    const list = db.beforeAfter();
    list.push(b);
    db.setBeforeAfter(list);
    return NextResponse.json(b);
  } catch {
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const list = db.beforeAfter();
    const i = list.findIndex((x) => x.id === body.id);
    if (i < 0) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    list[i] = { ...list[i], ...body, id: list[i].id, createdAt: list[i].createdAt };
    db.setBeforeAfter(list);
    return NextResponse.json(list[i]);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  db.setBeforeAfter(db.beforeAfter().filter((x) => x.id !== id));
  return NextResponse.json({ success: true });
}
