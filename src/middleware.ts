import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a simple response with basic security headers
  const response = NextResponse.next()
  
  // Essential security headers only
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HSTS for HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

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