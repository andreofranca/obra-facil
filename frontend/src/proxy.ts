import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedClientRoutes = [
  "/meus-pedidos",
  "/minhas-propostas",
  "/minhas-solicitacoes",
  "/solicitar-servico",
];

const protectedProfessionalRoutes = ["/profissional"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookieName = "obra_facil_session";
  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  const isClientRoute = protectedClientRoutes.some(
    (route) => pathname.startsWith(route)
  );
  
  const isProfessionalRoute = protectedProfessionalRoutes.some(
    (route) => pathname.startsWith(route)
  );

  const isProtectedRoute = isClientRoute || isProfessionalRoute;

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Parse unverified session just to route based on Role (since full crypto verify is on backend)
  if (isProtectedRoute && sessionCookie) {
    try {
      const [payloadBase64] = sessionCookie.split(".");
      if (payloadBase64) {
        const decodedPayload = Buffer.from(payloadBase64, "base64url").toString(
          "utf8"
        );
        const sessionData = JSON.parse(decodedPayload);
        const role = sessionData.role;

        if (isClientRoute && role !== "CLIENT" && role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", request.url));
        }

        if (isProfessionalRoute && role !== "PROFESSIONAL" && role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch {
      // Invalid cookie format
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
