import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const list = db.appointments().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const a = {
      id: crypto.randomUUID(),
      date: body.date ?? "",
      time: body.time ?? "",
      serviceId: body.serviceId ?? "",
      clientName: body.clientName ?? "",
      clientPhone: body.clientPhone ?? "",
      clientEmail: body.clientEmail,
      status: (body.status as "pending" | "confirmed" | "done" | "cancelled") ?? "pending",
      notes: body.notes,
      createdAt: new Date().toISOString(),
    };
    const list = db.appointments();
    list.push(a);
    db.setAppointments(list);
    return NextResponse.json(a);
  } catch {
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const list = db.appointments();
    const i = list.findIndex((x) => x.id === body.id);
    if (i < 0) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    list[i] = { ...list[i], ...body, id: list[i].id, createdAt: list[i].createdAt };
    db.setAppointments(list);
    return NextResponse.json(list[i]);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
