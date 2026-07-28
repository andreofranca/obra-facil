import { NextRequest, NextResponse } from "next/server";
import { EdgeSessionDecoder } from "@/platform/security";

const protectedClientRoutes = [
  "/meus-pedidos",
  "/minhas-propostas",
  "/minhas-solicitacoes",
  "/solicitar-servico",
];

const protectedProfessionalRoutes = ["/profissional"];

export function proxy(request: NextRequest) {
  // Observability: Start of request
  const requestStart = Date.now();
  const requestId = crypto.randomUUID();
  const correlationId = request.headers.get("x-correlation-id") || requestId;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-correlation-id", correlationId);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-request-start", requestStart.toString());

  // Log routing attempt if it's an API route (since API routes wrap it for actual execution time)
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  if (isApiRoute) {
    console.log(JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      correlationId,
      module: "Middleware",
      action: "REQUEST_ROUTED",
      path: request.nextUrl.pathname,
      method: request.method,
      message: `Routing request for ${request.method} ${request.nextUrl.pathname}`
    }));
  }

  // Auth & Proxy logic
  const { pathname } = request.nextUrl;
  const sessionCookieName = "obra_facil_session";
  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  const isClientRoute = protectedClientRoutes.some((route) => pathname.startsWith(route));
  const isProfessionalRoute = protectedProfessionalRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = isClientRoute || isProfessionalRoute;

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute && sessionCookie) {
    const sessionData = EdgeSessionDecoder.decodeUnverifiedPayload<{ role?: string }>(sessionCookie);
    
    if (!sessionData || !sessionData.role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = sessionData.role;

    if (isClientRoute && role !== "CLIENT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProfessionalRoute && role !== "PROFESSIONAL" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Continue with injected headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-correlation-id", correlationId);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
