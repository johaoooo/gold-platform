import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Pages protégées — dashboard uniquement
  const isProtected = pathname.startsWith('/dashboard');

  // Si pas de token et page protégée → rediriger vers connexion
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // /projets est volontairement ABSENT → accessible sans connexion
  matcher: ['/dashboard/:path*'],
};
