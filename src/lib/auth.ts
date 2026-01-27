import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lolla-toledo-mega-hair-secret-change-in-production"
);

export async function signToken(payload: { email: string; id: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { email: string; id: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const c = await cookies();
  const t = c.get("auth")?.value;
  if (!t) return null;
  return verifyToken(t);
}

export async function setAuthCookie(token: string) {
  (await cookies()).set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie() {
  (await cookies()).delete("auth");
}
