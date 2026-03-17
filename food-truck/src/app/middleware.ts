import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/reset-password',
  '/api/auth',
  '/nouvelle_commande',
  '/horaires',
];

const PUBLIC_API_PATHS = [
  '/api/panier',
  '/api/products',
  '/api/losses-history',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // APIs publiques (nécessaires pour nouvelle commande / horaires)
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Pages publiques
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Check for NextAuth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login page (which is now the root)
  if (!token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token as any)?.role as string | undefined;
  const isAdmin = role === 'admin';

  if (!isAdmin) {
    // Autoriser uniquement nouvelle_commande et horaires pour le client connecté
    if (
      pathname === '/nouvelle_commande' ||
      pathname.startsWith('/nouvelle_commande/') ||
      pathname === '/horaires' ||
      pathname.startsWith('/horaires/')
    ) {
      return NextResponse.next();
    }

    // Bloquer le reste
    const redirectUrl = new URL('/nouvelle_commande', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
};
