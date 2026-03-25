import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Pages publiques
  const publicPages = ['/connexion', '/inscription'];
  const isPublicPage = publicPages.some((p) => pathname === p);
  
  // Pages protégées
  const isProtected = pathname.startsWith('/dashboard');

  // Si pas de token et page protégée → rediriger vers connexion
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  // Si token et page publique → NE PAS rediriger automatiquement
  // L'utilisateur choisit de se déconnecter s'il le souhaite
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/connexion', '/inscription'],
};
