import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { getSetting } from "./settings";

const COOKIE_NAME = "admin_token";
const JWT_EXPIRY = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definido no .env.local");
  return new TextEncoder().encode(secret);
}

/** Gera um JWT e seta o cookie HttpOnly */
export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
    path: "/",
  });
}

/** Apaga o cookie de sessão */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Verifica se o token JWT do cookie é válido */
export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/** Verifica o token JWT diretamente (usado no middleware) */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/** Verifica e-mail e senha do admin.
 *  Prioridade: tabela users (bcrypt) → settings/env (fallback legado) */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  // 1. Tenta verificar via tabela users (com hash bcrypt)
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return bcrypt.compare(password, user.passwordHash);
    }
  } catch {
    // DB indisponível — cai no fallback
  }

  // 2. Fallback: settings table / env vars (compatibilidade retroativa)
  const adminEmail    = await getSetting("admin_email",    process.env.ADMIN_EMAIL    ?? "");
  const adminPassword = await getSetting("admin_password", process.env.ADMIN_PASSWORD ?? "");
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}
