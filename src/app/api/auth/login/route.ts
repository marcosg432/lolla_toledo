import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { readJson, writeJson } from "@/lib/db";
import type { AdminUser } from "@/lib/db";

const ADMINS_FILE = "admins";
const defaultAdmins: AdminUser[] = [
  {
    id: "1",
    email: "admin@lollatoledo.com",
    passwordHash: "$2a$10$rQZ8K9X9X9X9X9X9X9X9XuKJV7xQZ8K9X9X9X9X9X9X9X9X9X9X9X",
    name: "Admin",
    createdAt: new Date().toISOString(),
  },
];

async function getAdmins(): Promise<AdminUser[]> {
  try {
    const admins = readJson<AdminUser[]>(ADMINS_FILE, []);
    if (admins.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      const initial: AdminUser[] = [
        {
          id: "1",
          email: "admin@lollatoledo.com",
          passwordHash: hash,
          name: "Admin",
          createdAt: new Date().toISOString(),
        },
      ];
      writeJson(ADMINS_FILE, initial);
      return initial;
    }
    return admins;
  } catch {
    return defaultAdmins;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha obrigatórios" }, { status: 400 });
    }
    const admins = await getAdmins();
    const admin = admins.find((a) => a.email === email);
    if (!admin) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
    const token = await signToken({ email: admin.email, id: admin.id });
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
