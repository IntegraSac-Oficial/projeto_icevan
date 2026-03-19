import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_token";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? "fallback-secret";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Propagar header x-is-admin para o root layout suprimir Header/Footer do site
  const requestHeaders = new Headers(request.headers);
  if (pathname.startsWith("/admin")) {
    requestHeaders.set("x-is-admin", "1");
  }

  // Permitir acesso à página e API de login sem autenticação
  const publicPaths = [
    "/admin/login",
    "/api/admin/auth/login",
    "/api/admin/dev-credentials", // DEV only — bloqueado em produção no próprio handler
  ];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Verificar token para todas as outras rotas /admin/* e /api/admin/*
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // Página admin → redireciona para login
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // API admin → retorna 401
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
