import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // =========================
    // CLIENT
    // =========================

    if (token?.role === "CLIENT") {
      // Le client a uniquement accès à nouvelle_commande
      if (
        pathname !== "/nouvelle_commande" &&
        !pathname.startsWith("/nouvelle_commande/")
      ) {
        return NextResponse.redirect(
          new URL("/nouvelle_commande", req.url)
        );
      }
    }

    // =========================
    // ADMIN
    // =========================

    if (token?.role === "ADMIN") {
      // L'admin peut accéder à toutes les pages protégées
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/commandes/:path*",
    "/nouvelle_commande/:path*",
    "/parametres/:path*",
    "/admin/:path*",
  ],
};
