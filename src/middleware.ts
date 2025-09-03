import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Basic route configuration
  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/auth')
  const isPublicPage = ['/', '/pricing', '/about', '/contact', '/welcome', '/adventure-selection', '/adventure-hub', '/intro', '/role-selection', '/avatar-generation', '/challenges', '/qr-scan', '/ranking'].includes(url.pathname)
  const isApiRoute = url.pathname.startsWith('/api')
  const isPublicApiRoute = ['/api/health', '/api/webhook'].some(route => 
    url.pathname.startsWith(route)
  )

  // Security Headers (production-ready from AXIS6 patterns)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
    "frame-src 'self' https://*.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  // Set security headers
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  
  // HSTS header for HTTPS enforcement
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Rate limiting headers (informational)
  response.headers.set('X-RateLimit-Limit', '1000')
  response.headers.set('X-RateLimit-Remaining', '999')

  // Simplified routing - allow all requests for now
  // TODO: Re-enable auth protection once Supabase is configured
  
  return response
}

// TODO: Re-enable authentication functions once Supabase is configured
// Helper function to validate API keys - DISABLED FOR NOW
// async function validateApiKey(apiKey: string, supabase: any): Promise<boolean> { ... }

// Helper function to get user profile - DISABLED FOR NOW  
// async function getUserProfile(userId: string, supabase: any) { ... }

// Helper function to extract organization slug from path - DISABLED FOR NOW
// function extractOrgSlugFromPath(pathname: string): string | null { ... }

// Helper function to check organization access - DISABLED FOR NOW
// async function checkOrganizationAccess(userId: string, orgSlug: string, supabase: any): Promise<boolean> { ... }

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder
   * - .well-known (for SSL certificates, etc.)
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}