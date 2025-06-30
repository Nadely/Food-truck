import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/api/auth',
  '/nouvelle_commande' // à ouvrir plus tard pour les clients
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the path is public
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for NextAuth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login page (which is now the root)
  if (!token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token and they're trying to access a public-only path like login, redirect them
  // This part is optional but good practice. For now, let's stick to protection.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
};
